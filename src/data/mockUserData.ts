import { MatchSelection, BOOKMAKER_LOGOS } from './mockSlips';

export interface PurchasedSlip {
  id: string;
  slipId: string;
  title: string;
  tipsterName: string;
  tipsterHandle: string;
  tipsterAvatarBg: string;
  bookmaker: string;
  bookmakerLogo?: any;
  bookingCode: string;
  totalOdds: number;
  matchesCount: number;
  purchaseDate: string;
  amountPaid: string;
  status: 'active' | 'won' | 'lost' | 'pending';
  validUntil: string;
  selections: MatchSelection[];
}

export interface PaymentTransaction {
  id: string;
  reference: string;
  type: 'slip_purchase' | 'deposit' | 'withdrawal';
  description: string;
  method: 'M-Pesa' | 'Airtel Money' | 'Card';
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'processing' | 'failed';
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Slips' | 'Payments' | 'General';
}

export const MOCK_PURCHASED_SLIPS: PurchasedSlip[] = [
  {
    id: 'purchased-1',
    slipId: 'slip-2',
    title: 'Weekend 6-Fold Mega Accumulator',
    tipsterName: 'Bet Master Pro',
    tipsterHandle: '@betmaster_ke',
    tipsterAvatarBg: '#10B981',
    bookmaker: 'SportyBet',
    bookmakerLogo: BOOKMAKER_LOGOS.sportybet,
    bookingCode: 'SPY-77192',
    totalOdds: 14.25,
    matchesCount: 6,
    purchaseDate: 'Today, 11:45 AM',
    amountPaid: 'Tshs 2,000',
    status: 'active',
    validUntil: 'Valid for 3h 15m',
    selections: [
      {
        id: 'ps1-1',
        match: 'Liverpool vs Man City',
        league: 'Premier League',
        kickoff: 'Today 18:30',
        pick: 'Both Teams to Score & Over 2.5',
        odds: 1.85,
        confidence: 92,
      },
      {
        id: 'ps1-2',
        match: 'Barcelona vs Atletico Madrid',
        league: 'La Liga',
        kickoff: 'Today 21:00',
        pick: 'Barcelona to Win or Draw (1X)',
        odds: 1.40,
        confidence: 88,
      },
      {
        id: 'ps1-3',
        match: 'Napoli vs AC Milan',
        league: 'Serie A',
        kickoff: 'Today 21:45',
        pick: 'Over 1.5 Second Half Goals',
        odds: 1.62,
        confidence: 85,
      },
      {
        id: 'ps1-4',
        match: 'Leverkusen vs Leipzig',
        league: 'Bundesliga',
        kickoff: 'Today 19:00',
        pick: 'Over 2.5 Total Goals',
        odds: 1.55,
        confidence: 91,
      },
      {
        id: 'ps1-5',
        match: 'PSG vs Marseille',
        league: 'Ligue 1',
        kickoff: 'Today 22:00',
        pick: 'PSG to Win (1)',
        odds: 1.48,
        confidence: 89,
      },
      {
        id: 'ps1-6',
        match: 'Ajax vs Feyenoord',
        league: 'Eredivisie',
        kickoff: 'Today 17:45',
        pick: 'Both Teams to Score (BTTS)',
        odds: 1.58,
        confidence: 87,
      },
    ],
  },
  {
    id: 'purchased-2',
    slipId: 'slip-3',
    title: 'Super Draw & High Odds Special',
    tipsterName: 'King of Draws',
    tipsterHandle: '@kingdraws',
    tipsterAvatarBg: '#F59E0B',
    bookmaker: 'Betika',
    bookmakerLogo: BOOKMAKER_LOGOS.betika,
    bookingCode: 'BTK-55201',
    totalOdds: 28.5,
    matchesCount: 3,
    purchaseDate: 'Yesterday, 04:20 PM',
    amountPaid: 'Tshs 3,500',
    status: 'active',
    validUntil: 'Valid for 5h 40m',
    selections: [
      {
        id: 'ps2-1',
        match: 'Torino vs Fiorentina',
        league: 'Serie A',
        kickoff: 'Tomorrow 16:00',
        pick: 'Full Time Draw (X)',
        odds: 3.1,
        confidence: 76,
      },
      {
        id: 'ps2-2',
        match: 'Getafe vs Osasuna',
        league: 'La Liga',
        kickoff: 'Tomorrow 18:15',
        pick: 'Full Time Draw (X)',
        odds: 2.95,
        confidence: 78,
      },
      {
        id: 'ps2-3',
        match: 'Brighton vs Newcastle',
        league: 'Premier League',
        kickoff: 'Tomorrow 20:30',
        pick: 'Full Time Draw (X)',
        odds: 3.25,
        confidence: 74,
      },
    ],
  },
  {
    id: 'purchased-3',
    slipId: 'slip-past-1',
    title: 'Midweek Goal Rush 5-Fold',
    tipsterName: 'Goal Hunter',
    tipsterHandle: '@goal_hunter',
    tipsterAvatarBg: '#8B5CF6',
    bookmaker: '1xBet',
    bookmakerLogo: BOOKMAKER_LOGOS['1xbet'],
    bookingCode: '1XB-88319',
    totalOdds: 8.75,
    matchesCount: 5,
    purchaseDate: '15 Oct 2026, 02:15 PM',
    amountPaid: 'Tshs 1,500',
    status: 'won',
    validUntil: 'Expired (Settled)',
    selections: [
      {
        id: 'ps3-1',
        match: 'Dortmund vs Celtic',
        league: 'Champions League',
        kickoff: '15 Oct 22:00',
        pick: 'Over 2.5 Goals',
        odds: 1.45,
        confidence: 93,
      },
      {
        id: 'ps3-2',
        match: 'Aston Villa vs Bayern',
        league: 'Champions League',
        kickoff: '15 Oct 22:00',
        pick: 'Over 1.5 Goals',
        odds: 1.30,
        confidence: 96,
      },
      {
        id: 'ps3-3',
        match: 'Benfica vs Atletico',
        league: 'Champions League',
        kickoff: '15 Oct 22:00',
        pick: 'Both Teams to Score',
        odds: 1.70,
        confidence: 86,
      },
      {
        id: 'ps3-4',
        match: 'Lille vs Real Madrid',
        league: 'Champions League',
        kickoff: '15 Oct 22:00',
        pick: 'Real Madrid to Score Over 1.5',
        odds: 1.65,
        confidence: 89,
      },
      {
        id: 'ps3-5',
        match: 'Leipzig vs Juventus',
        league: 'Champions League',
        kickoff: '15 Oct 22:00',
        pick: 'Over 2.5 Goals',
        odds: 1.68,
        confidence: 88,
      },
    ],
  },
  {
    id: 'purchased-4',
    slipId: 'slip-past-2',
    title: 'Saturday VIP Corner & Card Builder',
    tipsterName: 'Stats Wizard',
    tipsterHandle: '@statswiz',
    tipsterAvatarBg: '#EC4899',
    bookmaker: 'MozzartBet',
    bookmakerLogo: BOOKMAKER_LOGOS.mozzartbet,
    bookingCode: 'MOZ-11938',
    totalOdds: 6.4,
    matchesCount: 4,
    purchaseDate: '11 Oct 2026, 09:30 AM',
    amountPaid: 'Tshs 2,500',
    status: 'lost',
    validUntil: 'Expired (Settled)',
    selections: [
      {
        id: 'ps4-1',
        match: 'Tottenham vs West Ham',
        league: 'Premier League',
        kickoff: '11 Oct 14:30',
        pick: 'Over 9.5 Corners',
        odds: 1.65,
        confidence: 88,
      },
      {
        id: 'ps4-2',
        match: 'Fulham vs Aston Villa',
        league: 'Premier League',
        kickoff: '11 Oct 17:00',
        pick: 'Over 3.5 Total Cards',
        odds: 1.52,
        confidence: 84,
      },
      {
        id: 'ps4-3',
        match: 'Man United vs Brentford',
        league: 'Premier League',
        kickoff: '11 Oct 17:00',
        pick: 'Man United Over 5.5 Corners',
        odds: 1.55,
        confidence: 82,
      },
      {
        id: 'ps4-4',
        match: 'Bournemouth vs Arsenal',
        league: 'Premier League',
        kickoff: '11 Oct 19:30',
        pick: 'Arsenal Over 1.5 Goals',
        odds: 1.62,
        confidence: 87,
      },
    ],
  },
  {
    id: 'purchased-5',
    slipId: 'slip-past-3',
    title: 'Weekend Betway Elite Value Treble',
    tipsterName: 'Tactical Draw Pro',
    tipsterHandle: '@draw_tactics',
    tipsterAvatarBg: '#10B981',
    bookmaker: 'Betway',
    bookmakerLogo: BOOKMAKER_LOGOS.betway,
    bookingCode: 'BTW-30948',
    totalOdds: 8.85,
    matchesCount: 3,
    purchaseDate: 'Today, 08:15 AM',
    amountPaid: 'Tshs 1,000',
    status: 'active',
    validUntil: 'Valid for 4h 15m',
    selections: [
      {
        id: 'ps5-1',
        match: 'Juventus vs Lazio',
        league: 'Serie A',
        kickoff: 'Today 21:45',
        pick: 'Juventus to Win & Under 3.5 Goals',
        odds: 2.10,
        confidence: 83,
      },
      {
        id: 'ps5-2',
        match: 'Sevilla vs Real Sociedad',
        league: 'La Liga',
        kickoff: 'Today 20:00',
        pick: 'Draw at Half Time (X HT)',
        odds: 2.05,
        confidence: 79,
      },
      {
        id: 'ps5-3',
        match: 'Frankfurt vs Stuttgart',
        league: 'Bundesliga',
        kickoff: 'Today 19:30',
        pick: 'Both Teams to Score (BTTS)',
        odds: 1.55,
        confidence: 88,
      },
    ],
  },
];

