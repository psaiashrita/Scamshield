import type { DemoScenario } from '@/types';

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'fake-internship',
    title: 'Fake Internship Offer',
    type: 'message',
    description: 'A recruiter offering a guaranteed-paid internship with an upfront fee.',
    content: `Dear Candidate,

Congratulations! You have been selected for a paid internship at GlobalTech Solutions. The position is work-from-home with a guaranteed stipend of $8,000/month. No experience required!

To secure your position, please pay a one-time registration fee of $150 via gift card or bank transfer within 24 hours. This is a limited-time offer and the position will be given to someone else if you do not act immediately.

Please also provide your bank account details, Aadhaar/SSN, and a copy of your ID for verification.

Reply with your full name, date of birth, and card number to proceed.

Best regards,
HR Manager
GlobalTech Solutions
Contact: hrglobaltech2024@gmail.com`,
  },
  {
    id: 'bank-phishing',
    title: 'Bank Phishing Alert',
    type: 'message',
    content: `URGENT: Your account has been suspended due to suspicious activity.

Dear Customer, your account will be closed within 10 minutes if you do not verify your identity immediately.

Click here to verify: http://secure-bank-verify.com/login?account=update

Please enter your OTP, password, and card number to restore access. Do not ignore this message — failure to verify will result in permanent account closure and legal action.

This is an official notification from your bank's security department.`,
    description: 'A fake bank alert pressuring you to click a link and share credentials.',
  },
  {
    id: 'fake-shopping',
    title: 'Fake Shopping Deal',
    type: 'url',
    description: 'A suspicious e-commerce link with a brand-name mismatch.',
    content: 'http://amazon-deals-shop.xyz/login?account=verify&redirect=checkout',
  },
  {
    id: 'scholarship-scam',
    title: 'Scholarship Scam',
    type: 'message',
    description: 'A scholarship offer requiring a processing fee and sensitive information.',
    content: `You've been awarded a $25,000 scholarship! Guaranteed approval, no application needed.

To process your award, please pay a $75 processing fee via wire transfer or gift card. You must act within 48 hours or the scholarship will be given to another student.

We also need your SSN, bank details, and passport number to release the funds.

This is a limited-time opportunity. Don't miss out!

Reply now with your personal details to claim your scholarship.`,
  },
];

export function getDemoScenario(id: string): DemoScenario | undefined {
  return DEMO_SCENARIOS.find((s) => s.id === id);
}
