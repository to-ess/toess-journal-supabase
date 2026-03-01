import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Clock, CheckCircle, XCircle, Upload, BookOpen,
  Eye, Download, Award, Calendar, AlertCircle, Plus, Search,
  Users, RotateCcw, TrendingUp
} from "lucide-react";
import { auth } from "../../services/firebase";
import { getMySubmissions } from "../../services/submissionService";
import { getReviewerRequestStatus } from "../../services/reviewerService";

// ✅ Single source of truth for all statuses
const STATUS_CONFIG = {
  submitted:           { label: "Submitted",         color: "bg-amber-50 text-amber-700 border-amber-200",       icon: Clock,       desc: "Your paper is awaiting reviewer assignment." },
  "under-review":      { label: "Under Review",      color: "bg-blue-50 text-blue-700 border-blue-200",          icon: Eye,         desc: "Your paper is currently being reviewed by experts." },
  "revision-required": { label: "Revision Required", color: "bg-orange-50 text-orange-700 border-orange-200",    icon: RotateCcw,   desc: "Reviewers have requested revisions. Check editorial comments below." },
  accepted:            { label: "Accepted",          color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle, desc: "Congratulations! Your paper has been accepted for publication." },
  rejected:            { label: "Rejected",          color: "bg-rose-50 text-rose-700 border-rose-200",          icon: XCircle,     desc: "Your paper was not accepted at this time." },
  published:           { label: "Published",         color: "bg-indigo-50 text-indigo-700 border-indigo-200",    icon: TrendingUp,  desc: "Your paper is published and publicly accessible." },
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

// ✅ Safe date formatter — handles Date objects, Firestore Timestamps, and null
const formatDate = (date, options = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!date) return "N/A";
  if (date instanceof Date) return date.toLocaleDateString('en-US', options);
  if (date?.seconds) return new Date(date.seconds * 1000).toLocaleDateString('en-US', options);
  if (typeof date === 'string') return new Date(date).toLocaleDateString('en-US', options);
  return "N/A";
};

