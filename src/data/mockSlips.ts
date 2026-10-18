export interface MatchSelection {
  id: string;
  match: string;
  league: string;
  kickoff: string;
  pick: string;
  odds: number;
  confidence: number;
}

export interface TipsterProfile {
  name: string;
  handle: string;
  avatarBg: string;
  winRate: string;
  badge: string;
  followers: string;
  verified: boolean;
}

export interface TipsterSlip {
  id: string;
  tipster: TipsterProfile;
  title: string;
  category: 'Banker' | 'High Odds' | 'Goals' | 'Combo' | 'VIP';
  totalOdds: number;
  matchesCount: number;
  validityTime: string;
  amount: string;
  isFree: boolean;
  confidence: number;
  bookingCode: string;
  selections: MatchSelection[];
}

export const MOCK_SLIPS: TipsterSlip[] = [
  {
    id: 'slip-1',
    tipster: {
      name: 'Captain Odds',
      handle: '@captain_odds',
      avatarBg: '#3B82F6',
      winRate: '86% Win Rate',
      badge: 'TOP TIPSTER 🔥',
      followers: '24.5k',
      verified: true,
    },
    title: 'Weekend 4-Fold Banker Combo',
    category: 'Banker',
    totalOdds: 5.48,
    matchesCount: 4,
    validityTime: 'Valid for 1h 35m',
    amount: 'Free',
    isFree: true,
    confidence: 89,
    bookingCode: 'BW-94821',
    selections: [
      {
        id: 's1-1',
        match: 'Arsenal vs Chelsea',
        league: 'Premier League',
        kickoff: 'Today 19:30',
        pick: 'Arsenal to Win (1)',
        odds: 1.65,
        confidence: 88,
      },
      {
        id: 's1-2',
        match: 'Real Madrid vs Sevilla',
        league: 'La Liga',
        kickoff: 'Today 21:00',
        pick: 'Real Madrid Over 1.5 Team Goals',
        odds: 1.50,
        confidence: 90,
      },
      {
        id: 's1-3',
        match: 'Inter vs Juventus',
        league: 'Serie A',
        kickoff: 'Today 20:45',
        pick: 'Both Teams to Score (BTTS)',
        odds: 1.78,
        confidence: 84,
      },
      {
        id: 's1-4',
        match: 'Bayern Munich vs Dortmund',
        league: 'Bundesliga',
        kickoff: 'Today 20:30',
        pick: 'Over 2.5 Total Goals',
        odds: 1.25,
        confidence: 94,
      },
    ],
  },
  {
    id: 'slip-2',
    tipster: {
      name: 'Goal Master AI',
      handle: '@goal_master',
      avatarBg: '#8B5CF6',
      winRate: '82% Win Rate',
      badge: 'AI PREDICTOR 🤖',
      followers: '18.2k',
      verified: true,
    },
    title: 'High Odds Goal Rush Ticket',
    category: 'Goals',
    totalOdds: 14.65,
    matchesCount: 5,
    validityTime: 'Valid for 3h 10m',
    amount: 'KES 50',
    isFree: false,
    confidence: 76,
    bookingCode: 'BW-38194',
    selections: [
      {
        id: 's2-1',
        match: 'Liverpool vs Aston Villa',
        league: 'Premier League',
        kickoff: 'Today 22:00',
        pick: 'Over 3.5 Goals',
        odds: 2.10,
        confidence: 78,
      },
      {
        id: 's2-2',
        match: 'PSG vs Marseille',
        league: 'Ligue 1',
        kickoff: 'Today 21:45',
        pick: 'Over 2.5 & BTTS',
        odds: 1.95,
        confidence: 80,
      },
      {
        id: 's2-3',
        match: 'Leverkusen vs Leipzig',
        league: 'Bundesliga',
        kickoff: 'Today 20:30',
        pick: 'Over 2.5 Goals',
        odds: 1.62,
        confidence: 85,
      },
      {
        id: 's2-4',
        match: 'Napoli vs Roma',
        league: 'Serie A',
        kickoff: 'Today 21:00',
        pick: 'Both Teams to Score',
        odds: 1.82,
        confidence: 75,
      },
      {
        id: 's2-5',
        match: 'Ajax vs Feyenoord',
        league: 'Eredivisie',
        kickoff: 'Today 21:00',
        pick: 'Over 2.5 Goals',
        odds: 1.50,
        confidence: 88,
      },
    ],
  },
  {
    id: 'slip-3',
    tipster: {
      name: 'Sniper Bets',
      handle: '@sniper_bets',
      avatarBg: '#EC4899',
      winRate: '91% Win Rate',
      badge: 'STREAK 9W 🔥',
      followers: '31.8k',
      verified: true,
    },
    title: 'Super Safe Double (91% Banker)',
    category: 'Banker',
    totalOdds: 2.38,
    matchesCount: 2,
    validityTime: 'Valid for 50m',
    amount: 'Free',
    isFree: true,
    confidence: 93,
    bookingCode: 'BW-11209',
    selections: [
      {
        id: 's3-1',
        match: 'Manchester City vs Wolves',
        league: 'Premier League',
        kickoff: 'Today 17:00',
        pick: 'Man City Win & Over 1.5 Goals',
        odds: 1.42,
        confidence: 95,
      },
      {
        id: 's3-2',
        match: 'Barcelona vs Valencia',
        league: 'La Liga',
        kickoff: 'Today 18:30',
        pick: 'Barcelona to Win (1)',
        odds: 1.68,
        confidence: 92,
      },
    ],
  },
  {
    id: 'slip-4',
    tipster: {
      name: 'VIP Elite Club',
      handle: '@vip_elite',
      avatarBg: '#F59E0B',
      winRate: '88% Win Rate',
      badge: 'EXCLUSIVE VIP 👑',
      followers: '45.1k',
      verified: true,
    },
    title: 'Weekend 32.00 Mega Parlay',
    category: 'VIP',
    totalOdds: 32.40,
    matchesCount: 6,
    validityTime: 'Valid for 2h 20m',
    amount: 'KES 100',
    isFree: false,
    confidence: 72,
    bookingCode: 'BW-88741',
    selections: [
      {
        id: 's4-1',
        match: 'Newcastle vs Tottenham',
        league: 'Premier League',
        kickoff: 'Today 19:30',
        pick: 'Both Teams to Score & Over 2.5',
        odds: 1.90,
        confidence: 82,
      },
      {
        id: 's4-2',
        match: 'Atalanta vs AC Milan',
        league: 'Serie A',
        kickoff: 'Today 20:45',
        pick: 'Atalanta Draw No Bet',
        odds: 1.75,
        confidence: 76,
      },
      {
        id: 's4-3',
        match: 'Atletico Madrid vs Bilbao',
        league: 'La Liga',
        kickoff: 'Today 22:00',
        pick: 'Under 2.5 Goals',
        odds: 1.85,
        confidence: 79,
      },
      {
        id: 's4-4',
        match: 'Sporting CP vs Porto',
        league: 'Primeira Liga',
        kickoff: 'Today 21:30',
        pick: 'Over 1.5 Total Goals',
        odds: 1.35,
        confidence: 90,
      },
      {
        id: 's4-5',
        match: 'Galatasaray vs Besiktas',
        league: 'Super Lig',
        kickoff: 'Today 20:00',
        pick: 'Both Teams to Score',
        odds: 1.72,
        confidence: 78,
      },
      {
        id: 's4-6',
        match: 'Celtic vs Rangers',
        league: 'Premiership',
        kickoff: 'Today 19:00',
        pick: 'Celtic to Win (1)',
        odds: 1.95,
        confidence: 75,
      },
    ],
  },
];

