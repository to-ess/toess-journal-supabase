import { Link } from "react-router-dom";
import { FileCheck, BookOpen, Database, Mail, Users, FileSearch, Star, ChevronRight } from "lucide-react";

export default function UsefulSidebar() {
  const links = [
    { label: "Plagiarism Policy", to: "/plagiarism-policy", icon: FileCheck },
    { label: "Author Guidelines", to: "/guidelines", icon: BookOpen },
    { label: "Indexed In", to: "/indexing", icon: Database },
    { label: "Contact Us", to: "/contact", icon: Mail },
    { label: "Peer Review", to: "/peer-review", icon: Users },
    { label: "Special Issue", to: "/special-issue", icon: Star },
    { label: "Reviewer Guidelines", to: "/reviewer-guidelines", icon: FileSearch },
  ];

  return (
    <aside className="w-full md:w-80">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-xl px-6 py-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Quick Links
        </h3>
        <p className="text-xs text-blue-100 mt-1">Essential resources for authors and reviewers</p>
      </div>

      {/* Links Container */}
      <div className="bg-white rounded-b-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                to={link.to}
                className="w-full group block"
              >
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:from-indigo-50 hover:to-blue-50 hover:border-indigo-300 transition-all duration-200 hover:shadow-md">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-slate-900 text-sm group-hover:text-indigo-700 transition-colors">
                      {link.label}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-t border-slate-200 px-6 py-4">
          <p className="text-xs text-slate-600 text-center">
            Need help? <Link to="/contact" className="text-indigo-600 font-semibold hover:text-indigo-700">Contact Editorial Office</Link>
          </p>
        </div>
      </div>

      {/* Submit CTA Card */}
      <div className="mt-6 bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 flex-shrink-0">
            <Star className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">Submit Your Research</h4>
            <p className="text-xs text-blue-100">
              Join researchers worldwide in advancing evolutionary computing
            </p>
          </div>
        </div>
        <Link
          to="/submit"
          className="block w-full px-4 py-3 bg-white text-indigo-900 rounded-lg font-semibold hover:bg-blue-50 transition shadow-md hover:shadow-lg text-center"
        >
          <span className="flex items-center justify-center gap-2">
            Submit Manuscript
            <ChevronRight className="w-4 h-4" />
          </span>
        </Link>
      </div>

      {/* Stats Card */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h4 className="font-bold text-slate-900 mb-4 text-sm">Journal Metrics</h4>
        <div className="space-y-3">
          {[
            { label: "Impact Factor", value: "3.45" },
            { label: "Review Time", value: "2-4 weeks" },
            { label: "Acceptance Rate", value: "45%" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-0 last:pb-0">
              <span className="text-xs text-slate-600">{stat.label}</span>
              <span className="text-sm font-bold text-indigo-600">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}