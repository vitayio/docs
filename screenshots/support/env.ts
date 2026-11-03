// Run configuration, all from env vars. See README.md.

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set; see screenshots/README.md.`);
  return value;
}

// Hosts per frontend. Staging by default; set DOCS_TARGET=prod to capture
// from production (only with a dedicated demo firm there).
const HOSTS = {
  staging: {
    api: 'https://staging.api.vitay.io',
    references: 'https://staging.references.vitay.io',
    configuration: 'https://staging.configuration.vitay.io',
    admin: 'https://staging.admin.vitay.io'
  },
  prod: {
    api: 'https://api.vitay.io',
    references: 'https://references.vitay.io',
    configuration: 'https://configuration.vitay.io',
    admin: 'https://admin.vitay.io'
  }
} as const;

export type App = 'references' | 'configuration' | 'admin' | 'public-candidate' | 'public-referee';
export type Role = 'root' | 'recruiter' | 'none';

export const env = {
  get hosts() {
    const target = (process.env.DOCS_TARGET ?? 'staging') as keyof typeof HOSTS;
    const hosts = HOSTS[target];
    if (!hosts) throw new Error(`DOCS_TARGET must be one of ${Object.keys(HOSTS).join(', ')}`);
    return hosts;
  },
  credentials(role: Exclude<Role, 'none'>): { email: string; password: string } {
    const prefix = role === 'root' ? 'DOCS_ROOT' : 'DOCS_RECRUITER';
    return { email: required(`${prefix}_EMAIL`), password: required(`${prefix}_PASSWORD`) };
  },
  // The candidate and completed reference that recruiter-side pages
  // (:candidateId, :referenceId) are shown with. Pick ones with a full,
  // realistic history in the demo firm.
  get candidateId(): string {
    return required('DOCS_CANDIDATE_ID');
  },
  get referenceId(): string {
    return required('DOCS_REFERENCE_ID');
  },
  // A pre-screening with a completed questionnaire, for the pre-screening article.
  get preScreeningId(): string {
    return required('DOCS_PRE_SCREENING_ID');
  },
  // Public forms need fresh, unused links, created per run. Staging sends
  // real email, so they go to a plus-addressed inbox we own.
  get inbox(): string {
    return required('DOCS_INBOX');
  }
};

export function hostFor(app: App): string {
  const hosts = env.hosts;
  if (app === 'public-candidate' || app === 'public-referee') return hosts.references;
  return hosts[app];
}
