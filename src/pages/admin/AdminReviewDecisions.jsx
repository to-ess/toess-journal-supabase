import { useState, useEffect } from "react";
import { getPapersWithReviews, makeEditorialDecision } from "../../services/reviewerService";
import {
  FileText, CheckCircle, XCircle, RotateCcw, Star,
  ChevronDown, ChevronUp, Eye, MessageSquare, Award
} from "lucide-react";

function RatingBar({ label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-indigo-600 w-8">{value}/5</span>
    </div>
  );
}

export default function AdminReviewDecisions() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPaper, setExpandedPaper] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [decision, setDecision] = useState("");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      const data = await getPapersWithReviews();
      setPapers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async () => {
    if (!decision) { alert("Please select a decision."); return; }
    if (!comments.trim()) { alert("Please provide editorial comments."); return; }
    setSubmitting(true);
    try {
      await makeEditorialDecision(selectedPaper.id, decision, comments);
      alert("Decision recorded successfully!");
      setSelectedPaper(null);
      setDecision("");
      setComments("");
      loadPapers();
    } catch (err) {
      alert("Failed to record decision.");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = (reviews) => {
    if (!reviews?.length) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.overallRating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  const recommendationSummary = (reviews) => {
    const counts = {};
    reviews?.forEach(r => {
      counts[r.recommendation] = (counts[r.recommendation] || 0) + 1;
    });
    return counts;
  };

  const decisionColors = {
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    "revision-required": "bg-orange-100 text-orange-700"
  };

  const filtered = papers.filter(p => {
    if (filter === "decided") return !!p.editorialDecision;
    if (filter === "pending") return !p.editorialDecision;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Award className="w-8 h-8 text-indigo-600" />
          Editorial Decisions
        </h1>
        <p className="text-gray-600 mt-1">Review submitted peer reviews and make final editorial decisions.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{papers.length}</div>
          <div className="text-sm text-gray-500">Total Papers with Reviews</div>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="text-2xl font-bold text-orange-600">{papers.filter(p => !p.editorialDecision).length}</div>
          <div className="text-sm text-gray-500">Awaiting Decision</div>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="text-2xl font-bold text-green-600">{papers.filter(p => !!p.editorialDecision).length}</div>
          <div className="text-sm text-gray-500">Decided</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {["all", "pending", "decided"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f ? "bg-indigo-600 text-white" : "bg-white border text-gray-600 hover:border-indigo-300"
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No papers with reviews found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(paper => {
            const summary = recommendationSummary(paper.reviews);
            const avg = avgRating(paper.reviews);
            const isExpanded = expandedPaper === paper.id;

            return (
              <div key={paper.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 text-lg">{paper.title}</h3>
                        {paper.editorialDecision ? (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${decisionColors[paper.status] || "bg-gray-100 text-gray-700"}`}>
                            {paper.editorialDecision.replace("-", " ").toUpperCase()}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                            AWAITING DECISION
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 mb-3">
                        {paper.authorName} · {paper.reviews?.length} review(s) · Avg rating: <strong>{avg}/5</strong>
                      </p>

                      {/* Recommendation breakdown */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {Object.entries(summary).map(([rec, count]) => (
                          <span key={rec} className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                            rec === "accept" ? "bg-green-100 text-green-700" :
                            rec === "minor-revision" ? "bg-blue-100 text-blue-700" :
                            rec === "major-revision" ? "bg-orange-100 text-orange-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {count}x {rec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setExpandedPaper(isExpanded ? null : paper.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                      >
                        <Eye className="w-4 h-4" />
                        {isExpanded ? "Hide" : "View"} Reviews
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                      {!paper.editorialDecision && (
                        <button
                          onClick={() => { setSelectedPaper(paper); setDecision(""); setComments(""); }}
                          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
                        >
                          <MessageSquare className="w-4 h-4" /> Make Decision
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Reviews */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {paper.reviews?.map((review, i) => (
                        <div key={review.id} className="bg-gray-50 rounded-xl p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="font-semibold text-gray-900">Review #{i + 1}</p>
                              <p className="text-xs text-gray-500">
                                by {review.reviewerName} · {review.submittedAt?.toDate?.().toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-2.5 py-1 text-xs rounded-full font-semibold ${
                              review.recommendation === "accept" ? "bg-green-100 text-green-700" :
                              review.recommendation === "minor-revision" ? "bg-blue-100 text-blue-700" :
                              review.recommendation === "major-revision" ? "bg-orange-100 text-orange-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {review.recommendation?.toUpperCase()}
                            </span>
                          </div>

                          <div className="space-y-1.5 mb-4">
                            <RatingBar label="Originality" value={review.originalityRating} />
                            <RatingBar label="Methodology" value={review.methodologyRating} />
                            <RatingBar label="Clarity" value={review.clarityRating} />
                            <RatingBar label="Significance" value={review.significanceRating} />
                            <RatingBar label="Overall" value={review.overallRating} />
                          </div>

                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="font-medium text-gray-700 mb-1">Strengths</p>
                              <p className="text-gray-600">{review.strengths}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 mb-1">Weaknesses</p>
                              <p className="text-gray-600">{review.weaknesses}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 mb-1">Detailed Comments</p>
                              <p className="text-gray-600">{review.detailedComments}</p>
                            </div>
                            {review.confidentialComments && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="font-medium text-yellow-800 mb-1">Confidential (Editors Only)</p>
                                <p className="text-yellow-900">{review.confidentialComments}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Existing decision */}
                  {paper.editorialDecision && paper.editorialComments && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Editorial Comments:</p>
                      <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">{paper.editorialComments}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Decision Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">Make Editorial Decision</h2>
                  <p className="text-blue-100 text-sm mt-1 line-clamp-2">{selectedPaper.title}</p>
                </div>
                <button onClick={() => setSelectedPaper(null)} className="p-1 hover:bg-white/20 rounded-lg transition">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Decision</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "accept", label: "Accept", icon: CheckCircle, color: "green" },
                    { value: "minor-revision", label: "Minor Revision", icon: RotateCcw, color: "blue" },
                    { value: "major-revision", label: "Major Revision", icon: RotateCcw, color: "orange" },
                    { value: "reject", label: "Reject", icon: XCircle, color: "red" }
                  ].map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => setDecision(opt.value)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition ${
                        decision === opt.value
                          ? `border-${opt.color}-500 bg-${opt.color}-50 text-${opt.color}-700`
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}>
                      <opt.icon className="w-4 h-4" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Editorial Comments (will be sent to author)
                </label>
                <textarea
                  rows={5}
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:outline-none text-sm"
                  placeholder="Summarize the decision and provide guidance to the author..."
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setSelectedPaper(null)}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition">
                  Cancel
                </button>
                <button onClick={handleDecision} disabled={submitting}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition">
                  {submitting ? "Saving..." : "Confirm Decision"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}