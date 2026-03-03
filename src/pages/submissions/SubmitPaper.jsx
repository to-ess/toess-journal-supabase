import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { createSubmission } from "../../services/submissionService";
import { getActiveSpecialIssues } from "../../services/specialIssuesService";

import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  User,
  Users,
  BookOpen,
  FileCheck,
  Sparkles,
} from "lucide-react";

const ARTICLE_TYPES = ["Research Article", "Short Paper", "Survey Paper"];
const SUBMISSION_TYPES = ["Regular Submission", "Special Issue"];
const PREFIXES = ["Dr.", "Mr.", "Mrs.", "Ms.", "Prof."];
const CATEGORIES = [
  "Evolutionary Algorithms",
  "Artificial Intelligence",
  "Smart & Adaptive Systems",
  "Optimization Techniques",
  "Swarm Intelligence",
  "Nature-Inspired Computing",
  "Machine Learning",
  "Neural Networks",
  "IoT & Smart Applications",
];

const emptyAuthor = () => ({
  id: Date.now() + Math.random(),
  prefix: "",
  firstName: "",
  lastName: "",
  email: "",
  institution: "",
  address: "",
  mobile: "",
  isCorresponding: false,
});

const emptyReviewer = () => ({
  id: Date.now() + Math.random(),
  prefix: "",
  firstName: "",
  lastName: "",
  email: "",
  institution: "",
  address: "",
  mobile: "",
});

