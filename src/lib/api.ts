import Constants from 'expo-constants';

const DEFAULT_API_PORT = 8000;

function resolveApiBaseUrl(): string {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];

  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    return `http://${host}:${DEFAULT_API_PORT}/api/v1`;
  }

  return `http://127.0.0.1:${DEFAULT_API_PORT}/api/v1`;
}

export const API_BASE_URL = resolveApiBaseUrl();

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  userId?: number | null;
  formData?: FormData;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (options.userId) {
    headers['X-User-Id'] = String(options.userId);
  }

  let body: RequestInit['body'];

  if (options.formData) {
    body = options.formData;
  } else if (options.body) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body,
      signal: controller.signal,
    });

    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(payload?.message ?? `Request failed with status ${response.status}`);
    }

    return payload as T;
  } finally {
    clearTimeout(timeout);
  }
}

export interface ApiBookmaker {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
  brandColor: string | null;
}

export interface ApiTipster {
  id: number;
  displayName: string;
  handle: string;
  avatarUrl: string | null;
  avatarBg: string | null;
  specialty: string | null;
  winRate: number;
  followersCount: number;
  isVerified: boolean;
  badge: string | null;
  streak: string | null;
  activeSlipsCount: number;
  latestSlip?: ApiBetslip | null;
}

export interface ApiSelection {
  id: number;
  match: string;
  league: string;
  kickoff: string;
  pick: string;
  odds: number;
  confidence: number;
}

export interface ApiBetslip {
  id: number;
  title: string;
  category: 'Banker' | 'High Odds' | 'Goals' | 'Combo' | 'VIP';
  tipster: ApiTipster | null;
  bookmaker: ApiBookmaker | null;
  totalOdds: number;
  matchesCount: number;
  validityTime: string;
  amount: string;
  isFree: boolean;
  isVip: boolean;
  isUnlocked: boolean;
  confidence: number;
  bookingCode: string;
  selections: ApiSelection[];
}

export interface ApiHomeAd {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  highlight: string;
  ctaText: string;
  promoCode: string | null;
  targetUrl: string | null;
  bookmaker: ApiBookmaker | null;
  displaySeconds: number;
}

export interface ApiFeaturedMatch {
  id: number;
  league: string;
  kickoff: string;
  venue: string;
  tipsterConsensus: string | null;
  isActive: boolean;
  bookmaker: ApiBookmaker | null;
  homeTeam: {
    name: string;
    code: string;
    logo: string | null;
    color: string;
    form: string;
    odds: number;
  };
  awayTeam: {
    name: string;
    code: string;
    logo: string | null;
    color: string;
    form: string;
    odds: number;
  };
  draw: {
    odds: number;
  };
}

export interface ApiPoll {
  id: number;
  featuredMatchId: number;
  isLive: boolean;
  homeVotes: number;
  drawVotes: number;
  awayVotes: number;
  totalVotes: number;
  homePercentage: number;
  drawPercentage: number;
  awayPercentage: number;
}

export interface ApiHomeResponse {
  status: 'success';
  currency: string;
  data: {
    adsBoard: {
      rotationIntervalMs: number;
      banners: ApiHomeAd[];
    };
    featuredMatch: ApiFeaturedMatch | null;
    communityPoll: ApiPoll | null;
    topTipsters: ApiTipster[];
  };
}

export interface ApiBetslipsResponse {
  status: 'success';
  currency: string;
  data: ApiBetslip[];
}

export interface ApiTipstersResponse {
  status: 'success';
  data: ApiTipster[];
}

export interface ApiVipPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  durationDays: number;
  description: string | null;
}

export interface ApiVipPlansResponse {
  status: 'success';
  data: ApiVipPlan[];
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  walletBalance: number;
  role: string;
}

export interface ApiPurchasedSlip {
  id: number;
  betslipId: number;
  title: string;
  tipsterName: string;
  tipsterHandle: string;
  tipsterAvatarUrl: string | null;
  tipsterAvatarBg: string | null;
  bookmaker: string;
  bookmakerSlug: string;
  bookingCode: string;
  totalOdds: number;
  matchesCount: number;
  purchaseDate: string | null;
  amountPaid: string;
  status: 'active' | 'won' | 'lost' | 'pending';
  validUntil: string | null;
  selections: ApiSelection[];
}

