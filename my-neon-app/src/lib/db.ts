export interface Prospect {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  title: string;
  company_name: string;
  company_website: string;
  industry: string;
  city: string;
  state: string;
  seo_score: number;
  web_score: number;
  social_score: number;
  maps_score: number;
  overall_score: number;
  status: string;
  referral_code: string;
  social_connection_tier: number | null;
  apollo_contact_id: string | null;
  email_verified: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface SurveyResponse {
  id: string;
  prospect_id: string;
  typeform_response_id: string;
  answers: Record<string, unknown>;
  submitted_at: string;
}

export async function getProspects(status?: string): Promise<Prospect[]> {
  const url = status ? `/api/prospects?status=${encodeURIComponent(status)}` : '/api/prospects';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch prospects');
  return res.json();
}

export async function getProspectById(id: string): Promise<Prospect | null> {
  const res = await fetch(`/api/prospects/${encodeURIComponent(id)}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch prospect');
  }
  return res.json();
}

export async function updateProspectStatus(id: string, status: string): Promise<void> {
  const res = await fetch(`/api/prospects/${encodeURIComponent(id)}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update prospect status');
}

export async function getSurveyResponses(): Promise<SurveyResponse[]> {
  const res = await fetch('/api/surveys');
  if (!res.ok) throw new Error('Failed to fetch survey responses');
  return res.json();
}

export async function getProspectStats() {
  const res = await fetch('/api/prospects/stats');
  if (!res.ok) throw new Error('Failed to fetch prospect stats');
  return res.json();
}