export default function AuthorDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [viewMode, setViewMode] = useState("cards");
  const [reviewerStatus, setReviewerStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) { navigate('/login'); return; }
      try {
        const [data, reviewerRequest] = await Promise.all([
          getMySubmissions(user.uid),
          getReviewerRequestStatus(user.uid)
        ]);
        setSubmissions(data);
        if (reviewerRequest) setReviewerStatus(reviewerRequest.status);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // ✅ Fixed stats — correct status strings
  const stats = {
    total:     submissions.length,
    inReview:  submissions.filter(p => ["submitted", "under-review"].includes(p.status)).length,
    accepted:  submissions.filter(p => p.status === "accepted").length,  // was "approved" ❌
    published: submissions.filter(p => p.status === "published" || p.isPublished).length,
  };

  const ReviewerBanner = () => {
    if (reviewerStatus === "approved") return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-900">You're an Approved Reviewer!</p>
            <p className="text-sm text-green-700">Access your reviewer dashboard to see assigned papers.</p>
          </div>
        </div>
        <button onClick={() => navigate("/reviewer/dashboard")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">
          Reviewer Dashboard →
        </button>
      </div>
    );
    if (reviewerStatus === "pending") return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-8 flex items-center gap-3">
        <Clock className="w-6 h-6 text-yellow-600 shrink-0" />
        <div>
          <p className="font-semibold text-yellow-900">Reviewer Application Pending</p>
          <p className="text-sm text-yellow-700">Your application is under review. You'll be notified once approved.</p>
        </div>
      </div>
    );
    if (reviewerStatus === "rejected") return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8 flex items-center gap-3">
        <XCircle className="w-6 h-6 text-red-600 shrink-0" />
        <div>
          <p className="font-semibold text-red-900">Reviewer Application Not Approved</p>
          <p className="text-sm text-red-700">Your previous application was not approved. Contact the editorial team for more information.</p>
        </div>
      </div>
    );
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-5 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-indigo-900">Interested in Peer Reviewing?</p>
            <p className="text-sm text-indigo-700">Join our reviewer panel and help evaluate research submissions.</p>
          </div>
        </div>
        <button onClick={() => navigate("/reviewer-registration")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shrink-0">
          Apply as Reviewer →
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Author Dashboard</h1>
              <p className="text-slate-600 text-sm mt-1">Manage your manuscripts and track review status</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/guidelines')}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Guidelines
              </button>
              <button onClick={() => navigate('/submit')}
                className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Submission
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        <ReviewerBanner />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Submissions", value: stats.total,     icon: FileText,    bg: "bg-indigo-100",  text: "text-indigo-600" },
            { label: "Under Review",      value: stats.inReview,  icon: Clock,       bg: "bg-amber-100",   text: "text-amber-600" },
            { label: "Accepted",          value: stats.accepted,  icon: CheckCircle, bg: "bg-emerald-100", text: "text-emerald-600" },
            { label: "Published",         value: stats.published, icon: Award,       bg: "bg-blue-100",    text: "text-blue-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.text}`} />
                </div>
                <span className={`text-3xl font-bold ${stat.text}`}>{stat.value}</span>
              </div>
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200 hover:shadow-md transition">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Submit New Manuscript</h3>
                <p className="text-sm text-slate-600 mb-4">Submit your original research for double-blind peer review.</p>
                <button onClick={() => navigate('/submit')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                  Start Submission
                </button>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 hover:shadow-md transition">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Author Guidelines</h3>
                <p className="text-sm text-slate-600 mb-4">Review formatting requirements and submission policies.</p>
                <button onClick={() => navigate('/guidelines')}
                  className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 transition">
                  View Guidelines
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Publication Process</h3>
              <ul className="text-sm text-blue-800 space-y-1.5">
                <li>• <strong>Submitted</strong> → awaiting reviewer assignment</li>
                <li>• <strong>Under Review</strong> → being evaluated by expert reviewers</li>
                <li>• <strong>Revision Required</strong> → revisions requested, check editorial comments</li>
                <li>• <strong>Accepted</strong> → congratulations! pending publication</li>
                <li>• <strong>Published</strong> → live and publicly accessible with DOI</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">My Submissions</h2>
              <p className="text-sm text-slate-600 mt-1">Track and manage your manuscript submissions</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                <Search className="w-5 h-5" />
              </button>
              <button onClick={() => setViewMode(viewMode === "cards" ? "list" : "cards")}
                className="px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition">
                {viewMode === "cards" ? "List View" : "Card View"}
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-600">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No submissions yet</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">Submit your first manuscript for peer review.</p>
                <button onClick={() => navigate('/submit')}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition inline-flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Submit Your First Paper
                </button>
              </div>
            ) : viewMode === "cards" ? (
              <div className="grid md:grid-cols-2 gap-6">
                {submissions.map(paper => (
                  <div key={paper.id} className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 hover:shadow-lg transition p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 mb-2 leading-tight">{paper.title}</h3>
                        <StatusBadge status={paper.status} />
                      </div>
                    </div>

                    {/* ✅ Status description */}
                    {STATUS_CONFIG[paper.status] && (
                      <p className="text-xs text-slate-500 italic mb-3">{STATUS_CONFIG[paper.status].desc}</p>
                    )}

                    {/* ✅ Show editorial comments if present */}
                    {paper.editorialComments && (
                      <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs font-semibold text-amber-800 mb-1">Editorial Comments:</p>
                        <p className="text-xs text-amber-900">{paper.editorialComments}</p>
                      </div>
                    )}

                    <div className="space-y-1.5 mb-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {/* ✅ Safe date — no more .seconds crash */}
                        <span>Submitted: {formatDate(paper.createdAt)}</span>
                      </div>
                      {paper.category && (
                        <div className="flex items-center gap-2">
                          <span>Category:</span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">{paper.category}</span>
                        </div>
                      )}
                      {paper.doi && (
                        <p className="text-xs font-mono text-indigo-600">DOI: {paper.doi}</p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-slate-200">
                      <button onClick={() => setSelectedPaper(paper)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" /> View Details
                      </button>
                      {paper.fileUrl && (
                        <button onClick={() => window.open(paper.fileUrl, '_blank')}
                          className="flex-1 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" /> Download
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map(paper => (
                  <div key={paper.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 mb-1 truncate">{paper.title}</h3>
                        {/* ✅ Safe date */}
                        <p className="text-xs text-slate-500">Submitted on {formatDate(paper.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={paper.status} />
                      <button onClick={() => setSelectedPaper(paper)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Manuscript Details</h2>
              <button onClick={() => setSelectedPaper(null)} className="p-2 hover:bg-slate-100 rounded-lg transition">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{selectedPaper.title}</h3>
                <StatusBadge status={selectedPaper.status} />
                {STATUS_CONFIG[selectedPaper.status] && (
                  <p className="text-sm text-slate-500 mt-2 italic">{STATUS_CONFIG[selectedPaper.status].desc}</p>
                )}
              </div>

              {/* ✅ Editorial comments prominently shown */}
              {selectedPaper.editorialComments && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm font-semibold text-amber-900 mb-2">📋 Editorial Decision & Comments</p>
                  <p className="text-sm text-amber-800 leading-relaxed">{selectedPaper.editorialComments}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">Submission Date</p>
                  {/* ✅ Safe date */}
                  <p className="font-medium">{formatDate(selectedPaper.createdAt, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                {selectedPaper.doi && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">DOI</p>
                    <p className="font-mono text-xs text-indigo-600">{selectedPaper.doi}</p>
                  </div>
                )}
                {selectedPaper.publishedDate && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">Published Date</p>
                    <p className="font-medium">{formatDate(selectedPaper.publishedDate, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                )}
              </div>

              {selectedPaper.abstract && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Abstract</h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3">{selectedPaper.abstract}</p>
                </div>
              )}

              {selectedPaper.keywords?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPaper.keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                {selectedPaper.fileUrl && (
                  <button onClick={() => window.open(selectedPaper.fileUrl, '_blank')}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Download Manuscript
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}