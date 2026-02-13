import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, CheckCircle, XCircle, Upload, BookOpen, Eye, Download, TrendingUp, Award, Calendar, AlertCircle, ExternalLink, Plus, Search } from "lucide-react";
import { auth } from "../../services/firebase";
import { getMySubmissions } from "../../services/submissionService";

export default function AuthorDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [viewMode, setViewMode] = useState("cards"); // cards or list
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      const user = auth.currentUser;
      if (!user) {
        // Redirect to login if not authenticated
        navigate('/login');
        return;
      }

      try {
        const data = await getMySubmissions(user.uid);
        setSubmissions(data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [navigate]);

  const stats = {
    total: submissions.length,
    inReview: submissions.filter(p => p.status === "submitted").length,
    accepted: submissions.filter(p => p.status === "approved").length,
    published: submissions.filter(p => p.isPublished).length
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      submitted: "bg-amber-50 text-amber-700 border-amber-200",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejected: "bg-rose-50 text-rose-700 border-rose-200"
    };

    const icons = {
      submitted: Clock,
      approved: CheckCircle,
      rejected: XCircle
    };

    const Icon = icons[status] || Clock;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.submitted}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
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
                <button 
                  onClick={() => navigate('/guidelines')}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Guidelines
                </button>
              <button 
                onClick={() => navigate('/submit')}
                className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Submission
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Submissions", value: stats.total, icon: FileText, color: "indigo", bg: "bg-indigo-100", text: "text-indigo-600" },
            { label: "Under Review", value: stats.inReview, icon: Clock, color: "amber", bg: "bg-amber-100", text: "text-amber-600" },
            { label: "Accepted", value: stats.accepted, icon: CheckCircle, color: "emerald", bg: "bg-emerald-100", text: "text-emerald-600" },
            { label: "Published", value: stats.published, icon: Award, color: "blue", bg: "bg-blue-100", text: "text-blue-600" }
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
                <p className="text-sm text-slate-600 mb-4">
                  Submit your original research for double-blind peer review by international experts.
                </p>
                <button 
                  onClick={() => navigate('/submit')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
                >
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
                <p className="text-sm text-slate-600 mb-4">
                  Review formatting requirements, ethical standards, and submission policies.
                </p>
                <button 
                  onClick={() => navigate('/guidelines')}
                  className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
                >
                  View Guidelines
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Publication Process Information</h3>
              <ul className="text-sm text-blue-800 space-y-1.5">
                <li>• <strong>Double-blind peer review:</strong> Your identity and reviewers' identities remain confidential</li>
                <li>• <strong>Average review time:</strong> 2–4 weeks from submission to initial decision</li>
                <li>• <strong>Open access publishing:</strong> All accepted articles are freely accessible worldwide</li>
                <li>• <strong>DOI assignment:</strong> Published articles receive a permanent Digital Object Identifier</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submissions Section */}
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
              <button
                onClick={() => setViewMode(viewMode === "cards" ? "list" : "cards")}
                className="px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
              >
                {viewMode === "cards" ? "List View" : "Card View"}
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No submissions yet</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Start your academic journey with ToESS by submitting your first manuscript for peer review.
                </p>
                <button 
                  onClick={() => navigate('/submit')}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Submit Your First Paper
                </button>
              </div>
            ) : viewMode === "cards" ? (
              <div className="grid md:grid-cols-2 gap-6">
                {submissions.map((paper) => (
                  <div key={paper.id} className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 hover:shadow-lg transition p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 mb-2 leading-tight">
                            {paper.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <StatusBadge status={paper.status} />
                            {paper.isPublished && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                                <Award className="w-3 h-3" />
                                Published
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted: {new Date(paper.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      {paper.category && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-600">Category:</span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                            {paper.category}
                          </span>
                        </div>
                      )}
                      {paper.doi && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-600">DOI:</span>
                          <span className="text-indigo-600 font-mono text-xs">{paper.doi}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => setSelectedPaper(paper)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      {paper.doi && (
                        <button className="flex-1 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((paper) => (
                  <div key={paper.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 mb-1 truncate">{paper.title}</h3>
                        <p className="text-xs text-slate-500">
                          Submitted on {new Date(paper.createdAt.seconds * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={paper.status} />
                      <button
                        onClick={() => setSelectedPaper(paper)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                      >
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

      {/* Modal for viewing paper details */}
      {selectedPaper && !selectedPaper.isNew && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Manuscript Details</h2>
              <button
                onClick={() => setSelectedPaper(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{selectedPaper.title}</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  <StatusBadge status={selectedPaper.status} />
                  {selectedPaper.isPublished && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                      <Award className="w-3.5 h-3.5" />
                      Published
                    </span>
                  )}
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                    {selectedPaper.category}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">Submission Date</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(selectedPaper.createdAt.seconds * 1000).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                {selectedPaper.reviewedDate && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-1">Decision Date</p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(selectedPaper.reviewedDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                )}
              </div>

              {selectedPaper.abstract && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Abstract</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedPaper.abstract}</p>
                </div>
              )}

              {selectedPaper.keywords && selectedPaper.keywords.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPaper.keywords.map((keyword, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPaper.doi && (
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                  <p className="text-xs font-semibold text-indigo-900 mb-1">Digital Object Identifier (DOI)</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-mono text-indigo-700">{selectedPaper.doi}</p>
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
                      View Publication
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Manuscript
                </button>
                {selectedPaper.status === "rejected" && (
                  <button className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Resubmit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Submission Modal */}
      {selectedPaper?.isNew && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Submit New Manuscript</h2>
                <p className="text-sm text-blue-100 mt-1">Follow the steps to submit your research</p>
              </div>
              <button
                onClick={() => setSelectedPaper(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Ready to Submit?</h3>
                <p className="text-slate-600 mb-6">
                  This would redirect to your submission form.<br/>
                  In your actual app, link to: <code className="text-xs bg-slate-100 px-2 py-1 rounded">/submit</code>
                </p>
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                  Go to Submission Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}