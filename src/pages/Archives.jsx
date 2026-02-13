import { useEffect, useState } from "react";
import { getPublishedPapers } from "../services/submissionService";
import { Search, FileText, Calendar, Tag, BookOpen, Download, ExternalLink, Filter, Award, Eye } from "lucide-react";

export default function Archives() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedVolume, setSelectedVolume] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedPaper, setSelectedPaper] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getPublishedPapers();
      console.log("Published papers:", data);
      setPapers(data);
    } catch (error) {
      console.error("Error loading papers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique volumes and categories
  const volumes = [...new Set(papers.map(p => p.volume))].sort((a, b) => b - a);
  const categories = [...new Set(papers.map(p => p.category).filter(Boolean))];

  // Filter papers
  let filtered = papers.filter(
    (p) =>
      (p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.authors?.toLowerCase().includes(search.toLowerCase()) ||
      p.authorName?.toLowerCase().includes(search.toLowerCase()) ||
      p.keywords?.join(" ").toLowerCase().includes(search.toLowerCase()) ||
      p.abstract?.toLowerCase().includes(search.toLowerCase()))
  );

  // Filter by volume
  if (selectedVolume !== "all") {
    filtered = filtered.filter(p => p.volume === parseInt(selectedVolume));
  }

  // Filter by category
  if (selectedCategory !== "all") {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }

  // Sort papers
  filtered.sort((a, b) => {
    if (sortBy === "newest") {
      const dateA = a.publishedDate || a.createdAt?.seconds * 1000 || 0;
      const dateB = b.publishedDate || b.createdAt?.seconds * 1000 || 0;
      return dateB - dateA;
    } else if (sortBy === "oldest") {
      const dateA = a.publishedDate || a.createdAt?.seconds * 1000 || 0;
      const dateB = b.publishedDate || b.createdAt?.seconds * 1000 || 0;
      return dateA - dateB;
    } else if (sortBy === "title") {
      return (a.title || "").localeCompare(b.title || "");
    }
    return 0;
  });

  const stats = {
    totalPapers: papers.length,
    totalVolumes: volumes.length,
    totalIssues: [...new Set(papers.map(p => `${p.volume}-${p.issue}`))].length,
    categories: categories.length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium">Loading archives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Archives</h1>
              <p className="text-blue-100 mt-2">Browse published research articles</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Published Papers", value: stats.totalPapers, icon: FileText },
              { label: "Volumes", value: stats.totalVolumes, icon: BookOpen },
              { label: "Issues", value: stats.totalIssues, icon: Calendar },
              { label: "Categories", value: stats.categories, icon: Tag }
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4 text-blue-200" />
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, author, keywords, or abstract..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Volume
              </label>
              <select
                value={selectedVolume}
                onChange={(e) => setSelectedVolume(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Volumes</option>
                {volumes.map(v => (
                  <option key={v} value={v}>Volume {v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Active Filters Info */}
          {(search || selectedVolume !== "all" || selectedCategory !== "all") && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-slate-600">Showing {filtered.length} of {papers.length} papers</span>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedVolume("all");
                  setSelectedCategory("all");
                }}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Papers List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No papers found</h3>
            <p className="text-slate-600">
              {papers.length === 0 
                ? "No published papers available yet."
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                        {p.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        {(p.authors || p.authorName) && (
                          <div className="flex items-center gap-1.5">
                            <Award className="w-4 h-4" />
                            <span>{p.authors || p.authorName}</span>
                          </div>
                        )}
                        {p.publishedDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(p.publishedDate).toLocaleDateString('en-US', { 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                        )}
                        {p.category && (
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
                            {p.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Abstract */}
                  {p.abstract && (
                    <div className="mb-4">
                      <p className="text-slate-700 leading-relaxed line-clamp-3">
                        {p.abstract}
                      </p>
                    </div>
                  )}

                  {/* Keywords */}
                  {p.keywords && p.keywords.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {p.keywords.map((keyword, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="text-sm">
                      <span className="font-semibold text-slate-900">
                        Volume {p.volume}, Issue {p.issue}
                      </span>
                      {p.doi && (
                        <span className="text-slate-600 ml-3">
                          DOI: <span className="font-mono text-indigo-600">{p.doi}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedPaper(p)}
                        className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      {p.fileUrl ? (
                        <button 
                          onClick={() => window.open(p.fileUrl, '_blank')}
                          className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </button>
                      ) : (
                        <button 
                          disabled
                          className="px-4 py-2 text-sm font-semibold text-slate-400 bg-slate-100 cursor-not-allowed rounded-lg flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          No PDF
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Info */}
        {filtered.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{filtered.length}</span> published {filtered.length === 1 ? 'paper' : 'papers'}
            </p>
          </div>
        )}
      </div>

      {/* Paper Detail Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Paper Details</h2>
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
                  {selectedPaper.category && (
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
                      {selectedPaper.category}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                    Volume {selectedPaper.volume}, Issue {selectedPaper.issue}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">Author(s)</p>
                  <p className="text-sm font-medium text-slate-900">{selectedPaper.authors || selectedPaper.authorName || 'N/A'}</p>
                  {selectedPaper.authorEmail && (
                    <p className="text-xs text-slate-600">{selectedPaper.authorEmail}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">Published</p>
                  <p className="text-sm font-medium text-slate-900">
                    {selectedPaper.publishedDate 
                      ? new Date(selectedPaper.publishedDate).toLocaleDateString('en-US', { 
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

              {selectedPaper.doi && (
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-xs font-semibold text-indigo-900 mb-1">Digital Object Identifier</p>
                  <p className="text-sm font-mono text-indigo-700">{selectedPaper.doi}</p>
                </div>
              )}

              {selectedPaper.fileUrl && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Full Text</h4>
                  <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Research Paper PDF</p>
                        <p className="text-xs text-slate-500">Click to download or view</p>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(selectedPaper.fileUrl, '_blank')}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button 
                  onClick={() => setSelectedPaper(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition"
                >
                  Close
                </button>
                {selectedPaper.fileUrl && (
                  <button 
                    onClick={() => window.open(selectedPaper.fileUrl, '_blank')}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open PDF in New Tab
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}