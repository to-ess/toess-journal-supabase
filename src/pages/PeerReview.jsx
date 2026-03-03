import { Users, Shield, Clock, CheckCircle, AlertCircle, FileSearch, RotateCcw, Award } from "lucide-react";
import SidebarLayout from "../layouts/SidebarLayout";

export default function PeerReview() {
  const stages = [
    {
      step: "01",
      icon: FileSearch,
      title: "Initial Editorial Screening",
      color: "blue",
      description: "Upon submission, the editorial team checks the manuscript for scope, formatting compliance, and basic quality standards before proceeding to peer review.",
    },
    {
      step: "02",
      icon: Shield,
      title: "Plagiarism Check",
      color: "rose",
      description: "All manuscripts are screened using advanced plagiarism detection software to ensure originality before being sent to reviewers.",
    },
    {
      step: "03",
      icon: Users,
      title: "Double-Blind Peer Review",
      color: "indigo",
      description: "The manuscript is evaluated by at least two independent subject-matter experts. Both the authors and reviewers identities remain anonymous throughout the process.",
    },
    {
      step: "04",
      icon: RotateCcw,
      title: "Revision",
      color: "amber",
      description: "Based on reviewer feedback, authors may be asked to make minor or major revisions. Revised manuscripts are re-evaluated to ensure all concerns are addressed.",
    },
    {
      step: "05",
      icon: Award,
      title: "Final Editorial Decision",
      color: "emerald",
      description: "The Editor-in-Chief makes the final decision to accept, request further revision, or reject the manuscript based on reviewer recommendations.",
    },
  ];

  const principles = [
    { icon: Shield,       title: "Anonymity",            desc: "Both author and reviewer identities are kept strictly confidential throughout the process." },
    { icon: CheckCircle,  title: "Fairness",              desc: "Every manuscript receives an unbiased evaluation based solely on scientific merit." },
    { icon: Clock,        title: "Timeliness",            desc: "We aim to complete the review process within 21 days, subject to reviewer availability." },
    { icon: AlertCircle,  title: "Constructive Feedback", desc: "Reviewers provide detailed, actionable feedback to help authors improve their work." },
  ];

  const decisions = [
    { label: "Accept",            color: "emerald", desc: "Manuscript meets all standards and is accepted for publication as-is or with minor edits." },
    { label: "Minor Revision",    color: "blue",    desc: "Small changes required. Authors typically have 2 weeks to submit a revised version." },
    { label: "Major Revision",    color: "amber",   desc: "Significant revisions required. Revised manuscript will undergo another round of review." },
    { label: "Reject & Resubmit", color: "orange",  desc: "Fundamental issues identified but the topic has merit. Authors may resubmit after major rework." },
    { label: "Reject",            color: "rose",    desc: "Manuscript does not meet the journal standards and is not suitable for publication." },
  ];

  return (
    <SidebarLayout
      title="Peer Review Process"
      subtitle="Ensuring the highest standards of academic quality and integrity"
      icon={Users}
    >
      <div className="space-y-8">

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Commitment to Quality</h2>
          <p className="text-slate-700 leading-relaxed">
            ToESS follows a rigorous <strong>double-blind peer review</strong> process to ensure the
            highest quality of published research. Every submission is evaluated objectively by
            independent experts, guaranteeing that only original, methodologically sound, and
            impactful research is published.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Review Stages</h2>
          <div className="space-y-4">
            {stages.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all overflow-hidden">
                  <div className="flex items-center gap-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 px-6 py-4">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {stage.step}
                    </div>
                    <div className={`w-9 h-9 bg-${stage.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 text-${stage.color}-600`} />
                    </div>
                    <h3 className="font-bold text-slate-900">{stage.title}</h3>
                  </div>
                  <div className="px-6 py-4 pl-24">
                    <p className="text-slate-600 text-sm leading-relaxed">{stage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-2xl p-8 text-white shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Core Principles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {principles.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-4 bg-white/10 rounded-xl p-5 border border-white/20">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{item.title}</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Possible Editorial Decisions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {decisions.map((d, i) => (
              <div key={i} className={`p-5 bg-${d.color}-50 border border-${d.color}-200 rounded-xl`}>
                <span className={`inline-block px-3 py-1 bg-${d.color}-100 text-${d.color}-700 text-xs font-bold rounded-full mb-3`}>
                  {d.label}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 mb-1">COPE Compliance</h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              ToESS adheres to the guidelines set by the <strong>Committee on Publication Ethics (COPE)</strong> for
              all aspects of the peer review process, ensuring transparency, fairness, and ethical conduct.
            </p>
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}