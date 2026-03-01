import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getReviewerAssignments, submitReview } from "../../services/reviewerService";
import {
  FileText, Clock, CheckCircle, Star, Send, X,
  ChevronDown, ChevronUp, AlertCircle, Download, User, Tag
} from "lucide-react";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

function StarRating({ value, onChange, label }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button key={star} type="button" onClick={() => onChange(star)}
            className={`w-8 h-8 rounded transition ${star <= value ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400`}>
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
      {value > 0 && <p className="text-xs text-indigo-600 mt-0.5 font-medium">{RATING_LABELS[value]}</p>}
    </div>
  );
}

// ✅ Paper detail panel shown when reviewer expands a paper
function PaperDetails({ paper }) {
  if (!paper) return <p className="text-sm text-gray-500 italic">Paper details not available.</p>;

  return (
    <div className="mt-4 pt-4 border-t space-y-4">
      {/* Author info */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        {(paper.authorName || paper.authorEmail) && (
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{paper.authorName || paper.authorEmail}</span>
          </span>
        )}
        {paper.category && (
          <span className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-gray-400" />
            <span>{paper.category}</span>
          </span>
        )}
      </div>

      {/* Abstract */}
      {paper.abstract ? (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Abstract</p>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">{paper.abstract}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">No abstract available.</p>
      )}

      {/* Keywords */}
      {paper.keywords?.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Keywords</p>
          <div className="flex flex-wrap gap-2">
            {paper.keywords.map((kw, i) => (
              <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {/* Download link — try both fileUrl and fileURL */}
      {(paper.fileUrl || paper.fileURL) && (
        <a
          href={paper.fileUrl || paper.fileURL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
        >
          <Download className="w-4 h-4" /> Download Full Paper
        </a>
      )}
    </div>
  );
}

export default function ReviewerDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [expandedPaper, setExpandedPaper] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    originalityRating: 0, methodologyRating: 0, clarityRating: 0,
    significanceRating: 0, overallRating: 0, strengths: "",
    weaknesses: "", detailedComments: "", confidentialComments: "", recommendation: ""
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) { navigate("/login"); return; }
      setCurrentUser(user);
      loadAssignments(user.email);
    });
    return () => unsubscribe();
  }, []);

  const loadAssignments = async (email) => {
    try {
      const data = await getReviewerAssignments(email);
      console.log("📋 Assignments loaded:", data); // helpful for debugging
      setAssignments(data);
    } catch (err) {
      console.error("Error loading assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => setReviewForm({
    originalityRating: 0, methodologyRating: 0, clarityRating: 0,
    significanceRating: 0, overallRating: 0, strengths: "",
    weaknesses: "", detailedComments: "", confidentialComments: "", recommendation: ""
  });

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const { originalityRating, methodologyRating, clarityRating, significanceRating, overallRating, recommendation } = reviewForm;
    if (!originalityRating || !methodologyRating || !clarityRating || !significanceRating || !overallRating) {
      alert("Please provide all ratings."); return;
    }
    if (!recommendation) { alert("Please select a recommendation."); return; }
    if (!reviewForm.strengths.trim() || !reviewForm.weaknesses.trim() || !reviewForm.detailedComments.trim()) {
      alert("Please fill in strengths, weaknesses, and detailed comments."); return;
    }

    setSubmitting(true);
    try {
      await submitReview(selectedAssignment.id, {
        ...reviewForm,
        paperId: selectedAssignment.paperId,
        reviewerEmail: currentUser.email,
        reviewerName: currentUser.displayName || currentUser.email
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSelectedAssignment(null);
        resetForm();
        loadAssignments(currentUser.email);
      }, 1800);
    } catch (err) {
      console.error(err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isOverdue = (a) => a.deadline?.toDate?.() < new Date();
  const pending = assignments.filter(a => !a.reviewSubmitted);
  const completed = assignments.filter(a => a.reviewSubmitted);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-600" /> Reviewer Dashboard
        </h1>
        <p className="text-gray-600 mt-1">Welcome, {currentUser?.displayName || currentUser?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Pending Reviews", value: pending.length, icon: Clock, color: "text-orange-500" },
          { label: "Completed", value: completed.length, icon: CheckCircle, color: "text-green-500" },
          { label: "Total Assigned", value: assignments.length, icon: FileText, color: "text-indigo-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <Icon className={`w-7 h-7 ${color}`} />
              <div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No papers assigned yet</p>
          <p className="text-sm mt-1">You'll see papers here once the admin assigns them to you.</p>
        </div>
      ) : (
        <div className="space-y-6">

          {/* Pending */}
          {pending.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" /> Pending Reviews
              </h2>
              <div className="space-y-3">
                {pending.map(assignment => {
                  const paper = assignment.paper;
                  const overdue = isOverdue(assignment);
                  const isOpen = expandedPaper === assignment.id;

                  return (
                    <div key={assignment.id} className={`bg-white rounded-xl border-2 shadow-sm transition ${overdue ? "border-red-200" : "border-gray-100"}`}>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {/* ✅ Title from paper object */}
                              <h3 className="font-semibold text-gray-900">
                                {paper?.title || assignment.paperTitle || "Untitled Paper"}
                              </h3>
                              {overdue && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                                  <AlertCircle className="w-3 h-3" /> Overdue
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              Deadline:{" "}
                              <span className={`font-medium ${overdue ? "text-red-600" : "text-gray-700"}`}>
                                {assignment.deadline?.toDate?.().toLocaleDateString() ?? "N/A"}
                              </span>
                              {" · "}Assigned: {assignment.assignedAt?.toDate?.().toLocaleDateString() ?? "N/A"}
                            </p>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => setExpandedPaper(isOpen ? null : assignment.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                            >
                              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              {isOpen ? "Hide" : "View"} Details
                            </button>
                            <button
                              onClick={() => { setSelectedAssignment(assignment); resetForm(); }}
                              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
                            >
                              <Send className="w-4 h-4" /> Submit Review
                            </button>
                          </div>
                        </div>

                        {/* ✅ Expanded paper details */}
                        {isOpen && <PaperDetails paper={paper} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Completed Reviews
              </h2>
              <div className="space-y-3">
                {completed.map(assignment => (
                  <div key={assignment.id} className="bg-white rounded-xl border shadow-sm p-5 opacity-80">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {assignment.paper?.title || assignment.paperTitle || "Untitled Paper"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Submitted: {assignment.completedAt?.toDate?.().toLocaleDateString() ?? "N/A"}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                        <CheckCircle className="w-4 h-4" /> Review Submitted
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit Review Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">Submit Review</h2>
                  <p className="text-blue-100 text-sm mt-1 line-clamp-2">
                    {selectedAssignment.paper?.title || "Untitled Paper"}
                  </p>
                </div>
                <button onClick={() => setSelectedAssignment(null)} className="p-1 hover:bg-white/20 rounded-lg transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Success state */}
            {submitSuccess ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Submitted!</h3>
                <p className="text-gray-500">Your review has been recorded successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Ratings <span className="text-gray-400 font-normal text-sm">(1 = Poor, 5 = Excellent)</span></h3>
                  <div className="grid grid-cols-2 gap-5">
                    <StarRating label="Originality" value={reviewForm.originalityRating} onChange={v => setReviewForm(p => ({ ...p, originalityRating: v }))} />
                    <StarRating label="Methodology" value={reviewForm.methodologyRating} onChange={v => setReviewForm(p => ({ ...p, methodologyRating: v }))} />
                    <StarRating label="Clarity of Writing" value={reviewForm.clarityRating} onChange={v => setReviewForm(p => ({ ...p, clarityRating: v }))} />
                    <StarRating label="Significance" value={reviewForm.significanceRating} onChange={v => setReviewForm(p => ({ ...p, significanceRating: v }))} />
                    <StarRating label="Overall Quality" value={reviewForm.overallRating} onChange={v => setReviewForm(p => ({ ...p, overallRating: v }))} />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Recommendation</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "accept", label: "✓ Accept", cls: "border-green-500 bg-green-50 text-green-700" },
                      { value: "minor-revision", label: "↻ Minor Revision", cls: "border-blue-500 bg-blue-50 text-blue-700" },
                      { value: "major-revision", label: "↻ Major Revision", cls: "border-orange-500 bg-orange-50 text-orange-700" },
                      { value: "reject", label: "✕ Reject", cls: "border-red-500 bg-red-50 text-red-700" },
                    ].map(opt => (
                      <button key={opt.value} type="button"
                        onClick={() => setReviewForm(p => ({ ...p, recommendation: opt.value }))}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition ${
                          reviewForm.recommendation === opt.value ? opt.cls : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: "strengths", label: "Strengths", placeholder: "Describe the key strengths of this paper...", rows: 3 },
                    { key: "weaknesses", label: "Weaknesses", placeholder: "Describe areas that need improvement...", rows: 3 },
                    { key: "detailedComments", label: "Detailed Comments", placeholder: "Provide detailed comments for the authors...", rows: 5 },
                    { key: "confidentialComments", label: "Confidential Comments (editors only — optional)", placeholder: "Comments only the editor will see...", rows: 3, optional: true },
                  ].map(({ key, label, placeholder, rows, optional }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {label} {!optional && <span className="text-red-500">*</span>}
                      </label>
                      <textarea rows={rows} required={!optional}
                        value={reviewForm[key]}
                        onChange={e => setReviewForm(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:outline-none text-sm resize-none"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setSelectedAssignment(null)}
                    className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}