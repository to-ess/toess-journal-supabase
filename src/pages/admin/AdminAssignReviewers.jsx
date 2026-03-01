import { useState, useEffect } from "react";
import {
  assignPaperToReviewer,
  getRegisteredReviewers,
  getAllAssignments,
  getReviewsForPaper
} from "../../services/reviewerService";
import { getAllSubmissions } from "../../services/submissionService";
import {
  UserPlus, Mail, Calendar, FileText, CheckCircle,
  Clock, Eye, Users, X, AlertCircle
} from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl text-white shadow-2xl animate-slide-up ${
      type === "success" ? "bg-emerald-600" : "bg-rose-600"
    }`}>
      {type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const STATUS_COLORS = {
  submitted: "bg-amber-100 text-amber-700",
  "under-review": "bg-blue-100 text-blue-700",
};

export default function AdminAssignReviewers() {
  const [papers, setPapers] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [deadline, setDeadline] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedPaperReviews, setSelectedPaperReviews] = useState([]);
  const [selectedPaperTitle, setSelectedPaperTitle] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [toast, setToast] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [allPapers, reviewersData, assignmentsData] = await Promise.all([
        getAllSubmissions(),
        getRegisteredReviewers(),
        getAllAssignments()
      ]);

      // ✅ KEY FIX: show both "submitted" AND "under-review" papers
      const relevantPapers = allPapers.filter(p =>
        ["submitted", "under-review"].includes(p.status)
      );

      setPapers(relevantPapers);
      setReviewers(reviewersData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedPaper || !selectedReviewer || !deadline) {
      showToast("Please fill all fields", "error");
      return;
    }
    setAssigning(true);
    try {
      const reviewer = reviewers.find(r => r.email === selectedReviewer);
      await assignPaperToReviewer(
        selectedPaper.id,
        reviewer.email,
        reviewer.fullName || reviewer.displayName || reviewer.email,
        deadline
      );
      showToast(`"${reviewer.fullName || reviewer.email}" assigned successfully!`);
      setShowAssignModal(false);
      setSelectedPaper(null);
      setSelectedReviewer("");
      setDeadline("");
      loadData();
    } catch (error) {
      console.error("Error assigning paper:", error);
      showToast("Failed to assign reviewer. Please try again.", "error");
    } finally {
      setAssigning(false);
    }
  };

  const viewReviews = async (paper) => {
    try {
      const reviews = await getReviewsForPaper(paper.id);
      setSelectedPaperReviews(reviews);
      setSelectedPaperTitle(paper.title);
      setShowReviewsModal(true);
    } catch (error) {
      showToast("Failed to load reviews", "error");
    }
  };

  const getAssignmentsForPaper = (paperId) =>
    assignments.filter(a => a.paperId === paperId);

  const filteredPapers = papers.filter(p =>
    filterStatus === "all" ? true : p.status === filterStatus
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-600" />
          Assign Reviewers
        </h1>
        <p className="text-gray-600 mt-2">Assign papers to registered reviewers for peer review</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: FileText, color: "blue", value: papers.length, label: "Total Papers" },
          { icon: Clock, color: "amber", value: papers.filter(p => p.status === "submitted").length, label: "Awaiting Assignment" },
          { icon: Eye, color: "indigo", value: papers.filter(p => p.status === "under-review").length, label: "Under Review" },
          { icon: CheckCircle, color: "green", value: assignments.filter(a => a.reviewSubmitted).length, label: "Completed Reviews" },
        ].map(({ icon: Icon, color, value, label }) => (
          <div key={label} className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <Icon className={`w-8 h-8 text-${color}-600`} />
              <div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: "all", label: "All", count: papers.length },
          { key: "submitted", label: "Awaiting Assignment", count: papers.filter(p => p.status === "submitted").length },
          { key: "under-review", label: "Under Review", count: papers.filter(p => p.status === "under-review").length },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setFilterStatus(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterStatus === key ? "bg-indigo-600 text-white" : "bg-white border text-gray-600 hover:border-indigo-300"
            }`}>
            {label} <span className="ml-1 opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {/* Papers List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Papers</h2>
        </div>
        <div className="divide-y">
          {filteredPapers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No papers found</p>
            </div>
          ) : (
            filteredPapers.map(paper => {
              const paperAssignments = getAssignmentsForPaper(paper.id);
              const completedReviews = paperAssignments.filter(a => a.reviewSubmitted).length;

              return (
                <div key={paper.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">{paper.title}</h3>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[paper.status] || "bg-gray-100 text-gray-600"}`}>
                          {paper.status === "under-review" ? "Under Review" : "Submitted"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" />{paper.authorName}</span>
                        <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{paper.authorEmail}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {paper.createdAt instanceof Date
                            ? paper.createdAt.toLocaleDateString()
                            : paper.createdAt?.seconds
                              ? new Date(paper.createdAt.seconds * 1000).toLocaleDateString()
                              : "N/A"}
                        </span>
                      </div>

                      {paperAssignments.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Reviewers ({completedReviews}/{paperAssignments.length} submitted):
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {paperAssignments.map(a => (
                              <span key={a.id} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                a.reviewSubmitted ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                              }`}>
                                {a.reviewSubmitted ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                {a.reviewerName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => { setSelectedPaper(paper); setShowAssignModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                      >
                        <UserPlus className="w-4 h-4" /> Assign Reviewer
                      </button>

                      {/* ✅ View Reviews button — visible for all under-review papers */}
                      {paper.status === "under-review" && (
                        <button
                          onClick={() => viewReviews(paper)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium ${
                            completedReviews > 0
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                          {completedReviews > 0 ? `View Reviews (${completedReviews})` : "Reviews Pending"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Assign Reviewer</h2>
                  <p className="text-blue-100 text-sm line-clamp-2">{selectedPaper?.title}</p>
                </div>
                <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-white/20 rounded-lg transition">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Reviewer</label>
                {reviewers.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                    No approved reviewers yet. Approve reviewer applications first.
                  </div>
                ) : (
                  <select value={selectedReviewer} onChange={e => setSelectedReviewer(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:outline-none">
                    <option value="">Choose a reviewer...</option>
                    {reviewers.map(r => (
                      <option key={r.id} value={r.email}>
                        {r.fullName || r.email} — {Array.isArray(r.expertise) ? r.expertise.slice(0, 2).join(", ") : r.expertise || "General"}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Review Deadline</label>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition font-medium">
                  Cancel
                </button>
                <button onClick={handleAssign} disabled={assigning || reviewers.length === 0}
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium disabled:opacity-60 flex items-center justify-center gap-2">
                  {assigning ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Assigning...</> : "Assign Reviewer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {showReviewsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-2xl sticky top-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Submitted Reviews</h2>
                  <p className="text-green-100 text-sm line-clamp-1">{selectedPaperTitle}</p>
                  <p className="text-green-200 text-xs mt-1">{selectedPaperReviews.length} review(s) received</p>
                </div>
                <button onClick={() => setShowReviewsModal(false)} className="p-2 hover:bg-white/20 rounded-lg transition">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {selectedPaperReviews.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 font-medium">No reviews submitted yet</p>
                  <p className="text-gray-400 text-sm mt-1">Reviewers haven't submitted their reviews yet</p>
                </div>
              ) : (
                selectedPaperReviews.map((review, index) => (
                  <div key={review.id} className="border rounded-xl p-6 bg-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">Review #{index + 1}</h3>
                        <p className="text-sm text-gray-600">by {review.reviewerName} • {review.submittedAt?.toDate?.().toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        review.recommendation === "accept" ? "bg-green-100 text-green-700" :
                        review.recommendation === "minor-revision" ? "bg-blue-100 text-blue-700" :
                        review.recommendation === "major-revision" ? "bg-orange-100 text-orange-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {review.recommendation?.replace("-", " ").toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {[
                        { label: "Originality", value: review.originalityRating },
                        { label: "Methodology", value: review.methodologyRating },
                        { label: "Clarity", value: review.clarityRating },
                        { label: "Significance", value: review.significanceRating },
                        { label: "Overall", value: review.overallRating },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-white rounded-lg p-3 text-center border">
                          <p className="text-xs text-gray-500 mb-1">{label}</p>
                          <p className="font-bold text-indigo-600 text-lg">{value}</p>
                          <p className="text-xs text-gray-400">/5</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Strengths", value: review.strengths },
                        { label: "Weaknesses", value: review.weaknesses },
                        { label: "Detailed Comments", value: review.detailedComments },
                      ].map(({ label, value }) => value && (
                        <div key={label}>
                          <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
                          <p className="text-sm text-gray-600 bg-white rounded-lg p-3 border">{value}</p>
                        </div>
                      ))}
                      {review.confidentialComments && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm font-semibold text-yellow-800 mb-1">Confidential (Editors Only)</p>
                          <p className="text-sm text-yellow-900">{review.confidentialComments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
}