import {
  Users,
  Shield,
  FileSearch,
  CheckCircle,
  AlertCircle,
  Clock,
  Mail,
  BookOpen,
  Award,
} from "lucide-react";

import SidebarLayout from "../layouts/SidebarLayout";

export default function ReviewerGuidelines() {
  const sections = [
    {
      icon: FileSearch,
      title: "Submission Review",
      content:
        "Reviewers submit reports via a secure online system. Initial screening ensures manuscripts meet editorial criteria before formal peer review.",
    },
    {
      icon: Users,
      title: "Reviewer Selection",
      content:
        "Selection is based on subject expertise, academic contribution, and review experience. Confidentiality is mandatory.",
    },
    {
      icon: CheckCircle,
      title: "Review Process",
      content:
        "Evaluate originality, methodology, statistical accuracy, clarity, and ethical standards. Provide constructive and professional feedback.",
    },
    {
      icon: Award,
      title: "Decision Making",
      content:
        "Your recommendations guide editorial decisions including acceptance, revision, or rejection.",
    },
    {
      icon: Shield,
      title: "Confidentiality & Anonymity",
      content:
        "The review process is strictly double-blind. Do not disclose identities or share manuscript details.",
    },
    {
      icon: Clock,
      title: "Timeliness",
      content:
        "Submit reviews within the requested timeline (typically 2–4 weeks) to maintain efficiency.",
    },
    {
      icon: BookOpen,
      title: "Resources & Assistance",
      content:
        "Technical support and editorial assistance are available if needed during review.",
    },
  ];

  const criteria = [
    "Originality and significance",
    "Research methodology",
    "Data analysis and results",
    "Statistical validity",
    "Clarity of presentation",
    "References and citations",
    "Ethical considerations",
    "Contribution to the field",
  ];

  return (
    <SidebarLayout
      title="Reviewer Guidelines"
      subtitle="Essential Information for Peer Reviewers at ToESS"
      icon={Users}
    >
      <div className="space-y-10">

        {/* Overview */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The Role of Peer Reviewers
          </h2>
          <p className="text-slate-700 leading-relaxed">
            Reviewers play a crucial role in maintaining the academic integrity
            and quality of published research. Your expertise ensures that
            innovative, rigorous, and ethical research contributes meaningfully
            to the field of evolutionary smart systems.
          </p>
        </div>

        {/* Review Process Guidelines */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Review Process Guidelines
          </h2>

          <div className="space-y-4">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-slate-900">{section.title}</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed pl-11">
                    {section.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Evaluation Criteria */}
        <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-2xl p-8 text-white shadow-xl">
          <h2 className="text-2xl font-bold mb-6">
            Manuscript Evaluation Criteria
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {criteria.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3 border border-white/20"
              >
                <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail size={18} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Need Assistance?</h4>
              <p className="text-sm text-slate-600 mb-4">
                Contact the editorial office for queries regarding review
                submissions or technical issues.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
              >
                <Mail size={14} />
                Contact Editorial Office
              </a>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle size={18} className="text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 mb-1">Important Notice</h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              All manuscripts are confidential documents. Do not share,
              reproduce, or distribute review materials without written
              permission from the Editor-in-Chief.
            </p>
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}