function PersonCard({
  person, index, onChange, onRemove, canRemove,
  showCorrespondingOption, isCorresponding, onCorrespondingChange, label,
}) {
  const update = (field, value) => onChange(index, field, value);

  return (
    <div className={`relative rounded-lg border bg-white transition-all ${
      isCorresponding ? "border-indigo-400 shadow-sm ring-2 ring-indigo-100" : "border-slate-200"
    }`}>
      <div className="flex items-center justify-between bg-slate-50 border-b px-4 py-2.5 rounded-t-lg">
        <span className="text-sm font-semibold text-slate-700">
          {label} #{index + 1}
          {isCorresponding && (
            <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
              Corresponding
            </span>
          )}
        </span>
        {canRemove && (
          <button type="button" onClick={() => onRemove(index)}
            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-3 sm:col-span-2">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Prefix</label>
            <select value={person.prefix} onChange={(e) => update("prefix", e.target.value)}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent bg-white">
              <option value="">--</option>
              {PREFIXES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="col-span-5">
            <label className="text-xs font-medium text-slate-500 mb-1 block">First Name <span className="text-red-500">*</span></label>
            <input required value={person.firstName} onChange={(e) => update("firstName", e.target.value)}
              placeholder="First name"
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
          </div>
          <div className="col-span-4 sm:col-span-5">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Last Name <span className="text-red-500">*</span></label>
            <input required value={person.lastName} onChange={(e) => update("lastName", e.target.value)}
              placeholder="Last name"
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Official Email <span className="text-red-500">*</span></label>
            <input type="email" required value={person.email} onChange={(e) => update("email", e.target.value)}
              placeholder="official@email.edu"
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Institution <span className="text-red-500">*</span></label>
            <input required value={person.institution} onChange={(e) => update("institution", e.target.value)}
              placeholder="University / Organization"
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Address</label>
            <input value={person.address} onChange={(e) => update("address", e.target.value)}
              placeholder="Street, City, Country"
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Mobile No.</label>
            <input type="tel" value={person.mobile} onChange={(e) => update("mobile", e.target.value)}
              placeholder="+91 XXXXXXXXXX"
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
          </div>
        </div>

        {showCorrespondingOption && (
          <div className="pt-2 border-t border-slate-100 mt-1">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input type="radio" name="correspondingAuthor" checked={isCorresponding}
                onChange={() => onCorrespondingChange(index)}
                className="mt-0.5 accent-indigo-600 w-4 h-4 cursor-pointer" />
              <div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                  Set as Corresponding Author
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  The corresponding author will be the point of contact during the review process.
                </p>
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SubmitPaper() {
  const [formData, setFormData] = useState({
    submissionType: "Regular Submission",
    specialIssueId: "",
    articleType: "",
    title: "",
    abstract: "",
    keywords: "",
    category: "",
  });

  const [authors, setAuthors] = useState([{ ...emptyAuthor(), isCorresponding: true }]);
  const [reviewers, setReviewers] = useState([]);
  const [specialIssues, setSpecialIssues] = useState([]);
  const [file, setFile] = useState(null);
  const [copyrightAgreed, setCopyrightAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [manuscriptId, setManuscriptId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadSpecialIssues();
  }, []);

  const loadSpecialIssues = async () => {
    try {
      setLoadingIssues(true);
      const issues = await getActiveSpecialIssues();
      setSpecialIssues(issues);
    } catch (error) {
      console.error("Error loading special issues:", error);
    } finally {
      setLoadingIssues(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "submissionType" && value === "Regular Submission") {
      setFormData(prev => ({ ...prev, submissionType: value, specialIssueId: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const addAuthor = () => setAuthors((prev) => [...prev, emptyAuthor()]);
  const removeAuthor = (idx) => {
    setAuthors((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (prev[idx].isCorresponding && next.length > 0) {
        next[0] = { ...next[0], isCorresponding: true };
      }
      return next;
    });
  };
  const updateAuthor = (idx, field, value) =>
    setAuthors((prev) => prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a)));
  const setCorrespondingAuthor = (idx) =>
    setAuthors((prev) => prev.map((a, i) => ({ ...a, isCorresponding: i === idx })));

  const addReviewer = () => setReviewers((prev) => [...prev, emptyReviewer()]);
  const removeReviewer = (idx) => setReviewers((prev) => prev.filter((_, i) => i !== idx));
  const updateReviewer = (idx, field, value) =>
    setReviewers((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (selected.type !== "application/pdf") { setError("Only PDF files are allowed"); return; }
    if (selected.size > 10 * 1024 * 1024) { setError("File size must be under 10 MB"); return; }
    setFile(selected);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!copyrightAgreed) {
      setError("You must agree to the Copyright & Licensing terms before submitting.");
      return;
    }

    if (formData.submissionType === "Special Issue" && !formData.specialIssueId) {
      setError("Please select a special issue");
      return;
    }
    if (!file) {
      setError("Please upload the manuscript PDF");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Please log in first");
        setLoading(false);
        return;
      }

      // Upload PDF to Supabase Storage bucket "manuscripts"
      const filePath = `submissions/${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("manuscripts")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("manuscripts")
        .getPublicUrl(filePath);

      // Get corresponding author email
      const correspondingAuthor = authors.find(a => a.isCorresponding);
      const correspondingEmail = correspondingAuthor?.email || authors[0]?.email || user.email;

      // Save submission
      const result = await createSubmission({
        userId: user.id,
        submissionType: formData.submissionType,
        specialIssueId: formData.specialIssueId || null,
        articleType: formData.articleType,
        title: formData.title,
        abstract: formData.abstract,
        keywords: formData.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        category: formData.category,
        authors: authors.map(({ id, isCorresponding, ...rest }) => ({ ...rest, isCorresponding })),
        suggestedReviewers: reviewers.map(({ id, ...rest }) => rest),
        fileUrl: publicUrl,
        authorEmail: correspondingEmail,
        copyrightAgreed: true,
      });

      setManuscriptId(result.manuscriptId || "Processing...");
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/author"), 3000);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-lg text-center max-w-md w-full mx-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Submission Successful</h2>
          <p className="text-slate-500 mb-4">Your manuscript has been submitted and is now under review.</p>
          {manuscriptId && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
              <p className="text-xs text-indigo-600 font-semibold mb-1">MANUSCRIPT ID</p>
              <p className="text-lg font-mono font-bold text-indigo-700">{manuscriptId}</p>
            </div>
          )}
          <p className="text-xs text-slate-400 mt-4">Redirecting to dashboard …</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
          <FileCheck className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Submit Manuscript</h1>
          <p className="text-sm text-slate-500">Fill in all required fields marked with <span className="text-red-500">*</span></p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 mb-5 rounded-lg flex items-start gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Submission Type */}
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-slate-50 border-b border-slate-200">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Submission Type</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                Submission Type <span className="text-red-500">*</span>
              </label>
              <select name="submissionType" required value={formData.submissionType} onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent bg-white text-slate-700">
                {SUBMISSION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {formData.submissionType === "Special Issue" && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <label className="text-xs font-semibold text-indigo-900 uppercase tracking-wide mb-2 block">
                  Select Special Issue <span className="text-red-500">*</span>
                </label>
                {loadingIssues ? (
                  <p className="text-sm text-indigo-600">Loading special issues...</p>
                ) : specialIssues.length === 0 ? (
                  <p className="text-sm text-slate-600">No active special issues available at the moment.</p>
                ) : (
                  <>
                    <select name="specialIssueId" required={formData.submissionType === "Special Issue"}
                      value={formData.specialIssueId} onChange={handleChange}
                      className="w-full border border-indigo-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-slate-700">
                      <option value="">-- Select a Special Issue --</option>
                      {specialIssues.map((issue) => (
                        <option key={issue.id} value={issue.id}>
                          {issue.title} {issue.deadline && `(Deadline: ${new Date(issue.deadline).toLocaleDateString()})`}
                        </option>
                      ))}
                    </select>
                    {formData.specialIssueId && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-indigo-200">
                        <p className="text-xs font-semibold text-indigo-900 mb-1">Selected Issue Details:</p>
                        {specialIssues.find(i => i.id === formData.specialIssueId)?.description && (
                          <p className="text-xs text-slate-600">
                            {specialIssues.find(i => i.id === formData.specialIssueId).description}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Article Details */}
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-slate-50 border-b border-slate-200">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Article Details</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Article Type <span className="text-red-500">*</span>
                </label>
                <select name="articleType" required value={formData.articleType} onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-slate-700">
                  <option value="">Select article type</option>
                  {ARTICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Category <span className="text-red-500">*</span>
                </label>
                <select name="category" required value={formData.category} onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-slate-700">
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                Paper Title <span className="text-red-500">*</span>
              </label>
              <input name="title" required value={formData.title} onChange={handleChange}
                placeholder="Enter the full title of your manuscript"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                Abstract <span className="text-red-500">*</span>
              </label>
              <textarea name="abstract" rows="5" required value={formData.abstract} onChange={handleChange}
                placeholder="Write your abstract here (minimum 100 characters) …"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Keywords</label>
              <input name="keywords" value={formData.keywords} onChange={handleChange}
                placeholder="e.g. machine learning, optimization, neural networks"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              <p className="text-xs text-slate-400 mt-1">Separate keywords with commas</p>
            </div>
          </div>
        </section>

        {/* Authors */}
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-indigo-600" />
              <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Author(s)</h2>
            </div>
            <button type="button" onClick={addAuthor}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Author
            </button>
          </div>
          <div className="p-5 space-y-4">
            {authors.map((author, idx) => (
              <PersonCard key={author.id} person={author} index={idx} label="Author"
                onChange={updateAuthor} onRemove={removeAuthor} canRemove={authors.length > 1}
                showCorrespondingOption={true} isCorresponding={author.isCorresponding}
                onCorrespondingChange={setCorrespondingAuthor} />
            ))}
          </div>
        </section>

        {/* Suggest Reviewers */}
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-indigo-600" />
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Suggest Reviewers</h2>
                <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">Optional</span>
              </div>
            </div>
            <button type="button" onClick={addReviewer}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Reviewer
            </button>
          </div>
          <div className="p-5">
            {reviewers.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-lg py-8 text-center">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No reviewers suggested yet.</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click <span className="font-semibold text-indigo-600">Add Reviewer</span> to suggest one.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewers.map((reviewer, idx) => (
                  <PersonCard key={reviewer.id} person={reviewer} index={idx} label="Reviewer"
                    onChange={updateReviewer} onRemove={removeReviewer} canRemove={true}
                    showCorrespondingOption={false} isCorresponding={false} onCorrespondingChange={() => {}} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Manuscript Upload */}
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-slate-50 border-b border-slate-200">
            <Upload className="w-4 h-4 text-indigo-600" />
            <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Manuscript Upload</h2>
          </div>
          <div className="p-5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
              PDF File <span className="text-red-500">*</span>
            </label>
            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-lg py-8 px-4 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all group">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${file ? "bg-emerald-100" : "bg-slate-100 group-hover:bg-indigo-100"}`}>
                {file ? <CheckCircle className="w-6 h-6 text-emerald-600" /> : <FileText className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" />}
              </div>
              {file ? (
                <>
                  <span className="text-sm font-semibold text-emerald-700">{file.name}</span>
                  <span className="text-xs text-slate-400 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB · Click to replace</span>
                </>
              ) : (
                <>
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600">Drag & drop your PDF here, or click to browse</span>
                  <span className="text-xs text-slate-400 mt-1">Only PDF files accepted · Max 10 MB</span>
                </>
              )}
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </section>

        {/* Copyright & Licensing Agreement */}
        <section className={`rounded-xl border-2 overflow-hidden transition-all ${
          copyrightAgreed ? "border-emerald-300 bg-emerald-50" : "border-indigo-200 bg-white"
        }`}>
          <div className={`flex items-center gap-2.5 px-5 py-3.5 border-b ${
            copyrightAgreed ? "bg-emerald-100 border-emerald-200" : "bg-indigo-50 border-indigo-200"
          }`}>
            <svg className={`w-4 h-4 ${copyrightAgreed ? "text-emerald-600" : "text-indigo-600"}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
            </svg>
            <h2 className={`font-semibold text-sm uppercase tracking-wide ${copyrightAgreed ? "text-emerald-800" : "text-indigo-800"}`}>
              Copyright &amp; Licensing Agreement
            </h2>
            {copyrightAgreed ? (
              <span className="text-xs bg-emerald-200 text-emerald-800 font-semibold px-2 py-0.5 rounded-full ml-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Agreed
              </span>
            ) : (
              <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full ml-1">Required</span>
            )}
          </div>
          <div className="p-5">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={copyrightAgreed}
                onChange={(e) => {
                  setCopyrightAgreed(e.target.checked);
                  if (e.target.checked) setError("");
                }}
                className="mt-0.5 w-5 h-5 accent-indigo-600 cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-slate-700 leading-relaxed">
                I have read and agree to the Journal's{" "}
                <a
                  href="/copyright-policy"
                  className="text-indigo-600 font-semibold underline underline-offset-2 hover:text-indigo-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  Copyright & Licensing Policy
                </a>
                , and consent to transfer copyright upon acceptance. I acknowledge the article will be published under the{" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-semibold underline underline-offset-2 hover:text-indigo-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  Creative Commons Attribution 4.0 International License (CC BY 4.0)
                </a>.
              </span>
            </label>
            <p className="text-xs text-slate-400 mt-3 pl-8">
              By checking this box, you confirm that the work is original, has not been published elsewhere, and does not infringe upon any third-party rights.
            </p>
          </div>
        </section>

        {/* Submit */}
        <button type="submit" disabled={loading || !copyrightAgreed}
          className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-200">
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z" />
              </svg>
              Submitting …
            </>
          ) : (
            <><FileCheck className="w-4 h-4" /> Submit Paper</>
          )}
        </button>

      </form>
    </div>
  );
}