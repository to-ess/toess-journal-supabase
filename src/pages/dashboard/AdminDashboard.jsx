import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Send,
  Sparkles,
  Settings,
  Users,
  TrendingUp,
  UserCheck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "../../services/supabase";
import {
  getAllSubmissions,
  updateSubmission,
} from "../../services/submissionService";
import { getAllAssignments } from "../../services/reviewerService";
import { sendPaperPublishedEmail } from "../../services/emailService";

const STATUS_CONFIG = {
  submitted: {
    label: "Submitted",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  under_review: {
    label: "Under Review",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Eye,
  },
  revision_requested: {
    label: "Revision Required",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: RotateCcw,
  },
  accepted: {
    label: "Accepted",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    icon: XCircle,
  },
  published: {
    label: "Published",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: TrendingUp,
  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.submitted;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      {cfg.label}
    </span>
  );
};

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [error, setError] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }
        const [submissionsData, assignmentsData] = await Promise.all([
          getAllSubmissions(),
          getAllAssignments(),
        ]);
        setSubmissions(submissionsData || []);
        setAssignments(assignmentsData || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
        setSubmissions([]);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const publishPaper = async (paper) => {
    try {
      const doi = `10.1234/toess.v1i1.${paper.id.slice(0, 4)}`;
      const publishData = {
        status: "published",
        updated_at: new Date().toISOString(),
      };
      await updateSubmission(paper.id, publishData);
      await sendPaperPublishedEmail({
        authorEmail: paper.users?.email,
        authorName:
          `${paper.users?.given_name || ""} ${paper.users?.family_name || ""}`.trim(),
        paperTitle: paper.title,
        doi,
      });
      setSubmissions((prev) =>
        prev.map((p) => (p.id === paper.id ? { ...p, ...publishData } : p)),
      );
      setSelectedPaper(null);
    } catch (err) {
      console.error("Error publishing:", err);
      alert("Failed to publish paper");
    }
  };

  const filtered = submissions.filter((p) =>
    filter === "all" ? true : p.status === filter,
  );

  const stats = {
    total: submissions.length,
    submitted: submissions.filter((p) => p.status === "submitted").length,
    underReview: submissions.filter((p) => p.status === "under_review").length,
    accepted: submissions.filter((p) => p.status === "accepted").length,
    rejected: submissions.filter((p) => p.status === "rejected").length,
    published: submissions.filter((p) => p.status === "published").length,
    reviewsDone: assignments.filter((a) => a.status === "completed").length,
  };

  const navItems = [
    {
      label: "Reviewer Applications",
      path: "/dashboard/admin/manage-reviewers",
      icon: UserCheck,
      from: "from-teal-600",
      to: "to-cyan-600",
    },
    {
      label: "Assign Reviewers",
      path: "/dashboard/admin/assign-reviewers",
      icon: Users,
      from: "from-green-600",
      to: "to-emerald-600",
    },
    {
      label: "Editorial Decisions",
      path: "/dashboard/admin/review-decisions",
      icon: CheckCircle,
      from: "from-indigo-600",
      to: "to-blue-600",
    },
    {
      label: "Special Issues",
      path: "/dashboard/admin/special-issues",
      icon: Sparkles,
      from: "from-purple-600",
      to: "to-indigo-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-medium">
            Loading editorial system...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-slate-900 truncate">
                Editorial Management
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm hidden sm:block">
                Transactions on Evolutionary Smart Systems
              </p>
            </div>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap justify-end">
              {navItems.map(({ label, path, icon: Icon, from, to }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className={`px-3 py-2 text-xs font-semibold bg-gradient-to-r ${from} ${to} text-white rounded-lg hover:opacity-90 transition flex items-center gap-1.5 shadow-sm whitespace-nowrap`}
                >
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
              <button className="px-3 py-2 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" /> Settings
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
            >
              {mobileNavOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile nav dropdown */}
          {mobileNavOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 pb-2">
              {navItems.map(({ label, path, icon: Icon, from, to }) => (
                <button
                  key={label}
                  onClick={() => {
                    navigate(path);
                    setMobileNavOpen(false);
                  }}
                  className={`px-3 py-2.5 text-xs font-semibold bg-gradient-to-r ${from} ${to} text-white rounded-lg flex items-center gap-1.5`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />{" "}
                  <span className="truncate">{label}</span>
                </button>
              ))}
              <button className="px-3 py-2.5 text-xs font-semibold bg-slate-800 text-white rounded-lg flex items-center gap-1.5 col-span-1">
                <Settings className="w-3.5 h-3.5" /> Settings
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <p className="font-semibold">Error loading data</p>
            <p>{error}</p>
          </div>
        )}

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            {
              label: "Total",
              value: stats.total,
              icon: FileText,
              color: "indigo",
            },
            {
              label: "Submitted",
              value: stats.submitted,
              icon: Clock,
              color: "amber",
            },
            {
              label: "Under Review",
              value: stats.underReview,
              icon: Users,
              color: "blue",
            },
            {
              label: "Reviews Done",
              value: stats.reviewsDone,
              icon: CheckCircle,
              color: "green",
            },
            {
              label: "Accepted",
              value: stats.accepted,
              icon: CheckCircle,
              color: "emerald",
            },
            {
              label: "Rejected",
              value: stats.rejected,
              icon: XCircle,
              color: "rose",
            },
            {
              label: "Published",
              value: stats.published,
              icon: TrendingUp,
              color: "indigo",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                <span className={`text-xl font-bold text-${stat.color}-600`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Quick action cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: "Reviewer Applications",
              sub: "Approve or reject",
              path: "/dashboard/admin/manage-reviewers",
              icon: UserCheck,
              from: "from-teal-600",
              to: "to-cyan-600",
              text: "text-teal-100",
            },
            {
              label: "Assign Reviewers",
              sub: "Manage assignments",
              path: "/dashboard/admin/assign-reviewers",
              icon: Users,
              from: "from-green-600",
              to: "to-emerald-600",
              text: "text-green-100",
            },
            {
              label: "Editorial Decisions",
              sub: "Make final decisions",
              path: "/dashboard/admin/review-decisions",
              icon: CheckCircle,
              from: "from-indigo-600",
              to: "to-blue-600",
              text: "text-blue-100",
            },
            {
              label: "Special Issues",
              sub: "Manage special issues",
              path: "/dashboard/admin/special-issues",
              icon: Sparkles,
              from: "from-purple-600",
              to: "to-indigo-600",
              text: "text-purple-100",
            },
          ].map(({ label, sub, path, icon: Icon, from, to, text }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`bg-gradient-to-br ${from} ${to} text-white p-5 rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition text-left w-full`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base leading-tight">{label}</h3>
                  <p className={`text-xs mt-0.5 ${text}`}>{sub}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* ── Filters + view toggle ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === "all" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                All ({submissions.length})
              </button>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${filter === key ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                >
                  {cfg.label} (
                  {submissions.filter((p) => p.status === key).length})
                </button>
              ))}
            </div>
            <div className="flex gap-1 shrink-0">
              {["table", "cards"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-lg transition ${viewMode === mode ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:bg-slate-100"}`}
                >
                  {mode === "table" ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FileText className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              No submissions found
            </h3>
            <p className="text-slate-500 text-sm">
              No submissions match the selected filter.
            </p>
          </div>
        )}

        {/* ── Table view ── */}
        {viewMode === "table" && filtered.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {/* Desktop table (md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {[
                      "Manuscript",
                      "Author",
                      "Article Type",
                      "Submission Type",
                      "Category",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((p) => {
                    const authorName =
                      `${p.users?.given_name || ""} ${p.users?.family_name || ""}`.trim() ||
                      "N/A";
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 max-w-[220px]">
                          <div className="flex items-start gap-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                              <FileText className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
                                {p.title}
                              </p>
                              {p.manuscript_id && (
                                <p className="text-xs text-slate-400 font-mono mt-0.5">
                                  {p.manuscript_id}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900 text-sm whitespace-nowrap">
                            {authorName}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-[150px]">
                            {p.users?.email}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded whitespace-nowrap">
                            {p.article_type || "Regular"}
                          </span>
                        </td>
                        {/* ✅ Submission Type */}
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap ${
                              p.submission_type === "Special Issue"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {p.submission_type || "Regular"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded whitespace-nowrap">
                            {p.category || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedPaper(p)}
                              title="View details"
                              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {p.file_url && (
                              <a
                                href={p.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Download"
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            )}
                            {p.status === "accepted" && (
                              <button
                                onClick={() => publishPaper(p)}
                                className="px-2.5 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center gap-1 whitespace-nowrap"
                              >
                                <TrendingUp className="w-3 h-3" /> Publish
                              </button>
                            )}
                            {p.status === "published" && (
                              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg whitespace-nowrap">
                                Published ✓
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile accordion (< md) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filtered.map((p) => {
                const authorName =
                  `${p.users?.given_name || ""} ${p.users?.family_name || ""}`.trim() ||
                  "N/A";
                const isExpanded = expandedRow === p.id;
                return (
                  <div key={p.id}>
                    <button
                      className="w-full text-left p-4 flex items-start gap-3"
                      onClick={() => setExpandedRow(isExpanded ? null : p.id)}
                    >
                      <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
                          {p.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <StatusBadge status={p.status} />
                          <span className="text-xs text-slate-500">
                            {authorName}
                          </span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {[
                            {
                              label: "Article Type",
                              value: p.article_type || "Regular",
                            },
                            {
                              label: "Submission Type",
                              value: p.submission_type || "Regular",
                              purple: p.submission_type === "Special Issue",
                            },
                            { label: "Category", value: p.category || "—" },
                            { label: "Email", value: p.users?.email || "—" },
                          ].map(({ label, value, purple }) => (
                            <div
                              key={label}
                              className="bg-slate-50 rounded-lg p-2.5"
                            >
                              <p className="text-slate-400 mb-0.5">{label}</p>
                              <p
                                className={`font-medium truncate ${purple ? "text-purple-700" : "text-slate-700"}`}
                              >
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedPaper(p)}
                            className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          {p.file_url && (
                            <a
                              href={p.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition flex items-center justify-center gap-1"
                            >
                              <Download className="w-3.5 h-3.5" /> Download
                            </a>
                          )}
                          {p.status === "accepted" && (
                            <button
                              onClick={() => publishPaper(p)}
                              className="flex-1 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-1"
                            >
                              <TrendingUp className="w-3.5 h-3.5" /> Publish
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Cards view ── */}
        {viewMode === "cards" && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((p) => {
              const authorName =
                `${p.users?.given_name || ""} ${p.users?.family_name || ""}`.trim() ||
                "N/A";
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-3 mb-2">
                        {p.title}
                      </h3>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>

                  {/* ✅ Info grid with submission_type */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    {[
                      { label: "Author", value: authorName },
                      { label: "Email", value: p.users?.email || "—" },
                      {
                        label: "Article Type",
                        value: p.article_type || "Regular",
                      },
                      {
                        label: "Submission Type",
                        value: p.submission_type || "Regular",
                        purple: p.submission_type === "Special Issue",
                      },
                      { label: "Category", value: p.category || "—" },
                      {
                        label: "Submitted",
                        value: p.created_at
                          ? new Date(p.created_at).toLocaleDateString()
                          : "—",
                      },
                    ].map(({ label, value, purple }) => (
                      <div key={label} className="bg-slate-50 rounded-lg p-2">
                        <p className="text-slate-400 mb-0.5">{label}</p>
                        <p
                          className={`font-medium truncate ${purple ? "text-purple-700" : "text-slate-700"}`}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedPaper(p)}
                      className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                    {p.file_url && (
                      <a
                        href={p.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition flex items-center justify-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Paper
                      </a>
                    )}
                    {p.status === "accepted" && (
                      <button
                        onClick={() => publishPaper(p)}
                        className="flex-1 py-2 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition flex items-center justify-center gap-1"
                      >
                        <TrendingUp className="w-3.5 h-3.5" /> Publish
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-slate-900">
                Manuscript Details
              </h2>
              <button
                onClick={() => setSelectedPaper(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug">
                  {selectedPaper.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={selectedPaper.status} />
                  {selectedPaper.category && (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                      {selectedPaper.category}
                    </span>
                  )}
                  {/* ✅ Submission type badge in modal */}
                  {selectedPaper.submission_type && (
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        selectedPaper.submission_type === "Special Issue"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {selectedPaper.submission_type}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  {
                    label: "Author",
                    value:
                      `${selectedPaper.users?.given_name || ""} ${selectedPaper.users?.family_name || ""}`.trim() ||
                      "N/A",
                  },
                  { label: "Email", value: selectedPaper.users?.email || "—" },
                  {
                    label: "Submitted",
                    value: selectedPaper.created_at
                      ? new Date(selectedPaper.created_at).toLocaleDateString()
                      : "—",
                  },
                  {
                    label: "Article Type",
                    value: selectedPaper.article_type || "Regular",
                  },
                  {
                    label: "Manuscript ID",
                    value: selectedPaper.manuscript_id || "—",
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <p className="font-medium text-slate-800 text-sm break-all">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {selectedPaper.abstract && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">
                    Abstract
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3">
                    {selectedPaper.abstract}
                  </p>
                </div>
              )}

              {selectedPaper.keywords && selectedPaper.keywords.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">
                    Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedPaper.keywords)
                      ? selectedPaper.keywords
                      : selectedPaper.keywords.split(",")
                    ).map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full"
                      >
                        {kw.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPaper.paper_authors &&
                selectedPaper.paper_authors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">
                      Authors
                    </h4>
                    <div className="space-y-2">
                      {selectedPaper.paper_authors.map((author, i) => (
                        <div
                          key={i}
                          className="p-3 bg-slate-50 rounded-lg text-sm"
                        >
                          <p className="font-medium text-slate-900">
                            {author.full_name}{" "}
                            {author.is_corresponding && (
                              <span className="text-xs text-indigo-600 font-normal">
                                (Corresponding)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {author.institution} · {author.email}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedPaper.file_url ? (
                <a
                  href={selectedPaper.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition"
                >
                  <Download className="w-4 h-4" /> Download Full Paper (PDF)
                </a>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                  No manuscript file attached to this submission.
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
                {selectedPaper.status === "accepted" && (
                  <button
                    onClick={() => publishPaper(selectedPaper)}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <TrendingUp className="w-4 h-4" /> Publish Paper
                  </button>
                )}
                <button className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition flex items-center justify-center gap-2 text-sm">
                  <Send className="w-4 h-4" /> Contact Author
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
