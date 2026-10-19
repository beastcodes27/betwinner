import type { ImageSourcePropType } from 'react-native';
import { colors } from '@/constants/theme';
import {
  BOOKMAKER_LOGOS,
  FEATURED_MATCH,
  HOME_ADS,
  MOCK_SLIPS,
  TEAM_LOGOS,
  TIPSTER_AVATARS,
  type FeaturedMatch,
  type FollowedTipster,
  type HomeAd,
  type MatchSelection,
  type TipsterProfile,
  type TipsterSlip,
} from '@/data/mockSlips';
import {
  MOCK_PAYMENTS,
  MOCK_PURCHASED_SLIPS,
  type PaymentTransaction,
  type PurchasedSlip,
} from '@/data/mockUserData';
import { VIP_PLANS, type VipPlan } from '@/data/vipPlans';
import type {
  ApiBetslip,
  ApiFeaturedMatch,
  ApiHomeAd,
  ApiHomeResponse,
  ApiPoll,
  ApiProfile,
  ApiPurchasedSlip,
  ApiTipster,
  ApiTransaction,
  ApiVipPlan,
} from './api';

const AVATAR_BY_HANDLE: Record<string, ImageSourcePropType> = {
  '@captain_odds': TIPSTER_AVATARS.juma,
  '@sniper_bets': TIPSTER_AVATARS.mwamba,
  '@goal_master': TIPSTER_AVATARS.kassim,
  '@vip_elite': TIPSTER_AVATARS.vip_elite,
  '@draw_tactics': TIPSTER_AVATARS.tactical_pro,
};

export interface PollState {
  id: number;
  isLive: boolean;
  homeVotes: number;
  drawVotes: number;
  awayVotes: number;
  totalVotes: number;
}

export interface HomeFeedState {
  ads: HomeAd[];
  featuredMatch: FeaturedMatch;
  poll: PollState;
  rotationIntervalMs: number;
  topTipsters: FollowedTipster[];
}

export interface ProfileUserState {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  walletBalance: number;
}

export interface ProfileStatsState {
  purchasedSlips: number;
  activeSlips: number;
  wonSlips: number;
  totalSpent: number;
  totalDeposited: number;
}

export interface ProfileState {
  user: ProfileUserState;
  stats: ProfileStatsState;
  vip: {
    isActive: boolean;
    planName: string | null;
    expiresAt: string | null;
  };
  purchasedSlips: PurchasedSlip[];
  payments: PaymentTransaction[];
}

const FALLBACK_POLL: PollState = {
  id: 0,
  isLive: true,
  homeVotes: 8420,
  drawVotes: 2140,
  awayVotes: 3860,
  totalVotes: 14420,
};

const FALLBACK_SPENT = MOCK_PAYMENTS.filter((payment) => payment.amount < 0).reduce(
  (total, payment) => total + Math.abs(payment.amount),
  0,
);

const FALLBACK_DEPOSITED = MOCK_PAYMENTS.filter((payment) => payment.amount > 0).reduce(
  (total, payment) => total + payment.amount,
  0,
);

export const FALLBACK_HOME: HomeFeedState = {
  ads: HOME_ADS,
  featuredMatch: FEATURED_MATCH,
  poll: FALLBACK_POLL,
  rotationIntervalMs: 3000,
  topTipsters: [],
};

export const FALLBACK_PROFILE: ProfileState = {
  user: {
    id: 0,
    name: 'Alex Bettor',
    email: 'alex.bettor@gmail.com',
    phone: '+255 712 *** 890',
    avatarUrl: null,
    walletBalance: FALLBACK_DEPOSITED - FALLBACK_SPENT,
  },
  stats: {
    purchasedSlips: MOCK_PURCHASED_SLIPS.length,
    activeSlips: MOCK_PURCHASED_SLIPS.filter((slip) => slip.status === 'active').length,
    wonSlips: MOCK_PURCHASED_SLIPS.filter((slip) => slip.status === 'won').length,
    totalSpent: FALLBACK_SPENT,
    totalDeposited: FALLBACK_DEPOSITED,
  },
  vip: {
    isActive: false,
    planName: null,
    expiresAt: null,
  },
  purchasedSlips: MOCK_PURCHASED_SLIPS,
  payments: MOCK_PAYMENTS,
};

export const FALLBACK_SLIPS = MOCK_SLIPS;

