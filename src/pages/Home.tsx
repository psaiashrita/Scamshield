import { Link, useNavigate } from 'react-router-dom';
import { Mail, Briefcase, Link as LinkIcon, Image as ImageIcon, Brain, Search, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { DEMO_SCENARIOS } from '@/services/demoScenarios';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    { type: 'message' as const, title: 'Message / Email', description: 'Analyze suspicious SMS, emails, or social-media messages for scam indicators.' },
    { type: 'job' as const, title: 'Job / Internship', description: 'Check job or internship offers for upfront fees, impersonation, and red flags.' },
    { type: 'screenshot' as const, title: 'Screenshot', description: 'Upload a screenshot of a suspicious message and review it with guided analysis.' },
    { type: 'url' as const, title: 'URL / Website', description: 'Inspect a URL for structural risk indicators before you click.' },
  ];

  const demoScenarios = DEMO_SCENARIOS;

  const handleDemo = (scenarioId: string) => {
    navigate(`/check/message?demo=${scenarioId}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(30,58,138,0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
              <Sparkles className="w-3.5 h-3.5" />
              Before you click, check.
            </div>
            <h1 className="mt-6 text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Don't just detect scams. <span className="text-blue-900">Understand them.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Analyze suspicious messages, job offers and links, understand the warning signs, and know
              what to do before you click, pay or share information.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/check"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors"
              >
                Check Something
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleDemo('fake-internship')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Try a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <Link
              key={f.type}
              to={`/check/${f.type}`}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200 h-full"
            >
              <div className="rounded-xl bg-blue-50 p-3 text-blue-900 transition-colors group-hover:bg-blue-900 group-hover:text-white">
                {f.type === 'message' && <Mail className="w-6 h-6" />}
                {f.type === 'job' && <Briefcase className="w-6 h-6" />}
                {f.type === 'screenshot' && <ImageIcon className="w-6 h-6" />}
                {f.type === 'url' && <LinkIcon className="w-6 h-6" />}
              </div>
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why ScamShield */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Why ScamShield?</h2>
            <p className="mt-2 text-slate-500">Three steps to safer decisions online.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white p-7 border border-slate-200 shadow-sm">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-900 w-fit">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 text-lg">Understand</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                See which warning signs were detected and why they matter — with evidence from your
                actual input.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-7 border border-slate-200 shadow-sm">
              <div className="rounded-xl bg-teal-50 p-3 text-teal-700 w-fit">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 text-lg">Verify</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Learn how to independently verify suspicious claims using trusted channels, not the
                contact details in the message.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-7 border border-slate-200 shadow-sm">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700 w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 text-lg">Act Safely</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Get practical, context-specific next steps before you click, pay, or share any
                personal information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Try a Demo */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Try a Demo Scam</h2>
          <p className="mt-2 text-slate-500">See how ScamShield analyzes real-world scam patterns.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {demoScenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => handleDemo(s.id)}
              className="group text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-200"
            >
              <h3 className="font-semibold text-slate-900 text-sm">{s.title}</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{s.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-900 group-hover:gap-2 transition-all">
                Try it <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
