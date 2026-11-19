// Fallback copy. The CMS global "Site content" starts out with these values and the
// page falls back to them for any field left empty.
export const CONTENT_DEFAULTS = {
  seo: {
    title: 'My Ore: notes and agents for owner-run businesses',
    description:
      'My Ore picks the dates, people and actions out of your notes and turns them into a day you can finish. Agents prepare receipts, mileage, invoice reminders and inbox tasks for you to approve. Waitlist open for the first iPhone release, planned for Winter 2026.',
    shareTitle: 'My Ore: raw thoughts, refined.',
    shareDescription:
      'Notes that sort themselves into a day, plus agents that prepare your receipts, mileage and invoice reminders.',
  },
  hero: {
    eyebrow: 'For sole traders, tradespeople and small teams',
    headlineLine1: 'Notes that',
    headlineLine2: 'sort out your admin.',
    intro:
      'Jot down jobs, calls and receipts as they come up. My Ore picks out the dates, people and actions, lays them out as a day you can finish, and prepares receipts, mileage and invoice reminders for you to approve.',
  },
  waitlist: {
    placeholder: 'Work email',
    buttonLabel: 'Join the waitlist',
    helper: 'One email when the first release is ready. No newsletter.',
    successTitle: "You're on the list.",
  },
  faqs: [
    {
      question: 'Who is My Ore for?',
      answer:
        'Owner-run businesses: sole traders, tradespeople, freelancers and small teams. If your admin is spread across notes, photos, texts and emails, My Ore brings it into one place.',
    },
    {
      question: 'When can I get it, and on what?',
      answer:
        "The first release is planned for iPhone in Winter 2026. Everyone on the waitlist gets one email when it's ready.",
    },
    {
      question: 'What do the agents actually do?',
      answer:
        'There are five: Receipts, Mileage, Invoices, Inbox and Calendar. Each one reads what comes in, fills in the details and suggests the next step, such as filing an expense or drafting a reminder for an overdue invoice.',
    },
    {
      question: 'Will anything be sent without my approval?',
      answer: 'No. Agents prepare the work, and nothing is filed, sent or moved until you approve it.',
    },
    {
      question: 'Do I have to connect my email and calendar?',
      answer:
        'Only for the agents that use them. The Inbox and Calendar agents need those accounts connected, which you do once. You can use notes, sorting and the Today view without connecting anything.',
    },
    {
      question: 'Does it replace my accounting software?',
      answer:
        "No. My Ore keeps records of receipts, mileage and invoice reminders and prepares them for you to approve. It isn't an accounting package.",
    },
    {
      question: 'How much will it cost?',
      answer: "Pricing hasn't been announced yet. It will be shared before the first release.",
    },
    {
      question: 'What happens when I join the waitlist?',
      answer: 'You get one email, when the first release is ready. Nothing in between.',
    },
  ],
  finalCta: {
    line1: 'Spend your time on the work.',
    line2: 'Not the admin.',
    body: 'My Ore is planned for iPhone in Winter 2026. Join the waitlist for one email when the first release is ready.',
  },
  footer: { tagline: 'Raw thoughts, refined.' },
} as const
