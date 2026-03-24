import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock3, CalendarDays, MessageSquare, Zap, ChevronRight, Star, RotateCcw, ExternalLink } from "lucide-react";
import { CALENDLY_BOOKING_URL, formatCalendlyDisplay } from "@/lib/calendly";

/** Rich-link style preview shown in the SMS demo when the agent sends the booking URL */
function BookingCalendarPreview() {
  const bookingUrl = CALENDLY_BOOKING_URL;
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const dates = [17, 18, 19, 20, 21, 22, 23];
  const highlightIndex = 3; // Wednesday 20th — mid-week pick

  return (
    <div className="mt-2.5 overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-900/[0.04]">
      <div className="flex items-center gap-2.5 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-3 py-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
          <CalendarDays className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold leading-tight text-slate-900">Book a free roof inspection</p>
          <p className="text-[10px] text-slate-500">ABC Roofing · ~45 min</p>
        </div>
      </div>

      <div className="bg-slate-50/80 px-2.5 py-2">
        <p className="text-center text-[9px] font-semibold uppercase tracking-wide text-slate-500">This week</p>
        <div className="mt-1 grid grid-cols-7 gap-0.5 text-center">
          {weekDays.map((d, i) => (
            <span key={`${d}-${i}`} className="text-[8px] font-medium text-slate-400">
              {d}
            </span>
          ))}
        </div>
        <div className="mt-0.5 grid grid-cols-7 gap-0.5 text-center">
          {dates.map((n, i) => (
            <span
              key={n}
              className={
                i === highlightIndex
                  ? "rounded-md bg-blue-600 py-0.5 text-[9px] font-semibold text-white shadow-sm"
                  : "py-0.5 text-[9px] text-slate-600"
              }
            >
              {n}
            </span>
          ))}
        </div>

        <p className="mt-2 text-[9px] font-medium text-slate-500">Suggested times</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {["Wed 9–11am", "Thu 1–3pm", "Fri 8–10am"].map((slot) => (
            <span
              key={slot}
              className="rounded-md border border-emerald-200/80 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-medium text-emerald-800"
            >
              {slot}
            </span>
          ))}
        </div>
      </div>

      {bookingUrl ? (
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 border-t border-slate-100 bg-white px-3 py-2 text-[10px] font-semibold text-blue-600 transition hover:bg-slate-50"
        >
          Book on Calendly
          <ExternalLink className="h-3 w-3 opacity-80" />
        </a>
      ) : null}
    </div>
  );
}

const messages = [
  {
    id: 1,
    sender: "agent",
    time: "9:00 PM",
    text: "Hi! Thanks for reaching out to ABC Roofing. I can help get you scheduled for a free roof inspection. What issue are you dealing with?",
  },
  {
    id: 2,
    sender: "user",
    time: "9:01 PM",
    text: "We think we may have storm damage and a leak near the back bedroom.",
  },
  {
    id: 3,
    sender: "agent",
    time: "9:02 PM",
    text: "Got it — sorry you're dealing with that. Is this urgent, and are you hoping to have someone take a look this week?",
  },
  {
    id: 4,
    sender: "user",
    time: "9:03 PM",
    text: "Yes, definitely this week if possible.",
  },
  {
    id: 5,
    sender: "agent",
    time: "9:04 PM",
    text: "Perfect — here’s my Calendly link so you can book a free inspection.",
    showLink: true,
  },
  {
    id: 6,
    sender: "user",
    time: "9:04 PM",
    text: "❤️",
    isReaction: true,
  },
];

