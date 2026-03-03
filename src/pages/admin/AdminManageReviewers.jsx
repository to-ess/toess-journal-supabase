import { useState, useEffect } from "react";
import {
  getAllReviewerRequests,
  approveReviewer,
  rejectReviewer
} from "../../services/reviewerService";
import {
  Users, CheckCircle, XCircle, Clock, Eye,
  Briefcase, Mail, ExternalLink, Search
} from "lucide-react";

export default function AdminManageReviewers() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    try {
      const data = await getAllReviewerRequests();
      data.sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (req) => {
    setActionLoading(true);
    try {
      // ✅ pass both requestId (req.id) and userId (req.user_id)
      await approveReviewer(req.id, req.user_id);
      await loadRequests();
      setSelectedRequest(null);
    } catch (err) {
      console.error(err);
      alert("Failed to approve reviewer.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) { alert("Please provide a rejection reason."); return; }
    setActionLoading(true);
    try {
      // ✅ pass requestId (selectedRequest.id)
      await rejectReviewer(selectedRequest.id, rejectReason);
      await loadRequests();
      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectReason("");
    } catch (err) {
      console.error(err);
      alert("Failed to reject reviewer.");
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = requests.filter(r => {
    const matchesFilter = filter === "all" || r.status === filter;
    // ✅ use snake_case fields from Supabase
    const name = `${r.users?.given_name || ""} ${r.users?.family_name || ""}`.toLowerCase();
    const matchesSearch = !search ||
      name.includes(search.toLowerCase()) ||
      r.users?.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.institution?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  const statusBadge = (status) => {
    const styles = { pending: "bg-yellow-100 text-yellow-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };
    const icons = { pending: <Clock className="w-3 h-3" />, approved: <CheckCircle className="w-3 h-3" />, rejected: <XCircle className="w-3 h-3" /> };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-600" /> Manage Reviewer Applications
        </h1>
        <p className="text-gray-600 mt-1">Review applications and approve or reject reviewer requests.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",    value: counts.all,      color: "blue",   icon: Users },
          { label: "Pending",  value: counts.pending,  color: "yellow", icon: Clock },
          { label: "Approved", value: counts.approved, color: "green",  icon: CheckCircle },
          { label: "Rejected", value: counts.rejected, color: "red",    icon: XCircle },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <Icon className={`w-7 h-7 text-${color}-600`} />
              <div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f ? "bg-indigo-600 text-white" : "bg-white border text-gray-600 hover:border-indigo-300"
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f] ?? requests.length})
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by name, email, institution..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-sm" />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No reviewer applications found.</p>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map(req => {
              // ✅ derive display name from joined users table
              const name = `${req.users?.given_name || ""} ${req.users?.family_name || ""}`.trim() || req.users?.email || "Unknown";
              return (
                <div key={req.id} className="p-5 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{name}</h3>
                        {statusBadge(req.status)}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {req.users?.email}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {req.designation} — {req.institution}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setSelectedRequest(req)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition">
                        <Eye className="w-4 h-4" /> View
                      </button>
                      {req.status === "pending" && (
                        <>
                          <button onClick={() => handleApprove(req)} disabled={actionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50">
                            <CheckCircle className="w-4 h-4" /> Approve
                          </button>
                          <button onClick={() => { setSelectedRequest(req); setShowRejectModal(true); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition">
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedRequest && !showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">
                    {`${selectedRequest.users?.given_name || ""} ${selectedRequest.users?.family_name || ""}`.trim() || "Applicant"}
                  </h2>
                  <p className="text-blue-100 text-sm">{selectedRequest.designation} — {selectedRequest.institution}</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-1 hover:bg-white/20 rounded-lg transition text-xl font-bold">✕</button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-500">Email</p><p className="font-medium">{selectedRequest.users?.email}</p></div>
                <div><p className="text-gray-500">Status</p>{statusBadge(selectedRequest.status)}</div>
                <div>
                  <p className="text-gray-500">Submitted</p>
                  <p className="font-medium">{selectedRequest.created_at ? new Date(selectedRequest.created_at).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Qualifications</p>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{selectedRequest.qualifications}</p>
              </div>

              {selectedRequest.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleApprove(selectedRequest)} disabled={actionLoading}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50">
                    ✓ Approve Reviewer
                  </button>
                  <button onClick={() => setShowRejectModal(true)}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition">
                    ✕ Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-2">Reject Application</h2>
            <p className="text-gray-600 text-sm mb-4">
              Rejecting <strong>{`${selectedRequest.users?.given_name || ""} ${selectedRequest.users?.family_name || ""}`.trim()}</strong>. Please provide a reason:
            </p>
            <textarea rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-red-400 focus:outline-none text-sm"
              placeholder="e.g. Insufficient qualifications, expertise not aligned with journal scope..." />
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setShowRejectModal(false); setRejectReason(""); }}
                className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition">
                Cancel
              </button>
              <button onClick={handleReject} disabled={actionLoading}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}