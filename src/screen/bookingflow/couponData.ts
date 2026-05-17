export type CouponItem = {
  code: string;
  bank: string;
  desc: string;
  icon: string;
  category: 'card' | 'upi' | 'cred';
  minOrder?: number;
  calc: (amt: number) => number;
};

export const ALL_COUPONS: CouponItem[] = [
  // Card Offers
  {code: 'HDFC20', bank: 'HDFC Bank', desc: '20% off upto ₹100 on HDFC cards', icon: '💳', category: 'card', calc: a => Math.min(Math.round(a * 0.2), 100)},
  {code: 'ICICI15', bank: 'ICICI Bank', desc: '15% off upto ₹75 on ICICI cards', icon: '💳', category: 'card', calc: a => Math.min(Math.round(a * 0.15), 75)},
  {code: 'AXIS50', bank: 'Axis Bank', desc: '₹50 off on orders above ₹299', icon: '💳', category: 'card', minOrder: 299, calc: a => a >= 299 ? 50 : 0},
  {code: 'SBI10', bank: 'SBI Card', desc: '10% off upto ₹60 on SBI cards', icon: '💳', category: 'card', calc: a => Math.min(Math.round(a * 0.1), 60)},
  // UPI Offers
  {code: 'GPAY50', bank: 'Google Pay', desc: '₹50 off on first Google Pay payment', icon: '📱', category: 'upi', calc: () => 50},
  {code: 'UPI10', bank: 'Any UPI', desc: '10% off upto ₹30 on any UPI app', icon: '📱', category: 'upi', calc: a => Math.min(Math.round(a * 0.1), 30)},
  {code: 'PAYTM30', bank: 'Paytm', desc: '₹30 off via Paytm UPI', icon: '📱', category: 'upi', calc: () => 30},
  {code: 'BHIM25', bank: 'BHIM UPI', desc: '₹25 cashback on BHIM UPI payment', icon: '💙', category: 'upi', calc: () => 25},
  // CRED
  {code: 'CRED15', bank: 'CRED', desc: '15% off upto ₹200 using CRED coins', icon: '⚫', category: 'cred', calc: a => Math.min(Math.round(a * 0.15), 200)},
  {code: 'CREDX100', bank: 'CRED Pay', desc: '₹100 off on orders above ₹500', icon: '⚫', category: 'cred', minOrder: 500, calc: a => a >= 500 ? 100 : 0},
];

export const CATEGORY_LABELS: Record<'card' | 'upi' | 'cred', string> = {
  card: '💳 Card Offers',
  upi: '📱 UPI Offers',
  cred: '⚫ CRED',
};