export const MOCK_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay-1',
    reference: 'MPESA-QJ94827101',
    type: 'slip_purchase',
    description: 'Purchased: Weekend 6-Fold Mega Accumulator (@betmaster_ke)',
    method: 'M-Pesa',
    amount: -2000,
    currency: 'Tshs',
    date: 'Today, 11:45 AM',
    status: 'completed',
  },
  {
    id: 'pay-2',
    reference: 'MPESA-PH38192039',
    type: 'slip_purchase',
    description: 'Purchased: Super Draw & High Odds Special (@kingdraws)',
    method: 'M-Pesa',
    amount: -3500,
    currency: 'Tshs',
    date: 'Yesterday, 04:20 PM',
    status: 'completed',
  },
  {
    id: 'pay-3',
    reference: 'MPESA-NM10294822',
    type: 'deposit',
    description: 'Wallet Top-up via M-Pesa Express',
    method: 'M-Pesa',
    amount: 15000,
    currency: 'Tshs',
    date: '16 Oct 2026, 08:12 PM',
    status: 'completed',
  },
  {
    id: 'pay-4',
    reference: 'MPESA-LK88192011',
    type: 'slip_purchase',
    description: 'Purchased: Midweek Goal Rush 5-Fold (@goal_hunter)',
    method: 'M-Pesa',
    amount: -1500,
    currency: 'Tshs',
    date: '15 Oct 2026, 02:15 PM',
    status: 'completed',
  },
  {
    id: 'pay-5',
    reference: 'MPESA-KJ55192094',
    type: 'slip_purchase',
    description: 'Purchased: Saturday VIP Corner & Card Builder (@statswiz)',
    method: 'M-Pesa',
    amount: -2500,
    currency: 'Tshs',
    date: '11 Oct 2026, 09:30 AM',
    status: 'completed',
  },
  {
    id: 'pay-6',
    reference: 'MPESA-FD29103982',
    type: 'deposit',
    description: 'Wallet Top-up via M-Pesa Express',
    method: 'M-Pesa',
    amount: 10000,
    currency: 'Tshs',
    date: '10 Oct 2026, 03:00 PM',
    status: 'completed',
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Slips',
    question: 'How do I use a booking code on Betika or SportyBet?',
    answer:
      'Open your betting app (e.g. Betika, SportyBet, or 1xBet). On the betslip page, locate the "Load Code" or "Booking Code" button, paste your copied booking code, and all selections will load automatically.',
  },
  {
    id: 'faq-2',
    category: 'Payments',
    question: 'How does M-Pesa automatic unlocking work?',
    answer:
      'When you purchase a slip or top up your wallet, an M-Pesa STK push prompt is sent directly to your phone. Once you enter your PIN, the slip is unlocked instantly.',
  },
  {
    id: 'faq-3',
    category: 'Slips',
    question: 'Are tipster predictions 100% guaranteed?',
    answer:
      'No prediction in sports betting is guaranteed. All slips are created by experienced tipsters based on statistical analysis and team form. Always bet responsibly and never wager money you cannot afford to lose.',
  },
  {
    id: 'faq-4',
    category: 'General',
    question: 'How do I follow a tipster and receive alerts?',
    answer:
      'Navigate to the Following tab or tap any tipster card, then press the "Follow" button. Enable "Alerts" to get notified the second they post a new slip.',
  },
];