export function formatTshs(amount: number): string {
  return `Tshs ${Math.round(amount).toLocaleString()}`;
}

function formatFollowers(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }

  return String(count);
}

function formatDate(value: string | null): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function bookmakerLogo(slug?: string | null): ImageSourcePropType | undefined {
  if (!slug) {
    return undefined;
  }

  return BOOKMAKER_LOGOS[slug.toLowerCase() as keyof typeof BOOKMAKER_LOGOS];
}

function teamLogo(name?: string | null): ImageSourcePropType | undefined {
  if (!name) {
    return undefined;
  }

  const key = name.toLowerCase() as keyof typeof TEAM_LOGOS;

  return TEAM_LOGOS[key];
}

function tipsterAvatar(handle?: string | null, avatarUrl?: string | null): ImageSourcePropType {
  if (avatarUrl) {
    return { uri: avatarUrl };
  }

  return AVATAR_BY_HANDLE[(handle ?? '').toLowerCase()] ?? TIPSTER_AVATARS.alex_user;
}

export function apiTipsterToProfile(tipster: ApiTipster): TipsterProfile {
  return {
    name: tipster.displayName,
    handle: tipster.handle,
    avatarBg: tipster.avatarBg ?? colors.cardInner,
    avatarUrl: tipsterAvatar(tipster.handle, tipster.avatarUrl),
    winRate: `${Math.round(tipster.winRate)}% Win Rate`,
    badge: tipster.badge ?? 'VERIFIED TIPSTER',
    followers: formatFollowers(tipster.followersCount),
    verified: tipster.isVerified,
  };
}

export function apiTipsterToFollowed(tipster: ApiTipster): FollowedTipster {
  return {
    id: String(tipster.id),
    ...apiTipsterToProfile(tipster),
    specialty: tipster.specialty ?? 'Football Predictions',
    streak: tipster.streak ?? '0W Streak',
    activeSlipsCount: tipster.activeSlipsCount,
    latestSlip: tipster.latestSlip ? apiBetslipToSlip(tipster.latestSlip) : undefined,
    notificationsEnabled: true,
    isFollowing: true,
  };
}

export function apiBetslipToSlip(slip: ApiBetslip): TipsterSlip {
  const tipster = slip.tipster ? apiTipsterToProfile(slip.tipster) : {
    name: 'Tipster',
    handle: '',
    avatarBg: colors.cardInner,
    winRate: '0% Win Rate',
    badge: 'TIPSTER',
    followers: '0',
    verified: false,
  };

  return {
    id: String(slip.id),
    tipster,
    title: slip.title,
    category: slip.category,
    totalOdds: slip.totalOdds,
    matchesCount: slip.matchesCount,
    validityTime: slip.validityTime,
    amount: slip.amount,
    isFree: slip.isFree,
    isUnlocked: slip.isUnlocked,
    confidence: slip.confidence,
    bookmaker: slip.bookmaker?.name ?? 'Bookmaker',
    bookmakerLogo: bookmakerLogo(slip.bookmaker?.slug),
    bookingCode: slip.bookingCode,
    selections: slip.selections.map((selection): MatchSelection => ({
      id: String(selection.id),
      match: selection.match,
      league: selection.league,
      kickoff: selection.kickoff,
      pick: selection.pick,
      odds: selection.odds,
      confidence: selection.confidence,
    })),
  };
}

function apiAdToAd(ad: ApiHomeAd): HomeAd {
  return {
    id: String(ad.id),
    badge: ad.badge,
    title: ad.title,
    subtitle: ad.subtitle,
    highlight: ad.highlight,
    ctaText: ad.ctaText,
    promoCode: ad.promoCode ?? undefined,
    bookmaker: ad.bookmaker?.name,
    bookmakerLogo: bookmakerLogo(ad.bookmaker?.slug),
  };
}

function apiMatchToMatch(match: ApiFeaturedMatch): FeaturedMatch {
  return {
    id: String(match.id),
    league: match.league,
    leagueLogo: undefined,
    kickoff: match.kickoff,
    venue: match.venue,
    bookmaker: match.bookmaker?.name ?? 'Bookmaker',
    bookmakerLogo: bookmakerLogo(match.bookmaker?.slug),
    homeTeam: {
      name: match.homeTeam.name,
      code: match.homeTeam.code,
      logo: teamLogo(match.homeTeam.name),
      color: match.homeTeam.color,
      form: match.homeTeam.form,
      odds: match.homeTeam.odds,
    },
    awayTeam: {
      name: match.awayTeam.name,
      code: match.awayTeam.code,
      logo: teamLogo(match.awayTeam.name),
      color: match.awayTeam.color,
      form: match.awayTeam.form,
      odds: match.awayTeam.odds,
    },
    draw: {
      odds: match.draw.odds,
    },
    tipsterConsensus: match.tipsterConsensus ?? '',
  };
}

