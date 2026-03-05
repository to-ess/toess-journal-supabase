import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/lottie/loading.json";
import { getPublishedPapers } from "../services/submissionService";
import {
  Search,
  FileText,
  Calendar,
  Tag,
  BookOpen,
  Download,
  ExternalLink,
  Filter,
  Award,
  Eye,
  X,
  ChevronDown,
  Users,
  Clock,
  Bookmark,
  TrendingUp,
} from "lucide-react";

export default function Archives() {
  const [papers, setPapers] = useState([]);
  const [authReady, setAuthReady] = useState(false);
  const [minTimerDone, setMinTimerDone] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedPaper, setSelectedPaper] = useState(null);

  const loading = !authReady || !minTimerDone;

  /* ================= FORMAT AUTHORS ================= */
  const formatAuthors = (paper) => {
    if (
      paper.paper_authors &&
      Array.isArray(paper.paper_authors) &&
      paper.paper_authors.length > 0
    ) {
      return paper.paper_authors.map((a) => a.full_name).join(", ");
    }
    if (paper.users) {
      return `${paper.users.given_name || ""} ${paper.users.family_name || ""}`.trim();
    }
    return "Unknown author";
  };

  /* ================= FORMAT DATE ================= */
  const formatDate = (timestamp) => {
    if (!timestamp) return "Date unavailable";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Date unavailable";
    }
  };

  /* ================= LOAD PAPERS ================= */
  useEffect(() => {
    // Minimum 2 seconds loader
    const timer = setTimeout(() => setMinTimerDone(true), 2000);
    load();
    return () => clearTimeout(timer);
  }, []);

  const load = async () => {
    try {
      const data = await getPublishedPapers();
      console.log("Published papers:", data);
      setPapers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setAuthReady(true);
    }
  };

  /* ================= FILTERING ================= */
  const categories = [
    ...new Set(papers.map((p) => p.category).filter(Boolean)),
  ].sort();

  let filtered = papers.filter((p) => {
    const authorText = formatAuthors(p).toLowerCase();
    const keywordsText = Array.isArray(p.keywords)
      ? p.keywords.join(" ").toLowerCase()
      : typeof p.keywords === "string"
        ? p.keywords.toLowerCase()
        : "";

    return (
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      authorText.includes(search.toLowerCase()) ||
      keywordsText.includes(search.toLowerCase()) ||
      p.abstract?.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (selectedCategory !== "all") {
    filtered = filtered.filter((p) => p.category === selectedCategory);
  }

  filtered.sort((a, b) => {
    if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");

    const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
    const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
    return sortBy === "oldest" ? dateA - dateB : dateB - dateA;
  });

  /* ================= STATS ================= */
  const stats = {
    total: papers.length,
    categories: categories.length,
    thisYear: papers.filter((p) => {
      const year = new Date(p.updated_at || p.created_at).getFullYear();
      return year === new Date().getFullYear();
    }).length,
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-64">
          <Lottie animationData={loadingAnimation} loop={true} speed={3} />
          <p className="text-center text-gray-600 mt-4 font-medium">
            Loading publications...
          </p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Published Archives</h1>
          </div>
          <p className="text-blue-100 text-lg mb-8 max-w-3xl">
            Browse our collection of peer-reviewed research papers in
            evolutionary algorithms, artificial intelligence, and smart systems.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-200" />
                <div>
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <div className="text-sm text-blue-200">Published Papers</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-200" />
                <div>
                  <div className="text-3xl font-bold">{stats.thisYear}</div>
                  <div className="text-sm text-blue-200">This Year</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Tag className="w-8 h-8 text-blue-200" />
                <div>
                  <div className="text-3xl font-bold">{stats.categories}</div>
                  <div className="text-sm text-blue-200">Categories</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6 relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, keywords, or abstract..."
              className="w-full border-2 border-gray-200 rounded-lg pl-12 pr-4 py-3 focus:border-indigo-500 focus:outline-none transition"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Filter className="w-4 h-4" />
              Filters:
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-2 border-gray-200 px-4 py-2 rounded-lg focus:border-indigo-500 focus:outline-none transition"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-2 border-gray-200 px-4 py-2 rounded-lg focus:border-indigo-500 focus:outline-none transition"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {filtered.length} {filtered.length === 1 ? "paper" : "papers"}
              </span>
            </div>
          </div>
        </div>

        {/* No Results */}
        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No papers found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Papers Grid */}
        <div className="grid gap-6">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition cursor-pointer">
                    {p.title}
                  </h2>

                  {/* Meta Information */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-gray-400" />
                      {formatAuthors(p)}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(p.updated_at || p.created_at)}
                    </span>
                  </div>

                  {/* Category Badge */}
                  {p.category && (
                    <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {p.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Abstract */}
              {p.abstract && (
                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                  {p.abstract}
                </p>
              )}

              {/* Keywords */}
              {p.keywords &&
                (Array.isArray(p.keywords) ? p.keywords.length : 0) > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(Array.isArray(p.keywords)
                      ? p.keywords
                      : p.keywords.split(",")
                    )
                      .slice(0, 5)
                      .map((kw, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          <Tag className="w-3 h-3" />
                          {typeof kw === "string" ? kw.trim() : kw}
                        </span>
                      ))}
                  </div>
                )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedPaper(p)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>

                {p.file_url && (
                  <a
                    href={p.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium text-sm shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedPaper.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {formatAuthors(selectedPaper)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {formatDate(
                        selectedPaper.updated_at || selectedPaper.created_at,
                      )}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="ml-4 p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Publication Info */}
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                {selectedPaper.category && (
                  <div>
                    <span className="text-sm font-semibold text-gray-600">
                      Category
                    </span>
                    <p className="text-gray-900">{selectedPaper.category}</p>
                  </div>
                )}
                {selectedPaper.article_type && (
                  <div>
                    <span className="text-sm font-semibold text-gray-600">
                      Article Type
                    </span>
                    <p className="text-gray-900">
                      {selectedPaper.article_type}
                    </p>
                  </div>
                )}
                {selectedPaper.status === "published" && (
                  <div>
                    <span className="text-sm font-semibold text-gray-600">
                      Status
                    </span>
                    <p className="text-gray-900">Published</p>
                  </div>
                )}
                {selectedPaper.updated_at && (
                  <div>
                    <span className="text-sm font-semibold text-gray-600">
                      Published Date
                    </span>
                    <p className="text-gray-900">
                      {formatDate(selectedPaper.updated_at)}
                    </p>
                  </div>
                )}
              </div>

              {/* Abstract */}
              {selectedPaper.abstract && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Abstract
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedPaper.abstract}
                  </p>
                </div>
              )}

              {/* Keywords */}
              {selectedPaper.keywords &&
                (Array.isArray(selectedPaper.keywords)
                  ? selectedPaper.keywords.length
                  : 0) > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(selectedPaper.keywords)
                        ? selectedPaper.keywords
                        : selectedPaper.keywords.split(",")
                      ).map((kw, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          <Tag className="w-3 h-3" />
                          {typeof kw === "string" ? kw.trim() : kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Authors Details */}
              {selectedPaper.paper_authors &&
                selectedPaper.paper_authors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Authors
                    </h3>
                    <div className="space-y-3">
                      {selectedPaper.paper_authors.map((author, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                            {(author.full_name?.[0] || "?").toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {author.full_name}
                              {author.is_corresponding && (
                                <span className="text-xs text-indigo-600 ml-2">
                                  (Corresponding)
                                </span>
                              )}
                            </p>
                            {author.institution && (
                              <p className="text-sm text-gray-600">
                                {author.institution}
                              </p>
                            )}
                            {author.email && (
                              <p className="text-sm text-gray-500">
                                {author.email}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition font-medium"
                >
                  Close
                </button>

                {selectedPaper.file_url && (
                  <a
                    href={selectedPaper.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    Download Full Paper
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
