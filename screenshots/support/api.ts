import { APIRequestContext, request } from '@playwright/test';
import { env } from './env';

// Minimal client for logging in and creating the fresh public links the
// candidate and reference forms need. Mirrors app.vitay.io/e2e/support/api.ts.

export async function login(email: string, password: string): Promise<string> {
  const ctx = await request.newContext({ baseURL: env.hosts.api });
  try {
    const res = await ctx.post('/api/v3/oauth/login', { data: { email, password } });
    if (!res.ok()) throw new Error(`login ${email} → ${res.status()}: ${(await res.text()).slice(0, 300)}`);
    const token: string | undefined = (await res.json())?.data?.attributes?.token;
    if (!token) throw new Error('Login response carried no token');
    if (claims(token).mfa_pending) {
      throw new Error(`${email} has an MFA factor enrolled; the docs users must not.`);
    }
    return token;
  } finally {
    await ctx.dispose();
  }
}

function claims(token: string): { recruiter_id?: string; mfa_pending?: boolean } {
  return JSON.parse(Buffer.from(token.split('.')[1] ?? '', 'base64url').toString('utf8'));
}

export class DocsApi {
  private readonly created: string[] = [];
  private constructor(private readonly ctx: APIRequestContext, private readonly token: string) {}

  static async create(token: string): Promise<DocsApi> {
    const ctx = await request.newContext({
      baseURL: env.hosts.api,
      extraHTTPHeaders: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    });
    return new DocsApi(ctx, token);
  }

  private async post(path: string, body: unknown): Promise<string> {
    const res = await this.ctx.post(path, { data: body });
    if (!res.ok()) throw new Error(`POST ${path} → ${res.status()}: ${(await res.text()).slice(0, 300)}`);
    return String((await res.json()).data.id);
  }

  private async defaultQuestionSetId(): Promise<string> {
    const res = await this.ctx.get('/api/v1/question_sets', {
      params: { 'page[page_size]': 50, 'filter[qs]': 'scope:reference' }
    });
    const sets: any[] = (await res.json()).data ?? [];
    const chosen = sets.find((s) => s.attributes?.is_default) ?? sets[0];
    if (!chosen) throw new Error('The docs firm has no reference question set');
    return String(chosen.id);
  }

  // A realistic-looking candidate, so the public forms greet a real name.
  private async candidate(tag: string): Promise<string> {
    const [local, domain] = env.inbox.split('@');
    const id = await this.post('/api/v3/candidates', {
      data: {
        type: 'Candidate',
        attributes: {
          first_name: 'Jordan',
          last_name: 'Ellis',
          email: `${local}+docs-${Date.now().toString(36)}-${tag}@${domain}`,
          country_code: '1',
          granted_permission: true
        }
      }
    });
    this.created.push(id);
    return id;
  }

  async referenceRequestId(): Promise<string> {
    const candidateId = await this.candidate('req');
    return this.post('/api/v1/reference_requests', {
      data: {
        type: 'ReferenceRequest',
        attributes: { min_manager_references: 1, is_manager_only: false, language: 'en', notes: '' },
        relationships: {
          candidate: { type: 'Candidate', id: candidateId },
          question_set: { type: 'QuestionSet', id: await this.defaultQuestionSetId() },
          request_by: { type: 'Recruiter', id: claims(this.token).recruiter_id }
        }
      }
    });
  }

  async publicReferenceId(): Promise<string> {
    const candidateId = await this.candidate('ref');
    const [local, domain] = env.inbox.split('@');
    return this.post('/api/v1/references', {
      data: {
        type: 'Reference',
        attributes: {
          first_name: 'Morgan',
          last_name: 'Reyes',
          email: `${local}+docs-${Date.now().toString(36)}-referee@${domain}`,
          country_code: '1',
          company_name: 'Northwind Health',
          title: 'Operations Manager',
          relationship: 'D',
          language: 'en'
        },
        relationships: {
          candidate: { type: 'Candidate', id: candidateId },
          question_set: { type: 'QuestionSet', id: await this.defaultQuestionSetId() }
        }
      }
    });
  }

  // Throwaway candidates go to the recycle bin so they don't show up in
  // later list screenshots.
  async cleanup(): Promise<void> {
    if (this.created.length) {
      await this.ctx.post('/api/v3/candidates/bulk_deactivate', { data: { ids: this.created.splice(0) } });
    }
    await this.ctx.dispose();
  }
}
