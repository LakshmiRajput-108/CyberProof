
import { API_BASE_URL } from '../config/api';

const TOKEN_KEY = 'cyberproof_auth_token';
const GUEST_TOKEN_KEY = 'cyberproof_guest_token';
export const MEMBER_SESSION_EXPIRED_EVENT = 'cyberproof:member-session-expired';

export class ApiNetworkError extends Error {
  constructor() {
    super('Could not reach CyberProof. Check your connection and try again.');
    this.name = 'ApiNetworkError';
  }
}

export class ApiHttpError extends Error {
  constructor(public readonly status: number) {
    super(`CyberProof request failed with HTTP ${status}.`);
    this.name = 'ApiHttpError';
  }
}

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const memberToken = localStorage.getItem(TOKEN_KEY);
  const guestToken = localStorage.getItem(GUEST_TOKEN_KEY);

  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  // A member token takes priority over a guest token.
  if (memberToken) {
    headers.set('Authorization', `Bearer ${memberToken}`);
    headers.delete('X-Guest-Session');
  } else if (guestToken) {
    headers.set('X-Guest-Session', guestToken);
    headers.delete('Authorization');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiNetworkError();
  }

  if (
    response.status === 401 &&
    memberToken &&
    typeof window !== 'undefined'
  ) {
    window.dispatchEvent(
      new CustomEvent<string>(MEMBER_SESSION_EXPIRED_EVENT, { detail: memberToken })
    );
  }

  return response;
};