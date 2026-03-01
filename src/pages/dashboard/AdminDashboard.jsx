import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, CheckCircle, XCircle, Eye, Download, Send, Sparkles, Settings, Users, TrendingUp, UserCheck, RotateCcw } from "lucide-react";
import { auth } from "../../services/firebase";
import { getAllSubmissions, updateSubmission } from "../../services/submissionService";
import { getAllAssignments } from "../../services/reviewerService";
import { sendPaperPublishedEmail } from "../../services/emailService"; // ✅ NEW

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) { setLoading(false); return; }
      try {
        const [submissionsData, assignmentsData] = await Promise.all([
          getAllSubmissions(),
          getAllAssignments()
        ]);
        setSubmissions(submissionsData);
        setAssignments(assignmentsData);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ publishPaper with email notification
  const publishPaper = async (paper) => {
    try {
      const publishData = {
        status: "published",
        isPublished: true,
        publishedDate: new Date().toISOString(),
        volume: 1,
        issue: 1,
        doi: `10.1234/toess.v1i1.${paper.id.slice(0, 4)}`
      };

      await updateSubmission(paper.id, publishData);

      // ✅ Send published email to author
      await sendPaperPublishedEmail({
        authorEmail: paper.authorEmail,
        authorName: paper.authorName,
        paperTitle: paper.title,
        doi: publishData.doi,
        volume: publishData.volume,
        issue: publishData.issue,
      });

      setSubmissions(prev =>
        prev.map(p => p.id === paper.id ? { ...p, ...publishData } : p)
      );
      setSelectedPaper(null);
    } catch (error) {
      console.error("Error publishing paper:", error);
      alert("Failed to publish paper");
    }
  };

  const STATUS_CONFIG = {
    submitted:           { label: "Submitted",          color: "bg-amber-50 text-amber-700 border-amber-200",       icon: Clock },
    "under-review":      { label: "Under Review",       color: "bg-blue-50 text-blue-700 border-blue-200",          icon: Eye },
    "revision-required": { label: "Revision Required",  color: "bg-orange-50 text-orange-700 border-orange-200",    icon: RotateCcw },
    accepted:            { label: "Accepted",           color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
    rejected:            { label: "Rejected",           color: "bg-rose-50 text-rose-700 border-rose-200",          icon: XCircle },
    published:           { label: "Published",          color: "bg-indigo-50 text-indigo-700 border-indigo-200",    icon: TrendingUp },
  };

  const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.submitted;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {cfg.label}
      </span>
    );
  };

  const filtered = submissions.filter(p =>
    filter === "all" ? true : p.status === filter
  );

  const stats = {
    total:       submissions.length,
    submitted:   submissions.filter(p => p.status === "submitted").length,
    underReview: submissions.filter(p => p.status === "under-review").length,
    accepted:    submissions.filter(p => p.status === "accepted").length,
    rejected:    submissions.filter(p => p.status === "rejected").length,
    published:   submissions.filter(p => p.status === "published" || p.isPublished).length,
    reviewsDone: assignments.filter(a => a.reviewSubmitted).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-medium">Loading editorial system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Editorial Management System</h1>
              <p className="text-slate-600 text-sm mt-1">Transactions on Evolutionary Smart Systems</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => navigate('/dashboard/admin/manage-reviewers')}
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 rounded-lg transition flex items-center gap-2 shadow-md">
                <UserCheck className="w-4 h-4" /> Reviewer Applications
              </button>
              <button onClick={() => navigate('/dashboard/admin/assign-reviewers')}
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 rounded-lg transition flex items-center gap-2 shadow-md">
                <Users className="w-4 h-4" /> Assign Reviewers
              </button>
              <button onClick={() => navigate('/dashboard/admin/review-decisions')}
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 rounded-lg transition flex items-center gap-2 shadow-md">
                <CheckCircle className="w-4 h-4" /> Editorial Decisions
              </button>
              <button onClick={() => navigate('/dashboard/admin/special-issues')}
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 rounded-lg transition flex items-center gap-2 shadow-md">
                <Sparkles className="w-4 h-4" /> Special Issues
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-slate-800 text-white hover:bg-slate-900 rounded-lg transition flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {[
            { label: "Total",        value: stats.total,        icon: FileText,    color: "indigo" },
            { label: "Submitted",    value: stats.submitted,    icon: Clock,       color: "amber" },
            { label: "Under Review", value: stats.underReview,  icon: Users,       color: "blue" },
            { label: "Reviews Done", value: stats.reviewsDone,  icon: CheckCircle, color: "green" },
            { label: "Accepted",     value: stats.accepted,     icon: CheckCircle, color: "emerald" },
            { label: "Rejected",     value: stats.rejected,     icon: XCircle,     color: "rose" },
            { label: "Published",    value: stats.published,    icon: TrendingUp,  color: "indigo" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                <span className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</span>
              </div>
              <p className="text-xs font-medium text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Reviewer Applications", sub: "Approve or reject",    path: "/dashboard/admin/manage-reviewers", icon: UserCheck,   from: "from-teal-600",   to: "to-cyan-600",    textColor: "text-teal-100" },
            { label: "Assign Reviewers",       sub: "Manage assignments",   path: "/dashboard/admin/assign-reviewers", icon: Users,       from: "from-green-600",  to: "to-emerald-600", textColor: "text-green-100" },
            { label: "Editorial Decisions",    sub: "Make final decisions", path: "/dashboard/admin/review-decisions", icon: CheckCircle, from: "from-indigo-600", to: "to-blue-600",    textColor: "text-blue-100" },
            { label: "Special Issues",         sub: "Manage special issues",path: "/dashboard/admin/special-issues",   icon: Sparkles,    from: "from-purple-600", to: "to-indigo-600",  textColor: "text-purple-100" },
          ].map(({ label, sub, path, icon: Icon, from, to, textColor }) => (
            <button key={label} onClick={() => navigate(path)}
              className={`bg-gradient-to-br ${from} ${to} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{label}</h3>
                  <p className={`text-sm ${textColor}`}>{sub}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === "all" ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                All <span className="ml-1 opacity-70">({submissions.length})</span>
              </button>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === key ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                  {cfg.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === key ? "bg-indigo-500" : "bg-slate-200 text-slate-600"}`}>
                    {submissions.filter(p => p.status === key).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {["table", "cards"].map(mode => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-lg ${viewMode === mode ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:bg-slate-100"}`}>
                  {mode === "table"
                    ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  }
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table View */}
        {viewMode === "table" ? (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {["Manuscript", "Author", "Type", "Category", "Status", "Actions"].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 ${p.submissionType === "Special Issue" ? "bg-purple-100" : "bg-indigo-100"} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            {p.submissionType === "Special Issue" ? <Sparkles className="w-5 h-5 text-purple-600" /> : <FileText className="w-5 h-5 text-indigo-600" />}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-1">{p.title}</h3>
                            {p.fileUrl && (
                              <button onClick={e => { e.stopPropagation(); window.open(p.fileUrl, '_blank'); }}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                                <Download className="w-3 h-3" /> View File
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900 text-sm">{p.authorName || 'N/A'}</p>
                        <p className="text-xs text-slate-500">{p.authorEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        {p.submissionType === "Special Issue"
                          ? <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded"><Sparkles className="w-3 h-3" /> Special</span>
                          : <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">Regular</span>
                        }
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                          {p.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedPaper(p)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                            <Eye className="w-4 h-4" />
                          </button>
                          {p.status === "accepted" && (
                            <button onClick={() => publishPaper(p)}
                              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> Publish
                            </button>
                          )}
                          {p.status === "published" && (
                            <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg">
                              Published ✓
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 ${p.submissionType === "Special Issue" ? "bg-purple-100" : "bg-indigo-100"} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    {p.submissionType === "Special Issue" ? <Sparkles className="w-6 h-6 text-purple-600" /> : <FileText className="w-6 h-6 text-indigo-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2 leading-tight">{p.title}</h3>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                <div className="text-sm mb-4 space-y-1">
                  <div><span className="text-slate-500">Author: </span><span className="font-medium">{p.authorName || p.authorEmail}</span></div>
                  {p.doi && <div><span className="text-slate-500">DOI: </span><span className="font-mono text-xs text-indigo-600">{p.doi}</span></div>}
                </div>
                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <button onClick={() => setSelectedPaper(p)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                    View Details
                  </button>
                  {p.status === "accepted" && (
                    <button onClick={() => publishPaper(p)}
                      className="flex-1 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition">
                      Publish
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No submissions found</h3>
            <p className="text-slate-600">No submissions match the selected filter.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Manuscript Details</h2>
              <button onClick={() => setSelectedPaper(null)} className="p-2 hover:bg-slate-100 rounded-lg transition">
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{selectedPaper.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={selectedPaper.status} />
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                    {selectedPaper.category || 'Uncategorized'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">Author</p>
                  <p className="font-medium">{selectedPaper.authorName || 'N/A'}</p>
                  <p className="text-xs text-slate-500">{selectedPaper.authorEmail}</p>
                </div>
                {selectedPaper.doi && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">DOI</p>
                    <p className="font-mono text-xs text-indigo-600">{selectedPaper.doi}</p>
                  </div>
                )}
              </div>
              {selectedPaper.abstract && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Abstract</h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3">{selectedPaper.abstract}</p>
                </div>
              )}
              {selectedPaper.fileUrl && (
                <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Manuscript PDF</p>
                      <p className="text-xs text-slate-500">Click to view</p>
                    </div>
                  </div>
                  <button onClick={() => window.open(selectedPaper.fileUrl, '_blank')}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
                    <Download className="w-4 h-4" /> Open
                  </button>
                </div>
              )}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                {selectedPaper.status === "accepted" && (
                  <button onClick={() => publishPaper(selectedPaper)}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Publish Paper
                  </button>
                )}
                <button className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition flex items-center justify-center gap-2">
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