export interface ApiTransaction {
  id: number;
  reference: string;
  type: 'slip_purchase' | 'deposit' | 'withdrawal' | 'subscription';
  description: string;
  method: string;
  amount: number;
  currency: string;
  date: string | null;
  status: 'completed' | 'processing' | 'failed';
}

export interface ApiProfile {
  user: ApiUser;
  stats: {
    purchasedSlips: number;
    activeSlips: number;
    wonSlips: number;
    totalSpent: number;
    totalDeposited: number;
  };
  vip: {
    isActive: boolean;
    planName: string | null;
    expiresAt: string | null;
  };
  purchasedSlips: ApiPurchasedSlip[];
  transactions: ApiTransaction[];
}

export interface ApiProfileResponse {
  status: 'success';
  data: ApiProfile;
}

export interface ApiPollResponse {
  status: 'success';
  data: ApiPoll;
}

export interface ApiUnlockResponse {
  status: 'success';
  message: string;
  data: {
    betslipId: number;
    bookingCode: string;
    bookmaker: string | null;
  };
}

export interface ApiAvatarResponse {
  status: 'success';
  message: string;
  data: {
    userId: number;
    avatarUrl: string | null;
  };
}

export function getHome(): Promise<ApiHomeResponse> {
  return apiRequest<ApiHomeResponse>('/home');
}

export function getBetslips(userId?: number | null): Promise<ApiBetslipsResponse> {
  return apiRequest<ApiBetslipsResponse>('/betslips', { userId });
}

export function getTipsters(userId?: number | null): Promise<ApiTipstersResponse> {
  return apiRequest<ApiTipstersResponse>('/tipsters', { userId });
}

export function getProfile(): Promise<ApiProfileResponse> {
  return apiRequest<ApiProfileResponse>('/profile');
}

export function getVipPlans(): Promise<ApiVipPlansResponse> {
  return apiRequest<ApiVipPlansResponse>('/vip/plans');
}

export function unlockBetslip(betslipId: number, userId: number): Promise<ApiUnlockResponse> {
  return apiRequest<ApiUnlockResponse>(`/betslips/${betslipId}/unlock`, {
    method: 'POST',
    userId,
    body: {
      user_id: userId,
      payment_provider: 'mpesa',
    },
  });
}

export function subscribeToVip(planSlug: string, userId: number): Promise<unknown> {
  return apiRequest('/vip/subscribe', {
    method: 'POST',
    userId,
    body: {
      user_id: userId,
      plan_slug: planSlug,
      payment_provider: 'mpesa',
    },
  });
}

export function voteOnPoll(
  pollId: number,
  choice: '1' | 'X' | '2',
  userId?: number | null,
): Promise<ApiPollResponse> {
  return apiRequest<ApiPollResponse>(`/polls/${pollId}/vote`, {
    method: 'POST',
    userId,
    body: {
      user_id: userId ?? undefined,
      choice,
    },
  });
}

export function trackAdClick(adId: number): Promise<unknown> {
  return apiRequest(`/ads/${adId}/click`, { method: 'POST' });
}

export function uploadProfileAvatar(uri: string, userId: number): Promise<ApiAvatarResponse> {
  const formData = new FormData();
  const fileName = uri.split('/').pop() ?? `avatar-${Date.now()}.jpg`;
  const extension = fileName.split('.').pop()?.toLowerCase();
  const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';

  formData.append('avatar', {
    uri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);

  return apiRequest<ApiAvatarResponse>('/profile/avatar', {
    method: 'POST',
    userId,
    formData,
  });
}

export function removeProfileAvatar(userId: number): Promise<ApiAvatarResponse> {
  return apiRequest<ApiAvatarResponse>('/profile/avatar/remove', {
    method: 'POST',
    userId,
    body: {
      user_id: userId,
    },
  });
}
