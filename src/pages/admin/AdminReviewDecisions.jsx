import { useState, useEffect } from "react";
import { getPapersWithReviews, makeEditorialDecision } from "../../services/reviewerService";
import { getCurrentUser } from "../../services/authService";
import { updateSubmission } from "../../services/submissionService";
import { sendPaperPublishedEmail, sendEditorialDecisionEmail } from "../../services/emailService";
import {
  FileText, CheckCircle, XCircle, RotateCcw,
  ChevronDown, ChevronUp, Eye, MessageSquare, Award, Download, Share2
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
  const [editorId, setEditorId] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPaper, setExpandedPaper] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [publishingPaper, setPublishingPaper] = useState(null);
  const [decision, setDecision] = useState("");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    getCurrentUser().then(user => setEditorId(user?.id));
    loadPapers();
  }, []);

  const loadPapers = async () => {
    setLoading(true);
    try {
      const data = await getPapersWithReviews();
      setPapers(data || []);
    } catch (err) {
      console.error("Error loading papers:", err);
      setPapers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async () => {
    if (!decision) {
      alert("Please select a decision.");
      return;
    }
    if (!comments.trim()) {
      alert("Please provide editorial comments.");
      return;
    }

    setSubmitting(true);
    try {
      await makeEditorialDecision(selectedPaper.id, editorId, decision, comments);
      
      // Queue decision email with proper data
      try {
        const authorEmail = selectedPaper.users?.email;
        const authorName = `${selectedPaper.users?.given_name || ""} ${selectedPaper.users?.family_name || ""}`.trim();
        
        if (authorEmail) {
          await sendEditorialDecisionEmail({
            paperId: selectedPaper.id,
            authorEmail: authorEmail,
            authorName: authorName || "Author",
            paperTitle: selectedPaper.title,
            decision: decision,
            comments: comments,
          });
        } else {
          console.warn("⚠️ No author email found, skipping notification");
        }
      } catch (emailError) {
        console.warn("⚠️ Email queue failed, but decision was recorded:", emailError.message);
      }
      
      setSuccessMessage(`✅ Decision recorded: ${decision.toUpperCase()}`);
      
      setSelectedPaper(null);
      setDecision("");
      setComments("");
      
      await loadPapers();
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error recording decision:", err);
      alert("Failed to record decision: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async () => {
    setSubmitting(true);
    try {
      const publishData = {
        status: "published",
        updated_at: new Date().toISOString(),
      };

      await updateSubmission(publishingPaper.id, publishData);

      // Queue published email with proper data
      try {
        const authorEmail = publishingPaper.users?.email;
        const authorName = `${publishingPaper.users?.given_name || ""} ${publishingPaper.users?.family_name || ""}`.trim();
        
        if (authorEmail) {
          await sendPaperPublishedEmail({
            paperId: publishingPaper.id,
            authorEmail: authorEmail,
            authorName: authorName || "Author",
            paperTitle: publishingPaper.title,
            doi: "N/A",
          });
        } else {
          console.warn("⚠️ No author email found, skipping notification");
        }
      } catch (emailError) {
        console.warn("⚠️ Email queue failed, but paper was published:", emailError.message);
      }

      setSuccessMessage("✅ Paper published successfully!");
      setPublishingPaper(null);
      
      await loadPapers();
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error publishing paper:", err);
      alert("Failed to publish paper: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = (reviews) => {
    if (!reviews?.length) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.overall_rating || 0), 0);
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
    accept: "bg-green-100 text-green-700",
    "minor-revision": "bg-blue-100 text-blue-700",
    "major-revision": "bg-orange-100 text-orange-700",
    reject: "bg-red-100 text-red-700"
  };

  const filtered = papers.filter(p => {
    if (filter === "decided") return p.editorialDecision && p.status !== "published";
    if (filter === "pending") return !p.editorialDecision;
    if (filter === "published") return p.status === "published";
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-medium">Loading editorial decisions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium animate-pulse">
            {successMessage}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Award className="w-8 h-8 text-indigo-600" />
            Editorial Decisions
          </h1>
          <p className="text-gray-600 mt-1">Review submitted peer reviews and make final editorial decisions.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{papers.length}</div>
            <div className="text-sm text-gray-500">Total with Reviews</div>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-2xl font-bold text-orange-600">
              {papers.filter(p => !p.editorialDecision).length}
            </div>
            <div className="text-sm text-gray-500">Awaiting Decision</div>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {papers.filter(p => p.editorialDecision && p.status !== "published").length}
            </div>
            <div className="text-sm text-gray-500">Decided (Not Published)</div>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-2xl font-bold text-indigo-600">
              {papers.filter(p => p.status === "published").length}
            </div>
            <div className="text-sm text-gray-500">Published</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {["all", "pending", "decided", "published"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f ? "bg-indigo-600 text-white" : "bg-white border text-gray-600 hover:border-indigo-300"
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)} ({filtered.filter(p => {
                if (f === "all") return true;
                if (f === "pending") return !p.editorialDecision;
                if (f === "decided") return p.editorialDecision && p.status !== "published";
                if (f === "published") return p.status === "published";
                return false;
              }).length})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">
              {filter === "pending" ? "All papers have decisions!" : "No papers found."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(paper => {
              const summary = recommendationSummary(paper.reviews);
              const avg = avgRating(paper.reviews);
              const isExpanded = expandedPaper === paper.id;

              return (
                <div key={paper.id} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-lg">{paper.title}</h3>

                          {paper.file_url && (
                            <a
                              href={paper.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full transition"
                            >
                              <Download className="w-3 h-3" /> PDF
                            </a>
                          )}

                          {paper.status === "published" && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 flex items-center gap-1">
                              <Share2 className="w-3 h-3" /> Published
                            </span>
                          )}
                          {paper.editorialDecision && paper.status !== "published" && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${decisionColors[paper.editorialDecision] || "bg-gray-100 text-gray-700"}`}>
                              ✓ {paper.editorialDecision.replace("-", " ").toUpperCase()}
                            </span>
                          )}
                          {!paper.editorialDecision && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                              AWAITING DECISION
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          <span className="font-medium">{paper.authorName}</span> · {paper.reviews?.length} review(s) · Avg rating: <strong>{avg}/5</strong>
                        </p>

                        <div className="flex flex-wrap gap-2 mb-2">
                          {Object.entries(summary).map(([rec, count]) => (
                            <span key={rec} className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                              rec === "accept" ? "bg-green-100 text-green-700" :
                              rec === "minor-revision" ? "bg-blue-100 text-blue-700" :
                              rec === "major-revision" ? "bg-orange-100 text-orange-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {count}× {rec.replace("-", " ")}
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
                        {paper.editorialDecision === "accept" && paper.status !== "published" && (
                          <button
                            onClick={() => setPublishingPaper(paper)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
                          >
                            <Share2 className="w-4 h-4" /> Publish
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Reviews */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t space-y-4">

                        {paper.file_url && (
                          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                            <span className="text-sm text-indigo-700 font-medium">Manuscript PDF</span>
                            <a
                              href={paper.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition"
                            >
                              <Download className="w-3.5 h-3.5" /> Download Full Paper
                            </a>
                          </div>
                        )}

                        {paper.reviews?.map((review, i) => (
                          <div key={review.id} className="bg-gray-50 rounded-xl p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <p className="font-semibold text-gray-900">Review #{i + 1}</p>
                                <p className="text-xs text-gray-500">
                                  by {review.users?.given_name} {review.users?.family_name} ·{" "}
                                  {review.submitted_at ? new Date(review.submitted_at).toLocaleDateString() : "N/A"}
                                </p>
                              </div>
                              <span className={`px-2.5 py-1 text-xs rounded-full font-semibold ${
                                review.recommendation === "accept" ? "bg-green-100 text-green-700" :
                                review.recommendation === "minor-revision" ? "bg-blue-100 text-blue-700" :
                                review.recommendation === "major-revision" ? "bg-orange-100 text-orange-700" :
                                "bg-red-100 text-red-700"
                              }`}>
                                {review.recommendation?.toUpperCase().replace("-", " ")}
                              </span>
                            </div>

                            <div className="space-y-1.5 mb-4">
                              <RatingBar label="Originality" value={review.originality_rating || 0} />
                              <RatingBar label="Methodology" value={review.methodology_rating || 0} />
                              <RatingBar label="Clarity" value={review.clarity_rating || 0} />
                              <RatingBar label="Overall" value={review.overall_rating || 0} />
                            </div>

                            <div className="space-y-3 text-sm">
                              {[
                                { label: "Strengths", value: review.strengths },
                                { label: "Weaknesses", value: review.weaknesses },
                                { label: "Detailed Comments", value: review.detailed_comments },
                              ].map(({ label, value }) => value && (
                                <div key={label}>
                                  <p className="font-medium text-gray-700 mb-1">{label}</p>
                                  <p className="text-gray-600">{value}</p>
                                </div>
                              ))}
                              {review.confidential_comments && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                  <p className="font-medium text-yellow-800 mb-1">Confidential (Editors Only)</p>
                                  <p className="text-yellow-900">{review.confidential_comments}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {paper.editorialDecision && paper.editorialComments && (
                      <div className="mt-4 pt-4 border-t bg-blue-50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-blue-900 mb-2">✓ Editorial Decision Recorded</p>
                        <p className="text-sm text-blue-800 whitespace-pre-wrap">{paper.editorialComments}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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

              {selectedPaper.file_url && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-indigo-700 font-medium">View manuscript</span>
                  <a href={selectedPaper.file_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition">
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </a>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Decision</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "accept", label: "Accept", icon: CheckCircle, activeClass: "border-green-500 bg-green-50 text-green-700" },
                    { value: "minor-revision", label: "Minor Revision", icon: RotateCcw, activeClass: "border-blue-500 bg-blue-50 text-blue-700" },
                    { value: "major-revision", label: "Major Revision", icon: RotateCcw, activeClass: "border-orange-500 bg-orange-50 text-orange-700" },
                    { value: "reject", label: "Reject", icon: XCircle, activeClass: "border-red-500 bg-red-50 text-red-700" }
                  ].map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => setDecision(opt.value)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition ${
                        decision === opt.value
                          ? opt.activeClass
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

      {/* Publish Modal */}
      {publishingPaper && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">Publish Paper</h2>
                  <p className="text-green-100 text-sm mt-1 line-clamp-2">{publishingPaper.title}</p>
                </div>
                <button onClick={() => setPublishingPaper(null)} className="p-1 hover:bg-white/20 rounded-lg transition">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">

              {publishingPaper.file_url && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-green-700 font-medium">View manuscript</span>
                  <a href={publishingPaper.file_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition">
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </a>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>✓ Ready to publish!</strong> This paper will be made available in the Archives section for all users.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-900">
                  <strong>✉️ Author notification:</strong> An email notification will be queued and sent to the author.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setPublishingPaper(null)}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition">
                  Cancel
                </button>
                <button onClick={handlePublish} disabled={submitting}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition">
                  {submitting ? "Publishing..." : "Confirm & Publish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}