import { SubscriptionPlan } from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'মাসিক প্যাকেজ',
    nameEn: 'Monthly Pass',
    durationMonths: 1,
    durationLabel: '১ মাস (৩০ দিন)',
    price: 199,
    originalPrice: 350,
    badge: 'মৌলিক এক্সেস',
    savings: '৳১৫১ ছাড়'
  },
  {
    id: 'quarterly',
    name: 'ত্রৈমাসিক প্যাকেজ',
    nameEn: 'Quarterly Plan',
    durationMonths: 3,
    durationLabel: '৩ মাস (৯০ দিন)',
    price: 499,
    originalPrice: 900,
    badge: 'জনপ্রিয় চয়েস 🔥',
    isPopular: true,
    savings: '৳৪০১ ছাড় (৪৪%)'
  },
  {
    id: 'half_yearly',
    name: 'ষান্মাসিক প্যাকেজ',
    nameEn: 'Half-Yearly Plan',
    durationMonths: 6,
    durationLabel: '৬ মাস (১৮০ দিন)',
    price: 899,
    originalPrice: 1800,
    badge: 'সেরা ভ্যালু ⚡',
    savings: '৳৯০১ ছাড় (৫০%)'
  },
  {
    id: 'yearly',
    name: 'বাৎসরিক প্যাকেজ',
    nameEn: 'Annual VIP Pass',
    durationMonths: 12,
    durationLabel: '১ বছর (৩৬৫ দিন)',
    price: 1499,
    originalPrice: 3500,
    badge: 'সর্বোচ্চ সাশ্রয় 👑',
    savings: '৳২,০০১ ছাড় (৫৭%)'
  }
];
