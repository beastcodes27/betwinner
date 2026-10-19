export interface VipPlan {
  id: 'single' | 'weekly' | 'monthly';
  name: string;
  duration: string;
  price: string;
  amountNum: number;
  badge?: string;
  description: string;
}

export const VIP_PLANS: VipPlan[] = [
  {
    id: 'single',
    name: 'Single Slip Unlock',
    duration: '1 Ticket Access',
    price: 'Tshs 2,000',
    amountNum: 2000,
    description: 'Instant unlock for this specific VIP ticket & booking code',
  },
  {
    id: 'weekly',
    name: 'Weekly VIP Pass',
    duration: '7 Days Unlimited',
    price: 'Tshs 5,000',
    amountNum: 5000,
    badge: 'POPULAR',
    description: 'Unlimited access to all VIP banker tickets & codes for 7 days',
  },
  {
    id: 'monthly',
    name: 'Monthly VIP Club',
    duration: '30 Days Unlimited',
    price: 'Tshs 15,000',
    amountNum: 15000,
    badge: 'BEST VALUE',
    description: '30-day VIP pass + priority banker slips & instant alerts',
  },
];
