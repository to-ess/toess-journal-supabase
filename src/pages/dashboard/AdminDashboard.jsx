import { useEffect, useState } from "react";
import { FileText, Clock, CheckCircle, XCircle, Eye, Download, Send } from "lucide-react";
import { auth } from "../../services/firebase";
import { getAllSubmissions, updateSubmission } from "../../services/submissionService";

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.log("❌ User not authenticated");
        setLoading(false);
        return;
      }

      console.log("✅ Admin logged in:", user.email);

      try {
        console.log("📡 Fetching all submissions...");
        const data = await getAllSubmissions();
        console.log("📦 Fetched submissions:", data.length, "papers");
        console.log("Data:", data);
        setSubmissions(data);
      } catch (error) {
        console.error("❌ Error fetching submissions:", error);
        alert("Error loading submissions. Check console for details.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (paper, status) => {
    try {
      await updateSubmission(paper.id, { 
        status,
        reviewedDate: new Date().toISOString()
      });
      
      // Update local state
      setSubmissions(prev => 
        prev.map(p => p.id === paper.id ? { 
          ...p, 
          status, 
          reviewedDate: new Date().toISOString() 
        } : p)
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update submission status");
    }
  };

  const publishPaper = async (paper) => {
    try {
      const publishData = {
        status: "approved",
        isPublished: true,
        publishedDate: new Date().toISOString(),
        volume: 1,
        issue: 1,
        doi: `10.1234/toess.v1i1.${paper.id.slice(0, 4)}`
      };

      await updateSubmission(paper.id, publishData);
      
      // Update local state
      setSubmissions(prev =>
        prev.map(p => p.id === paper.id ? { ...p, ...publishData } : p)
      );
    } catch (error) {
      console.error("Error publishing paper:", error);
      alert("Failed to publish paper");
    }
  };

  const filtered = submissions.filter((p) =>
    filter === "all" ? true : p.status === filter
  );

  const stats = {
    total: submissions.length,
    submitted: submissions.filter(p => p.status === "submitted").length,
    approved: submissions.filter(p => p.status === "approved").length,
    rejected: submissions.filter(p => p.status === "rejected").length,
    published: submissions.filter(p => p.isPublished).length
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      submitted: "bg-amber-50 text-amber-700 border-amber-200",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejected: "bg-rose-50 text-rose-700 border-rose-200",
      published: "bg-blue-50 text-blue-700 border-blue-200"
    };

    const icons = {
      submitted: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      published: FileText
    };

    const Icon = icons[status] || FileText;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.submitted}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Editorial Management System</h1>
              <p className="text-slate-600 text-sm mt-1">Transactions on Evolutionary Smart Systems</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition">
                Export Reports
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition">
                System Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Submissions", value: stats.total, icon: FileText, color: "indigo" },
            { label: "Pending Review", value: stats.submitted, icon: Clock, color: "amber" },
            { label: "Approved", value: stats.approved, icon: CheckCircle, color: "emerald" },
            { label: "Rejected", value: stats.rejected, icon: XCircle, color: "rose" },
            { label: "Published", value: stats.published, icon: FileText, color: "blue" }
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

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {["all", "submitted", "approved", "rejected"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    filter === f
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f !== "all" && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      filter === f ? "bg-indigo-500" : "bg-slate-200 text-slate-600"
                    }`}>
                      {submissions.filter(p => p.status === f).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg ${viewMode === "table" ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:bg-slate-100"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded-lg ${viewMode === "cards" ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:bg-slate-100"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Submissions Display */}
        {viewMode === "table" ? (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Manuscript Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-1">
                              {p.title}
                            </h3>
                            {p.fileUrl && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(p.fileUrl, '_blank');
                                }}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 mb-1"
                              >
                                <Download className="w-3 h-3" />
                                View File
                              </button>
                            )}
                            <p className="text-xs text-slate-500">
                              Submitted: {p.createdAt?.seconds 
                                ? new Date(p.createdAt.seconds * 1000).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })
                                : 'N/A'
                              }
                            </p>
                            {p.doi && (
                              <p className="text-xs text-indigo-600 font-mono mt-1">DOI: {p.doi}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{p.authorName || 'N/A'}</p>
                          <p className="text-xs text-slate-500">{p.authorEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                          {p.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedPaper(p)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {p.status === "submitted" && (
                            <>
                              <button
                                onClick={() => updateStatus(p, "approved")}
                                className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateStatus(p, "rejected")}
                                className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {p.status === "approved" && !p.isPublished && (
                            <button
                              onClick={() => publishPaper(p)}
                              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition"
                            >
                              Publish
                            </button>
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
            {filtered.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-2 leading-tight">
                        {p.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <StatusBadge status={p.status} />
                        <span className="text-xs text-slate-500">
                          {p.createdAt?.seconds 
                            ? new Date(p.createdAt.seconds * 1000).toLocaleDateString()
                            : 'N/A'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-medium">Author:</span>
                    <span className="text-slate-900">{p.authorName || p.authorEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-medium">Category:</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                      {p.category || 'Uncategorized'}
                    </span>
                  </div>
                  {p.fileUrl && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 font-medium">File:</span>
                      <button
                        onClick={() => window.open(p.fileUrl, '_blank')}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download PDF
                      </button>
                    </div>
                  )}
                  {p.doi && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 font-medium">DOI:</span>
                      <span className="text-indigo-600 font-mono text-xs">{p.doi}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setSelectedPaper(p)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                  >
                    View Details
                  </button>
                  {p.status === "submitted" && (
                    <>
                      <button
                        onClick={() => updateStatus(p, "approved")}
                        className="flex-1 px-4 py-2 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(p, "rejected")}
                        className="flex-1 px-4 py-2 text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-lg transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {p.status === "approved" && !p.isPublished && (
                    <button
                      onClick={() => publishPaper(p)}
                      className="flex-1 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition"
                    >
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
            <p className="text-slate-600">There are no submissions matching the selected filter.</p>
          </div>
        )}
      </div>

      {/* Modal for viewing paper details */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Manuscript Details</h2>
              <button
                onClick={() => setSelectedPaper(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{selectedPaper.title}</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  <StatusBadge status={selectedPaper.status} />
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                    {selectedPaper.category || 'Uncategorized'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">Author</p>
                  <p className="text-sm font-medium text-slate-900">{selectedPaper.authorName || 'N/A'}</p>
                  <p className="text-xs text-slate-600">{selectedPaper.authorEmail}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">Submitted</p>
                  <p className="text-sm font-medium text-slate-900">
                    {selectedPaper.createdAt?.seconds 
                      ? new Date(selectedPaper.createdAt.seconds * 1000).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })
                      : 'N/A'
                    }
                  </p>
                </div>
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

              {selectedPaper.fileUrl && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Attached File</h4>
                  <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Manuscript PDF</p>
                        <p className="text-xs text-slate-500">Click to view or download</p>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(selectedPaper.fileUrl, '_blank')}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Open File
                    </button>
                  </div>
                </div>
              )}

              {selectedPaper.doi && (
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-xs font-semibold text-indigo-900 mb-1">Digital Object Identifier</p>
                  <p className="text-sm font-mono text-indigo-700">{selectedPaper.doi}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                {selectedPaper.fileUrl ? (
                  <button 
                    onClick={() => window.open(selectedPaper.fileUrl, '_blank')}
                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                ) : (
                  <button 
                    disabled
                    className="flex-1 px-4 py-2.5 bg-slate-50 text-slate-400 font-semibold rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    No File Attached
                  </button>
                )}
                <button className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Contact Author
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}