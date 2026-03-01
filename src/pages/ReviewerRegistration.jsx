import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { registerAsReviewer, getReviewerRequestStatus } from "../services/reviewerService";
import { User, BookOpen, Award, Briefcase, Link, CheckCircle, Clock, XCircle } from "lucide-react";

const EXPERTISE_OPTIONS = [
  "Computer Science", "Artificial Intelligence", "Machine Learning",
  "Data Science", "Environmental Science", "Biology", "Chemistry",
  "Physics", "Mathematics", "Engineering", "Medicine", "Social Sciences",
  "Economics", "Psychology", "Education", "Law", "Literature", "History"
];

export default function ReviewerRegistration() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [existingRequest, setExistingRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    institution: "",
    designation: "",
    expertise: [],
    qualifications: "",
    experience: "",
    linkedIn: "",
    orcid: ""
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      setCurrentUser(user);
      setForm(prev => ({
        ...prev,
        fullName: user.displayName || "",
        email: user.email || ""
      }));
      try {
        const request = await getReviewerRequestStatus(user.uid);
        setExistingRequest(request);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleExpertiseToggle = (topic) => {
    setForm(prev => ({
      ...prev,
      expertise: prev.expertise.includes(topic)
        ? prev.expertise.filter(e => e !== topic)
        : [...prev.expertise, topic]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.expertise.length === 0) {
      alert("Please select at least one area of expertise.");
      return;
    }
    setSubmitting(true);
    try {
      await registerAsReviewer(currentUser.uid, form);
      const request = await getReviewerRequestStatus(currentUser.uid);
      setExistingRequest(request);
    } catch (err) {
      console.error(err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  // Already submitted — show status
  if (existingRequest) return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
        existingRequest.status === "approved" ? "bg-green-100" :
        existingRequest.status === "rejected" ? "bg-red-100" : "bg-yellow-100"
      }`}>
        {existingRequest.status === "approved" ? <CheckCircle className="w-10 h-10 text-green-600" /> :
         existingRequest.status === "rejected" ? <XCircle className="w-10 h-10 text-red-600" /> :
         <Clock className="w-10 h-10 text-yellow-600" />}
      </div>
      <h1 className="text-2xl font-bold mb-2">
        {existingRequest.status === "approved" ? "You're an Approved Reviewer!" :
         existingRequest.status === "rejected" ? "Application Not Approved" :
         "Application Under Review"}
      </h1>
      <p className="text-gray-600 mb-6">
        {existingRequest.status === "approved"
          ? "You can now access your reviewer dashboard to see assigned papers."
          : existingRequest.status === "rejected"
          ? `Reason: ${existingRequest.rejectionReason || "Not specified"}.`
          : "Your application is being reviewed. You'll be notified once a decision is made."}
      </p>
      <div className="bg-gray-50 rounded-xl p-6 text-left mb-6 text-sm text-gray-600 space-y-2">
        <p><span className="font-medium">Name:</span> {existingRequest.fullName}</p>
        <p><span className="font-medium">Institution:</span> {existingRequest.institution}</p>
        <p><span className="font-medium">Designation:</span> {existingRequest.designation}</p>
        <p><span className="font-medium">Expertise:</span> {existingRequest.expertise?.join(", ")}</p>
        <p><span className="font-medium">Submitted:</span> {existingRequest.submittedAt?.toDate?.().toLocaleDateString()}</p>
      </div>
      {existingRequest.status === "approved" && (
        <button onClick={() => navigate("/reviewer/dashboard")}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium">
          Go to Reviewer Dashboard
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Apply to Be a Reviewer</h1>
        <p className="text-gray-600 mt-2">Join our peer review panel.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-8 space-y-8">

        {/* Personal Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-indigo-600" /> Personal Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required value={form.fullName}
                onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
                placeholder="Dr. John Smith" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Professional Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-indigo-600" /> Professional Details
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution / University</label>
              <input type="text" required value={form.institution}
                onChange={e => setForm(p => ({ ...p, institution: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
                placeholder="MIT, Stanford, etc." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation / Title</label>
              <input type="text" required value={form.designation}
                onChange={e => setForm(p => ({ ...p, designation: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
                placeholder="Associate Professor, PhD Researcher, etc." />
            </div>
          </div>
        </div>

        {/* Expertise */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-indigo-600" /> Areas of Expertise
          </h2>
          <p className="text-sm text-gray-500 mb-3">Select all that apply (minimum 1):</p>
          <div className="flex flex-wrap gap-2">
            {EXPERTISE_OPTIONS.map(topic => (
              <button key={topic} type="button" onClick={() => handleExpertiseToggle(topic)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition ${
                  form.expertise.includes(topic)
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-gray-200 text-gray-600 hover:border-indigo-300"
                }`}>
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Qualifications & Experience */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Qualifications</label>
            <textarea required rows={3} value={form.qualifications}
              onChange={e => setForm(p => ({ ...p, qualifications: e.target.value }))}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
              placeholder="PhD in Computer Science from XYZ University (2018)..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review / Research Experience</label>
            <textarea required rows={3} value={form.experience}
              onChange={e => setForm(p => ({ ...p, experience: e.target.value }))}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
              placeholder="Reviewed for IEEE, Springer journals. Published 10+ papers..." />
          </div>
        </div>

        {/* Optional Links */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Link className="w-5 h-5 text-indigo-600" /> Online Profiles (Optional)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input type="url" value={form.linkedIn}
                onChange={e => setForm(p => ({ ...p, linkedIn: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
                placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ORCID ID</label>
              <input type="text" value={form.orcid}
                onChange={e => setForm(p => ({ ...p, orcid: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
                placeholder="0000-0000-0000-0000" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={submitting}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition font-semibold text-lg">
          {submitting ? "Submitting Application..." : "Submit Reviewer Application"}
        </button>
      </form>
    </div>
  );
}