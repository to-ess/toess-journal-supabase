import { useEffect } from "react";
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

/* -------------------- Custom Styles -------------------- */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');

  .rg-root { font-family: 'DM Sans', sans-serif; }
  .rg-root h1, .rg-root h2, .rg-root h3 { font-family: 'Crimson Pro', serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .rg-a1 { animation: fadeUp 0.6s ease 0.05s both; }

  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }

  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .guide-card {
    transition: transform 0.22s ease, box-shadow 0.22s ease;
  }

  .guide-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(29,78,216,0.08);
  }
`;

/* -------------------- Reveal Animation -------------------- */
function initReveal() {
  const check = () => {
    document.querySelectorAll(".reveal").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight - 60) {
        el.classList.add("visible");
      }
    });
  };

  check();
  window.addEventListener("scroll", check, { passive: true });

  return () => window.removeEventListener("scroll", check);
}

/* ==================== Component ==================== */

export default function ReviewerGuidelines() {
  useEffect(() => {
    const cleanup = initReveal();
    return cleanup;
  }, []);

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
      <div className="rg-root space-y-10">
        <style>{STYLES}</style>

        {/* Overview */}
        <div className="rg-a1 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The Role of Peer Reviewers
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Reviewers play a crucial role in maintaining the academic integrity
            and quality of published research. Your expertise ensures that
            innovative, rigorous, and ethical research contributes meaningfully
            to the field of evolutionary smart systems.
          </p>
        </div>

        {/* Review Sections */}
        <div className="reveal space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Review Process Guidelines
          </h2>

          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <div
                key={i}
                className="guide-card bg-white rounded-xl border border-slate-200 shadow-sm p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon size={18} className="text-indigo-600" />
                  <h3 className="font-bold text-slate-900">
                    {section.title}
                  </h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {section.content}
                </p>
              </div>
            );
          })}
        </div>

        {/* Evaluation Criteria */}
        <div className="reveal bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-8 text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-6">
            Manuscript Evaluation Criteria
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {criteria.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3 border border-white/20"
              >
                <CheckCircle size={16} className="text-emerald-400" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="reveal bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Mail size={18} className="text-blue-600 mt-1" />
            <div>
              <h4 className="font-bold text-slate-900 mb-1">
                Need Assistance?
              </h4>
              <p className="text-sm text-slate-600 mb-3">
                Contact the editorial office for queries regarding review
                submissions or technical issues.
              </p>
              <a
                href="/contact"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                Contact Editorial Office
              </a>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="reveal flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <AlertCircle size={18} className="text-amber-600 mt-1" />
          <div>
            <h4 className="font-bold text-amber-900 mb-1">
              Important Notice
            </h4>
            <p className="text-sm text-amber-800">
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