export function apiPollToState(poll: ApiPoll): PollState {
  return {
    id: poll.id,
    isLive: poll.isLive,
    homeVotes: poll.homeVotes,
    drawVotes: poll.drawVotes,
    awayVotes: poll.awayVotes,
    totalVotes: poll.totalVotes,
  };
}

export function apiHomeToState(response: ApiHomeResponse): HomeFeedState {
  const { adsBoard, featuredMatch, communityPoll, topTipsters } = response.data;

  return {
    ads: adsBoard.banners.map(apiAdToAd),
    featuredMatch: featuredMatch ? apiMatchToMatch(featuredMatch) : FEATURED_MATCH,
    poll: communityPoll ? apiPollToState(communityPoll) : FALLBACK_POLL,
    rotationIntervalMs: adsBoard.rotationIntervalMs || 3000,
    topTipsters: topTipsters.map(apiTipsterToFollowed),
  };
}

function apiSelectionToSelection(selection: ApiPurchasedSlip['selections'][number]): MatchSelection {
  return {
    id: String(selection.id),
    match: selection.match,
    league: selection.league,
    kickoff: selection.kickoff,
    pick: selection.pick,
    odds: selection.odds,
    confidence: selection.confidence,
  };
}

function apiPurchasedSlipToSlip(slip: ApiPurchasedSlip): PurchasedSlip {
  return {
    id: String(slip.id),
    slipId: String(slip.betslipId),
    title: slip.title,
    tipsterName: slip.tipsterName,
    tipsterHandle: slip.tipsterHandle,
    tipsterAvatarBg: slip.tipsterAvatarBg ?? colors.cardInner,
    tipsterAvatarUrl: tipsterAvatar(slip.tipsterHandle, slip.tipsterAvatarUrl),
    bookmaker: slip.bookmaker,
    bookmakerLogo: bookmakerLogo(slip.bookmakerSlug),
    bookingCode: slip.bookingCode,
    totalOdds: slip.totalOdds,
    matchesCount: slip.matchesCount,
    purchaseDate: formatDate(slip.purchaseDate),
    amountPaid: slip.amountPaid,
    status: slip.status,
    validUntil: slip.validUntil ?? '',
    selections: slip.selections.map(apiSelectionToSelection),
  };
}

function apiTransactionToPayment(transaction: ApiTransaction): PaymentTransaction {
  const method = transaction.method as PaymentTransaction['method'];

  return {
    id: String(transaction.id),
    reference: transaction.reference,
    type: transaction.type,
    description: transaction.description,
    method,
    amount: transaction.amount,
    currency: transaction.currency,
    date: formatDate(transaction.date),
    status: transaction.status,
  };
}

export function apiProfileToState(profile: ApiProfile): ProfileState {
  return {
    user: {
      id: profile.user.id,
      name: profile.user.name,
      email: profile.user.email,
      phone: profile.user.phone ?? '',
      avatarUrl: profile.user.avatarUrl,
      walletBalance: profile.user.walletBalance,
    },
    stats: profile.stats,
    vip: profile.vip,
    purchasedSlips: profile.purchasedSlips.map(apiPurchasedSlipToSlip),
    payments: profile.transactions.map(apiTransactionToPayment),
  };
}

export function apiVipPlansToVipPlans(plans: ApiVipPlan[]): VipPlan[] {
  const mapped = plans
    .filter((plan) => ['single', 'weekly', 'monthly'].includes(plan.id))
    .map((plan): VipPlan => ({
      id: plan.id as VipPlan['id'],
      name: plan.name,
      duration: plan.durationDays <= 1 ? '1 Ticket Access' : `${plan.durationDays} Days Unlimited`,
      price: formatTshs(plan.price),
      amountNum: plan.price,
      badge: plan.id === 'weekly' ? 'POPULAR' : plan.id === 'monthly' ? 'BEST VALUE' : undefined,
      description: plan.description ?? '',
    }));

  return mapped.length > 0 ? mapped : VIP_PLANS;
}