function AnimatedPhone() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const isInView = useInView(containerRef, { once: true, amount: 0.45 });
  const [visibleCount, setVisibleCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);

  const startDemo = useCallback(() => {
    clearTimers();
    setVisibleCount(0);
    setHasStarted(true);
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }

    messages.forEach((_, index) => {
      const timeout = window.setTimeout(() => {
        setVisibleCount(index + 1);
      }, index * 950);
      timeoutsRef.current.push(timeout);
    });
  }, [clearTimers]);

  useEffect(() => {
    if (isInView && !hasStarted) {
      startDemo();
    }
  }, [isInView, hasStarted, startDemo]);

  useEffect(() => {
    if (!scrollAreaRef.current) return;
    scrollAreaRef.current.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleCount]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const visibleMessages = useMemo(() => messages.slice(0, visibleCount), [visibleCount]);

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-sm">
      <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-slate-200/60 blur-2xl" />
      <div className="rounded-[2.75rem] border border-slate-200 bg-slate-950 p-2 shadow-2xl">
        <div className="overflow-hidden rounded-[2.2rem] bg-white">
          <div className="border-b border-slate-100 px-5 pt-3 pb-2">
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={startDemo}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Replay demo
              </button>
              <div className="h-1.5 w-20 rounded-full bg-slate-200" />
              <div className="w-[88px]" />
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
              <span>9:00</span>
              <span>Tue</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                AR
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">ABC Roofing</div>
                <div className="text-xs text-emerald-600">SMS conversation</div>
              </div>
            </div>
          </div>

          <div ref={scrollAreaRef} className="h-[480px] overflow-y-auto bg-slate-50 px-3 py-4">
            <div className="space-y-3">
              <AnimatePresence>
                {visibleMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex flex-col ${message.sender === "user" ? "items-end" : "items-start"} ${message.showLink ? "max-w-[min(92%,260px)]" : "max-w-[80%]"}`}
                    >
                      <div
                        className={
                          message.isReaction
                            ? "bg-transparent px-1 py-0 text-2xl"
                            : message.sender === "user"
                              ? "rounded-2xl rounded-br-md bg-slate-900 px-4 py-3 text-sm text-white shadow-sm"
                              : "rounded-2xl rounded-bl-md border border-slate-100 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm"
                        }
                      >
                        {message.showLink ? (
                          <div className="min-w-[200px] max-w-[240px]">
                            <p className="leading-snug">
                              {CALENDLY_BOOKING_URL ? (
                                <>
                                  Perfect — here’s my Calendly link. Tap{" "}
                                  <span className="font-medium">Book on Calendly</span> in the preview to pick a time for your{" "}
                                  <span className="font-medium">free inspection</span>.
                                </>
                              ) : (
                                <>
                                  Perfect — here’s a preview of booking your{" "}
                                  <span className="font-medium">free inspection</span>:
                                </>
                              )}
                            </p>
                            <BookingCalendarPreview />
                            {CALENDLY_BOOKING_URL ? (
                              <a
                                href={CALENDLY_BOOKING_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block truncate text-[11px] font-medium text-blue-600 hover:underline"
                              >
                                {formatCalendlyDisplay(CALENDLY_BOOKING_URL)}
                              </a>
                            ) : null}
                          </div>
                        ) : (
                          message.text
                        )}
                      </div>
                      <div className="mt-1 px-1 text-[10px] text-slate-400">{message.time}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!hasStarted && (
                <div className="pt-24 text-center text-sm text-slate-400">
                  Scroll here to preview the lead conversation
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const benefits = [
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Respond in seconds",
    body: "Automatically text every new roofing lead the moment they come in — even after hours and on weekends.",
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Qualify automatically",
    body: "Ask the right questions about damage, urgency, insurance, and timing before your team ever has to jump in.",
  },
  {
    icon: <CalendarDays className="h-5 w-5" />,
    title: "Book more inspections",
    body: "Move qualified homeowners directly to your scheduling link so more leads become appointments.",
  },
];

const faqs = [
  {
    q: "How does this work with my current lead flow?",
    a: "LeadFlow AI connects to your existing forms, lead sources, or webhook and starts the conversation automatically when a new lead comes in.",
  },
  {
    q: "Does this replace my team?",
    a: "No. It handles first response, qualification, and follow-up so your team can spend more time closing real opportunities.",
  },
  {
    q: "Can I review the conversations?",
    a: "Yes. Every message is logged so your team can see the full lead history and step in whenever needed.",
  },
  {
    q: "What does it ask leads?",
    a: "Questions can include issue type, urgency, insurance involvement, timeline, address details, and readiness to schedule a free inspection.",
  },
];

export default function LeadflowMarketingSiteV2() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(241,245,249,0.9),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(248,250,252,0.95),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold">LeadFlow AI</div>
                <div className="text-xs text-slate-500">Roofing lead conversion on autopilot</div>
              </div>
            </div>
            <div className="w-fit max-w-full shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm">
              Call or text 215-796-7031 to set up your free trial
            </div>
          </div>

          <div className="grid items-center gap-12 py-8 lg:grid-cols-2 lg:py-12">
            <div>
              <Badge className="mb-5 rounded-full bg-slate-100 px-3 py-1 text-slate-700 hover:bg-slate-100">
                Built for roofing companies that buy leads
              </Badge>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Book more roof inspections from the leads you already get
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                LeadFlow AI replies to new roofing leads in seconds, qualifies them by text, and books more inspections automatically — without adding work for your office staff or sales team.
              </p>

              <div className="mt-8 w-fit max-w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-medium text-slate-900 shadow-sm">
                Call or text 215-796-7031 to set up your free trial
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Works with your forms, phone number, CRM, and calendar.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  "After-hours response",
                  "Automatic qualification",
                  "Calendar booking",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                      <CheckCircle2 className="h-4 w-4" />
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <AnimatedPhone />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Why this matters
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              You’re already paying for roofing leads. The problem is speed.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Most leads go cold because nobody responds fast enough. A homeowner fills out a form at 9 PM, waits, moves on, and the opportunity disappears.
            </p>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              LeadFlow AI responds instantly, asks the right questions, and moves qualified homeowners toward a booked inspection while your team is off the clock.
            </p>
          </div>

          <Card className="rounded-[2rem] border-slate-200 shadow-sm">
            <CardContent className="p-8">
              <div className="space-y-5">
                {[
                  "Lead responds within seconds, not hours",
                  "Every lead gets a consistent follow-up flow",
                  "High-intent leads reach your calendar faster",
                  "Office staff spend less time chasing low-intent inquiries",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-slate-900 p-1 text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-slate-700">{point}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              What it does
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Built to turn inbound roofing leads into booked inspections
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="rounded-[2rem] border-slate-200 bg-white shadow-sm">
                <CardContent className="p-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                    {benefit.icon}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{benefit.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{benefit.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            How it works
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            A simple flow that works even when your team is off the clock
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {[
            {
              step: "01",
              title: "New lead comes in",
              body: "From your website, ads, or lead provider. The moment a lead is captured, the workflow begins.",
            },
            {
              step: "02",
              title: "AI starts the conversation",
              body: "The homeowner gets an immediate text response and answers a few quick qualification questions.",
            },
            {
              step: "03",
              title: "Qualified leads get booked",
              body: "High-intent leads receive your scheduling link so they can book a free inspection right away.",
            },
            {
              step: "04",
              title: "Follow-up happens automatically",
              body: "If they don’t respond immediately, the system keeps the conversation moving without manual effort.",
            },
          ].map((item) => (
            <Card key={item.step} className="rounded-[2rem] border-slate-200 shadow-sm">
              <CardContent className="p-7">
                <div className="text-sm font-semibold text-slate-400">{item.step}</div>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.body}</p>
                <div className="mt-6 flex items-center text-sm font-medium text-slate-700">
                  <ChevronRight className="mr-1 h-4 w-4" />
                  Faster conversion flow
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Roofing team benefits
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Built for speed, consistency, and more booked jobs
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              LeadFlow AI helps you capture more value from the leads you already buy by making first response and follow-up automatic.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Converts leads after hours and on weekends",
              "Keeps follow-up fast and consistent",
              "Filters out low-intent inquiries",
              "Reduces admin work for office staff",
              "Helps reps focus on real opportunities",
              "Creates a better customer experience from the first text",
            ].map((item) => (
              <div key={item} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-start gap-3">
                  <Star className="mt-0.5 h-5 w-5" />
                  <p className="text-slate-100">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Business impact
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              A small lift in speed can create a big lift in booked inspections
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              If you’re paying for roofing leads, even a modest improvement in response speed and booking rate can make the system pay for itself quickly.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: <Clock3 className="h-5 w-5" />, label: "Faster first response" },
              { icon: <MessageSquare className="h-5 w-5" />, label: "More qualified conversations" },
              { icon: <CalendarDays className="h-5 w-5" />, label: "More booked inspections" },
            ].map((item) => (
              <Card key={item.label} className="rounded-[1.75rem] border-slate-200 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                    {item.icon}
                  </div>
                  <div className="mt-4 text-base font-semibold text-slate-900">{item.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              FAQ
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Common questions
            </h2>
          </div>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q} className="rounded-[1.75rem] border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">{faq.q}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
