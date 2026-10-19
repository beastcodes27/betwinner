import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { ALL_TIPSTERS, type FollowedTipster, type TipsterSlip } from '@/data/mockSlips';
import { VIP_PLANS, type VipPlan } from '@/data/vipPlans';
import {
  getBetslips,
  getHome,
  getProfile,
  getTipsters,
  getVipPlans,
  removeProfileAvatar,
  subscribeToVip,
  trackAdClick,
  unlockBetslip,
  uploadProfileAvatar,
  voteOnPoll,
} from '@/lib/api';
import {
  FALLBACK_HOME,
  FALLBACK_PROFILE,
  FALLBACK_SLIPS,
  apiBetslipToSlip,
  apiHomeToState,
  apiPollToState,
  apiProfileToState,
  apiTipsterToFollowed,
  apiVipPlansToVipPlans,
  type HomeFeedState,
  type ProfileState,
} from '@/lib/adapters';

type VoteChoice = '1' | 'X' | '2';

interface AppDataContextValue {
  home: HomeFeedState;
  slips: TipsterSlip[];
  tipsters: FollowedTipster[];
  profile: ProfileState;
  vipPlans: VipPlan[];
  userId: number | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isUsingFallback: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  vote: (choice: VoteChoice) => Promise<void>;
  recordAdClick: (adId: string) => Promise<void>;
  unlockSlip: (slipId: string) => Promise<string>;
  subscribeVip: (planId: VipPlan['id']) => Promise<void>;
  uploadAvatar: (uri: string) => Promise<string | null>;
  removeAvatar: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to reach the backend.';
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [home, setHome] = useState<HomeFeedState>(FALLBACK_HOME);
  const [slips, setSlips] = useState<TipsterSlip[]>(FALLBACK_SLIPS);
  const [tipsters, setTipsters] = useState<FollowedTipster[]>(ALL_TIPSTERS);
  const [profile, setProfile] = useState<ProfileState>(FALLBACK_PROFILE);
  const [vipPlans, setVipPlans] = useState<VipPlan[]>(VIP_PLANS);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setError(null);

    try {
      const profileResponse = await getProfile();
      const activeUserId = profileResponse.data.user.id;

      const [homeResponse, betsResponse, tipstersResponse, plansResponse] = await Promise.all([
        getHome(),
        getBetslips(activeUserId),
        getTipsters(activeUserId),
        getVipPlans(),
      ]);

      setProfile(apiProfileToState(profileResponse.data));
      setHome(apiHomeToState(homeResponse));
      setSlips(betsResponse.data.map(apiBetslipToSlip));
      setTipsters(tipstersResponse.data.map(apiTipsterToFollowed));
      setVipPlans(apiVipPlansToVipPlans(plansResponse.data));
      setUserId(activeUserId);
      setIsUsingFallback(false);
    } catch (loadError) {
      setError(errorMessage(loadError));
      setIsUsingFallback(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadData();
  }, [loadData]);

  const vote = useCallback(
    async (choice: VoteChoice) => {
      const previousPoll = home.poll;

      setHome((current) => ({
        ...current,
        poll: {
          ...current.poll,
          homeVotes: current.poll.homeVotes + (choice === '1' ? 1 : 0),
          drawVotes: current.poll.drawVotes + (choice === 'X' ? 1 : 0),
          awayVotes: current.poll.awayVotes + (choice === '2' ? 1 : 0),
          totalVotes: current.poll.totalVotes + 1,
        },
      }));

      if (!previousPoll.id) {
        return;
      }

      try {
        const response = await voteOnPoll(previousPoll.id, choice, userId);

        setHome((current) => ({
          ...current,
          poll: apiPollToState(response.data),
        }));
      } catch (voteError) {
        setHome((current) => ({
          ...current,
          poll: previousPoll,
        }));

        throw voteError;
      }
    },
    [home.poll, userId],
  );

  const recordAdClick = useCallback(async (adId: string) => {
    const numericId = Number(adId);

    if (!Number.isFinite(numericId) || numericId <= 0) {
      return;
    }

    try {
      await trackAdClick(numericId);
    } catch {
      // Ad analytics are non-critical for the mobile flow.
    }
  }, []);

  const unlockSlip = useCallback(
    async (slipId: string) => {
      if (!userId) {
        throw new Error('Connect to the backend before unlocking VIP slips.');
      }

      const response = await unlockBetslip(Number(slipId), userId);
      const bookingCode = response.data.bookingCode;

      setSlips((current) =>
        current.map((slip) =>
          slip.id === slipId
            ? { ...slip, isUnlocked: true, bookingCode }
            : slip,
        ),
      );

      setTipsters((current) =>
        current.map((tipster) =>
          tipster.latestSlip?.id === slipId
            ? {
                ...tipster,
                latestSlip: {
                  ...tipster.latestSlip,
                  isUnlocked: true,
                  bookingCode,
                },
              }
            : tipster,
        ),
      );

      void refresh();

      return bookingCode;
    },
    [refresh, userId],
  );

  const subscribeVip = useCallback(
    async (planId: VipPlan['id']) => {
      if (!userId) {
        throw new Error('Connect to the backend before subscribing to VIP.');
      }

      await subscribeToVip(planId, userId);
      await refresh();
    },
    [refresh, userId],
  );

  const uploadAvatar = useCallback(
    async (uri: string) => {
      if (!userId) {
        throw new Error('Connect to the backend before uploading a profile picture.');
      }

      const response = await uploadProfileAvatar(uri, userId);
      const avatarUrl = response.data.avatarUrl;

      setProfile((current) => ({
        ...current,
        user: {
          ...current.user,
          avatarUrl,
        },
      }));

      return avatarUrl;
    },
    [userId],
  );

  const removeAvatar = useCallback(async () => {
    if (!userId) {
      return;
    }

    await removeProfileAvatar(userId);

    setProfile((current) => ({
      ...current,
      user: {
        ...current.user,
        avatarUrl: null,
      },
    }));
  }, [userId]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      home,
      slips,
      tipsters,
      profile,
      vipPlans,
      userId,
      isLoading,
      isRefreshing,
      isUsingFallback,
      error,
      refresh,
      vote,
      recordAdClick,
      unlockSlip,
      subscribeVip,
      uploadAvatar,
      removeAvatar,
    }),
    [
      home,
      slips,
      tipsters,
      profile,
      vipPlans,
      userId,
      isLoading,
      isRefreshing,
      isUsingFallback,
      error,
      refresh,
      vote,
      recordAdClick,
      unlockSlip,
      subscribeVip,
      uploadAvatar,
      removeAvatar,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }

  return context;
}
