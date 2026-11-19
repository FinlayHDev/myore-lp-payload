import { Briefcase, CalendarDays, Gauge, Layers, Phone, Users, Wrench } from "lucide-react";
import { Wordmark } from "@/components/landing/Hopper";
import { OreRidge } from "@/components/landing/OreRidge";
import { WaitlistForm } from "@/components/landing/WaitlistForm";
import { ScratchpadDemo } from "@/components/landing/ScratchpadDemo";
import { SortDeck } from "@/components/landing/SortDeck";
import { TodayLanes } from "@/components/landing/TodayLanes";
import { AgentDesk } from "@/components/landing/AgentDesk";
import { ScanFlow } from "@/components/landing/ScanFlow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Content } from "@/lib/content";

export function LandingPage({ content }: { content: Content }) {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero content={content} />
        <Capabilities />
        <BuiltFor />
        <Upgrade />
        <HowItWorks />
        <Agents />
        <Faq faqs={content.faqs} />
        <FinalCta content={content} />
      </main>
      <SiteFooter tagline={content.footer.tagline} />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper/85 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 md:grid-cols-[1fr_auto_1fr] md:px-8">
        <a href="#top" aria-label="My Ore home" className="min-w-0">
          <Wordmark />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#notes" className="label text-ink-soft hover:text-primary">
            Product
          </a>
          <a href="#sort" className="label text-ink-soft hover:text-primary">
            How it works
          </a>
          <a href="#agents" className="label text-ink-soft hover:text-primary">
            Agents
          </a>
          <a href="#faq" className="label text-ink-soft hover:text-primary">
            Questions
          </a>
        </nav>
        <div className="flex justify-end">
          <a
            href="#join"
            className="inline-flex items-center gap-2 bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-primary"
          >
            Join the waitlist
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero({ content }: { content: Content }) {
  return (
    <section id="top" className="border-b border-hairline">
      <div className="mx-auto grid max-w-7xl border-hairline lg:grid-cols-[1.05fr_1fr] 2xl:border-x">
        {/* On phones the text block is sized so the top of the demo shows at the bottom of the first screen. */}
        <div className="flex min-h-[calc(100svh-4.5rem-8.5rem)] flex-col justify-center px-5 py-8 md:min-h-0 md:px-8 md:py-14 lg:justify-start lg:border-r lg:border-hairline lg:pt-16 lg:pb-16 lg:pr-14">
          <p className="label text-ink-soft">{content.hero.eyebrow}</p>
          <h1 className="display-tight mt-5 text-[clamp(2.6rem,4.4vw,4.5rem)] md:mt-7">
            {content.hero.headlineLine1}
            <br />
            {content.hero.headlineLine2}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft [@media(max-width:767px)_and_(max-height:700px)]:hidden md:mt-7 md:text-xl">
            {content.hero.intro}
          </p>
          <div className="mt-7 max-w-xl md:mt-9">
            <WaitlistForm source="hero" copy={content.waitlist} />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-1.5 text-xs md:mt-10 md:gap-2 md:text-sm">
            <span className="label mr-2 hidden text-muted-foreground xl:inline">Picked out of your notes</span>
            <span className="token-date rounded-md px-2 py-0.5 font-semibold">dates</span>
            <span className="token-action rounded-md px-2 py-0.5 font-semibold">actions</span>
            <span className="token-phone rounded-md px-2 py-0.5 font-semibold">numbers</span>
            <span className="token-person rounded-md px-2 py-0.5 font-semibold">people</span>
            <span className="token-time rounded-md px-2 py-0.5 font-semibold">effort</span>
          </div>
        </div>

        <div
          className="relative overflow-hidden px-5 pt-5 pb-40 md:px-10 md:pt-14 lg:pt-12 lg:pb-36"
          style={{ backgroundImage: "linear-gradient(180deg, oklch(0.962 0.006 250) 0%, oklch(0.935 0.014 255) 100%)" }}
        >
          <OreRidge tone="dark" className="absolute inset-x-0 bottom-0 h-32 w-full lg:h-28" />
          {/* Fixed height so the demo changing phase never moves the headline and form. */}
          <div className="relative lg:min-h-[38rem]">
            <ScratchpadDemo />
          </div>
          <div className="relative mt-8 flex items-center gap-4 text-ink-soft">
            <span className="label">Capture</span>
            <span className="h-px flex-1 bg-ink-soft/25" />
            <span className="label">Prioritise</span>
            <span className="h-px flex-1 bg-ink-soft/25" />
            <span className="label">Action</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <div className="border-b border-hairline" aria-label="What My Ore handles">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-10 gap-y-2 px-5 py-5 text-sm font-medium text-ink-soft md:px-8">
        <span className="text-muted-foreground">Handles</span>
        {["Notes and tasks", "Receipts", "Mileage", "Invoices", "Inbox", "Calendar"].map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
    </div>
  );
}

const AUDIENCES = [
  {
    icon: Wrench,
    title: "Trades and field services",
    body: "Note down a job, a quote or a materials list from the van. Overdue invoices and quote follow-ups stay on your list until you close them.",
  },
  {
    icon: Briefcase,
    title: "Freelancers and consultants",
    body: "Turn client emails into dated tasks, and keep each receipt and invoice with the job it belongs to.",
  },
  {
    icon: Users,
    title: "Small teams and crews",
    body: "Plan around a colleague's availability without sharing the detail of their calendar.",
  },
];

function BuiltFor() {
  return (
    <section className="border-b border-hairline">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <h2 className="display-tight max-w-2xl text-[clamp(1.9rem,3.4vw,2.9rem)]">
          Built for businesses that run on a phone
        </h2>
        <div className="mt-10 grid border border-hairline bg-card md:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="border-hairline p-7 not-last:border-b md:not-last:border-r md:border-b-0">
              <a.icon className="h-5 w-5 text-ink" />
              <h3 className="mt-4 font-display text-xl font-bold tracking-tight">{a.title}</h3>
              <p className="mt-2 text-ink-soft">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Upgrade() {
  return (
    <section id="notes" className="scroll-mt-20 border-b border-hairline">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            <h2 className="display-tight text-[clamp(2rem,3.9vw,3.25rem)]">
              Other notes apps store.
              <br />
              My Ore acts on them.
            </h2>
          </div>
          <p className="max-w-md text-lg text-ink-soft md:justify-self-end">
            Write the way you work: shorthand, half-sentences, several jobs on one line. Hopper
            picks out the dates, contacts and actions and turns each one into a task.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
          {/* Plain notes */}
          <div className="relative flex flex-col border border-hairline bg-card p-7">
            <p className="label text-muted-foreground">Any notes app</p>
            <div className="mt-6 space-y-4 font-display text-xl leading-relaxed text-ink-soft">
              <p className="border-b border-paper-line pb-3">
                On Wednesday I need to call 07700 900123 about the van lease
              </p>
              <p className="border-b border-paper-line pb-3">book the MOT for Friday</p>
              <p className="border-b border-paper-line pb-3">email jess coombe back tomorrow</p>
            </div>
            <p className="mt-auto pt-8 text-sm text-muted-foreground">
              Saved as typed. Nothing more happens to it.
            </p>
          </div>

          {/* My Ore */}
          <div className="rounded-[1.25rem] bg-night p-7 text-night-foreground shadow-float">
            <p className="label-mono text-primary">My Ore</p>
            <p className="mt-6 font-display text-xl leading-[1.8] font-medium">
              On <span className="token token-date">Wednesday</span> I need to{" "}
              <span className="token token-action">call</span>{" "}
              <span className="token token-phone">07700 900123</span> about the van lease{" "}
              <span className="token token-action">book</span> the MOT for{" "}
              <span className="token token-date">Friday</span>{" "}
              <span className="token token-action">email</span>{" "}
              <span className="token token-person">Jess Coombe</span> back{" "}
              <span className="token token-date">tomorrow</span>
            </p>
            <ul className="mt-6 space-y-2">
              {[
                ["Email Jess Coombe back", "Quick win", "Tue"],
                ["Call about the van lease", "Tap to call", "Wed"],
                ["Book the MOT", "2 min", "Fri"],
              ].map(([t, m, w]) => (
                <li
                  key={t}
                  className="flex items-center gap-3 rounded-xl bg-night-card px-4 py-3"
                >
                  <span className="h-4 w-4 shrink-0 rounded-full border-2 border-night-muted" />
                  <span className="min-w-0 flex-1 truncate font-semibold">{t}</span>
                  <span className="hidden text-xs text-night-muted sm:inline">{m}</span>
                  <span className="rounded-full bg-token-date-bg px-2.5 py-1 text-[11px] font-bold text-token-date">
                    {w}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 grid border border-hairline sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: CalendarDays,
              title: "Dates, resolved",
              body: "\"Friday\", \"tomorrow\" and \"thurs 3pm\" become calendar dates.",
            },
            {
              icon: Phone,
              title: "Contacts, linked",
              body: "Phone numbers become tap-to-call. Names are tied to the tasks that involve them.",
            },
            {
              icon: Layers,
              title: "Work, prioritised",
              body: "Quick wins, deep focus and shared tasks, instead of one long list.",
            },
            {
              icon: Gauge,
              title: "Capacity, tracked",
              body: "Each day shows how much effort is planned, so you can see when it's too full.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="border-hairline p-7 not-last:border-b sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:not-last:border-r"
            >
              <f.icon className="h-5 w-5 text-ink" />
              <h3 className="mt-4 font-display text-xl font-bold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-ink-soft">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="sort" className="relative scroll-mt-20 overflow-hidden border-b border-hairline bg-night-sky text-night-foreground">
      <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <h2 className="display-tight max-w-3xl text-[clamp(2rem,3.9vw,3.25rem)]">
          Sort quickly, then work through the day in order.
        </h2>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
            <div className="mb-8 max-w-md">
              <h3 className="font-display text-3xl font-bold tracking-tight">
                Triage one note at a time.
              </h3>
              <p className="mt-3 text-night-muted">
                Each note arrives as a card. Move it by urgency: do now, today, this week or let
                go. A pile of loose notes becomes an ordered list in a few minutes.
              </p>
            </div>
            <div className="mx-auto max-w-md">
              <SortDeck />
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-8 max-w-md">
              <h3 className="font-display text-3xl font-bold tracking-tight">
                A day sized to your capacity.
              </h3>
              <p className="mt-3 text-night-muted">
                Work is grouped by the effort it takes. Run a timed session, switch to Split to plan
                around a colleague, and see what's left at a glance.
              </p>
            </div>
            <div className="mx-auto max-w-md">
              <TodayLanes />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Agents() {
  return (
    <section id="agents" className="relative scroll-mt-20 overflow-hidden border-b border-hairline bg-paper-deep">
      <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            <h2 className="display-tight text-[clamp(2rem,3.9vw,3.25rem)]">
              You run the business.
              <br />
              Agents prepare the admin.
            </h2>
          </div>
          <p className="max-w-md text-lg text-ink-soft md:justify-self-end">
            Receipts, mileage, overdue invoices and inbox follow-ups. Each agent reads what comes
            in, completes the details and proposes the next step for your approval.
          </p>
        </div>
        <div className="mt-14">
          <AgentDesk />
        </div>
        <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="max-w-md">
            <h3 className="font-display text-3xl font-bold tracking-tight">
              Scan paperwork in bulk.
            </h3>
            <p className="mt-3 text-ink-soft">
              Receipts, invoices and letters become records with totals, due dates and senders
              already filled in. Assign each to My hub, Home or Work and set a reminder where
              it's needed.
            </p>
          </div>
          <ScanFlow />
        </div>
        <div className="mt-16 grid border border-hairline bg-paper sm:grid-cols-3">
          {[
            ["Less month-end admin", "Receipts and mileage are logged when they happen, so there is no shoebox to sort at the end of the month."],
            ["Complete records", "Each entry keeps its total, VAT, category and date, so your accountant has what they need."],
            ["You stay in control", "Nothing is filed, sent or moved without your approval."],
          ].map(([t, b]) => (
            <div key={t} className="border-hairline p-7 not-last:border-b sm:not-last:border-r sm:border-b-0">
              <h3 className="font-display text-xl font-bold tracking-tight">{t}</h3>
              <p className="mt-2 text-ink-soft">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ faqs }: { faqs: Content["faqs"] }) {
  return (
    <section id="faq" className="scroll-mt-20 border-b border-hairline">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[1fr_1.6fr]">
        <h2 className="display-tight text-[clamp(1.9rem,3.4vw,2.75rem)]">
          Questions
        </h2>
        <Accordion type="single" collapsible className="border-t border-hairline">
          {faqs.map(({ question: q, answer: a }) => (
            <AccordionItem key={q} value={q} className="border-paper-line">
              <AccordionTrigger className="py-5 font-display text-xl font-bold tracking-tight hover:no-underline">
                {q}
              </AccordionTrigger>
              <AccordionContent className="max-w-xl pb-5 text-base text-ink-soft">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FinalCta({ content }: { content: Content }) {
  return (
    <section id="join" className="relative scroll-mt-20 overflow-hidden bg-night-sky text-night-foreground">
      <OreRidge tone="light" className="absolute inset-x-0 bottom-0 h-40 w-full" />
      <div className="relative mx-auto max-w-4xl px-5 pt-24 pb-44 text-center md:px-8 md:pt-32 md:pb-52">
        <h2 className="display-tight text-[clamp(2.2rem,4.4vw,3.5rem)]">
          {content.finalCta.line1}
          <br />
          {content.finalCta.line2}
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg text-night-muted">
          {content.finalCta.body}
        </p>
        <div className="mx-auto mt-10 max-w-xl text-left">
          <WaitlistForm tone="night" source="footer" copy={content.waitlist} />
        </div>
      </div>
    </section>
  );
}

function SiteFooter({ tagline }: { tagline: string }) {
  return (
    <footer className="border-t border-hairline bg-paper">
      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:grid-cols-3 sm:items-center md:px-8">
        <Wordmark />
        <nav className="flex flex-wrap gap-x-6 gap-y-2 sm:justify-center">
          <a href="#sort" className="label text-ink-soft hover:text-primary">
            How it works
          </a>
          <a href="#agents" className="label text-ink-soft hover:text-primary">
            Agents
          </a>
          <a href="#faq" className="label text-ink-soft hover:text-primary">
            Questions
          </a>
        </nav>
        <p className="text-sm text-ink-soft sm:text-right">{tagline} © {new Date().getFullYear()} My Ore</p>
      </div>
    </footer>
  );
}
