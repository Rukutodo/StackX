"use client";

import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiPlus, HiPencil, HiTrash, HiX, HiSave, HiCheck,
  HiSearch, HiPhotograph, HiDocumentText,
} from "react-icons/hi";
import {
  DashboardGlassCard,
  StatusBadge,
  AdminButton,
  AdminSelect,
  FilterDropdown,
} from "@/components/admin/ui";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "";

interface Blog {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  content: string;
  author: string;
  readingTime: string;
  status: "active" | "draft";
  order: number;
  createdAt: string;
}

const EMPTY: Omit<Blog, "_id" | "createdAt"> = {
  slug: "",
  title: "",
  excerpt: "",
  category: "General",
  coverImage: "",
  content: "",
  author: "StackX Team",
  readingTime: "",
  status: "draft",
  order: 0,
};

const CATEGORIES = ["General", "Engineering", "Design", "Business", "Ad Tech", "Performance", "Process"];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-");
}

/* ── Image Uploader ────────────────────────── */
function ImageUploader({
  value,
  onChange,
  query,
}: {
  value: string;
  onChange: (url: string) => void;
  query: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`${API}/api/blogs/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
        credentials: "include",
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onChange(data.url);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleUnsplash = async () => {
    setFetching(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/blogs/fetch-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}`,
        },
        credentials: "include",
        body: JSON.stringify({ query: query.trim() }),
      });
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      onChange(data.url);
    } catch {
      setError("Couldn't fetch an image. Try again.");
    } finally {
      setFetching(false);
    }
  };

  return (
    <div>
      <label className="block text-xs text-muted mb-1.5">Cover Image</label>
      {value ? (
        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${API}${value}`} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-3 py-1.5 text-xs font-medium bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full h-24 rounded-xl border border-dashed border-white/15 hover:border-purple-500/40 hover:bg-purple-500/5 transition flex flex-col items-center justify-center gap-2 text-muted hover:text-white disabled:opacity-50"
        >
          <HiPhotograph size={22} />
          <span className="text-xs">{uploading ? "Uploading…" : "Click to upload cover image"}</span>
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {/* Unsplash / auto-image button */}
      <button
        type="button"
        onClick={handleUnsplash}
        disabled={fetching || uploading}
        className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium border border-white/10 text-muted hover:text-white hover:border-purple-500/40 hover:bg-purple-500/5 transition disabled:opacity-50 cursor-pointer"
      >
        <HiPhotograph size={14} />
        {fetching
          ? "Finding an image…"
          : query.trim()
          ? `Get image for "${query.trim().slice(0, 24)}${query.trim().length > 24 ? "…" : ""}"`
          : "Get a random image"}
      </button>
      <p className="text-[10px] text-muted/60 mt-1">
        {query.trim()
          ? "Pulls a relevant photo from Unsplash based on the title."
          : "Add a title first for a title-matched photo, or click for a random one."}
      </p>

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

/* ── Edit / Add Panel ─────────────────────── */
function EditPanel({
  editing,
  onClose,
  onSaved,
}: {
  editing: Blog | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!editing;
  const [form, setForm] = useState<Omit<Blog, "_id" | "createdAt">>({ ...EMPTY, ...(editing ?? {}) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [slugEdited, setSlugEdited] = useState(isEdit);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (val: string) => {
    set("title", val);
    if (!slugEdited) set("slug", slugify(val));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.slug || !form.title) {
      setError("Slug and title are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = isEdit ? `${API}/api/blogs/${editing!._id}` : `${API}/api/blogs`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}`,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed");
      }
      setSaved(true);
      setTimeout(() => { onSaved(); onClose(); }, 700);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="w-full lg:w-[460px] shrink-0"
    >
      <DashboardGlassCard className="sticky top-6 max-h-[calc(100vh-5rem)] overflow-y-auto admin-scroll">
        {/* Panel header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-surface-border">
          <div>
            <h3 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-poppins)" }}>
              {isEdit ? "Edit Blog Post" : "New Blog Post"}
            </h3>
            {isEdit && <p className="text-xs text-muted mt-0.5 truncate max-w-[280px]">{editing!.title}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition shrink-0">
            <HiX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Title *</label>
            <input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Blog post title"
              className="admin-input w-full"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Slug *</label>
            <input
              value={form.slug}
              onChange={(e) => { setSlugEdited(true); set("slug", slugify(e.target.value)); }}
              placeholder="url-friendly-slug"
              className="admin-input w-full font-mono text-xs"
            />
            <p className="text-[10px] text-muted/60 mt-1">/blog/{form.slug || "..."}</p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Short description shown on the blog listing"
              rows={2}
              className="admin-input w-full resize-none"
            />
          </div>

          {/* Category + Author */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">Category</label>
              <AdminSelect
                value={form.category}
                onChange={(val) => set("category", val)}
                size="sm"
                options={CATEGORIES.map((c) => ({ label: c, value: c }))}
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Author</label>
              <input
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                placeholder="StackX Team"
                className="admin-input w-full"
              />
            </div>
          </div>

          {/* Reading time + Order */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">Reading Time</label>
              <input
                value={form.readingTime}
                onChange={(e) => set("readingTime", e.target.value)}
                placeholder="5 min read"
                className="admin-input w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => set("order", Number(e.target.value))}
                className="admin-input w-full"
              />
            </div>
          </div>

          {/* Cover Image */}
          <ImageUploader value={form.coverImage} onChange={(url) => set("coverImage", url)} query={form.title} />

          {/* Content */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Content (HTML)</label>
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder={"<p>Start writing your blog post...</p>\n<h2>Section heading</h2>\n<p>Paragraph content...</p>"}
              rows={10}
              className="admin-input w-full resize-y font-mono text-xs leading-relaxed"
            />
            <p className="text-[10px] text-muted/60 mt-1">HTML is supported. Use &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;code&gt;, etc.</p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Status</label>
            <AdminSelect
              value={form.status}
              onChange={(val) => set("status", val)}
              size="sm"
              options={[
                { label: "Draft", value: "draft" },
                { label: "Active (Published)", value: "active" },
              ]}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-xs flex items-center gap-1.5">
              <HiX className="w-3.5 h-3.5 shrink-0" /> {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-muted hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || saved}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-200 disabled:opacity-60"
              style={{
                background: saved
                  ? "linear-gradient(135deg,#10b981,#059669)"
                  : "linear-gradient(135deg,#8B5CF6,#6D28D9)",
                boxShadow: "0 4px 16px rgba(139,92,246,0.25)",
              }}
            >
              {saved ? (
                <><HiCheck size={14} /> Saved!</>
              ) : saving ? (
                "Saving…"
              ) : (
                <><HiSave size={14} />{isEdit ? "Save Changes" : "Publish Blog"}</>
              )}
            </button>
          </div>
        </form>
      </DashboardGlassCard>
    </motion.div>
  );
}

/* ── Main Page ────────────────────────────── */
export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "draft">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [panelTarget, setPanelTarget] = useState<Blog | null | "new">(undefined as unknown as null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const panelOpen = panelTarget !== (undefined as unknown as null);
  const editingItem = panelTarget === "new" ? null : (panelTarget as Blog | null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/blogs?all=true`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch {
      console.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`${API}/api/blogs/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("stackx_token") || ""}` },
      });
      setDeleteTarget(null);
      if ((panelTarget as Blog)?._id === deleteTarget.id) setPanelTarget(undefined as unknown as null);
      fetchBlogs();
    } catch {
      console.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const allCategories = Array.from(new Set(blogs.map((b) => b.category)));

  const filtered = blogs
    .filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const matchStatus = filterStatus === "all" || b.status === filterStatus;
      const matchCat = filterCategory === "all" || b.category === filterCategory;
      return matchSearch && matchStatus && matchCat;
    })
    .sort((a, b) => (a.order !== b.order ? a.order - b.order : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

  const activeCount = blogs.filter((b) => b.status === "active").length;
  const draftCount = blogs.filter((b) => b.status === "draft").length;

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
              Blog Posts
            </h1>
            <p className="text-muted text-sm mt-1">Manage and publish blog content</p>
          </div>
          <AdminButton variant="primary" className="gap-1.5" onClick={() => setPanelTarget("new")}>
            <HiPlus size={16} /> New Post
          </AdminButton>
        </motion.div>

        {/* Search & Filters */}
        <motion.div variants={item}>
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] group">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <HiSearch size={16} className="text-muted group-focus-within:text-primary-light transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by title, category, or author…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-muted/50 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)" }}
              />
            </div>
            <FilterDropdown
              label="Status"
              value={filterStatus}
              onChange={(val) => setFilterStatus(val as "all" | "active" | "draft")}
              options={[
                { label: "All", value: "all" },
                { label: "Published", value: "active" },
                { label: "Draft", value: "draft" },
              ]}
            />
            <FilterDropdown
              label="Category"
              value={filterCategory}
              onChange={(val) => setFilterCategory(val)}
              options={[
                { label: "All", value: "all" },
                ...allCategories.map((c) => ({ label: c, value: c })),
              ]}
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-3 gap-3 sm:gap-4">
          <DashboardGlassCard className="text-center py-5">
            <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{blogs.length}</p>
            <p className="text-sm text-muted mt-1">Total Posts</p>
          </DashboardGlassCard>
          <DashboardGlassCard className="text-center py-5">
            <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{activeCount}</p>
            <p className="text-sm text-muted mt-1">Published</p>
          </DashboardGlassCard>
          <DashboardGlassCard className="text-center py-5">
            <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>{draftCount}</p>
            <p className="text-sm text-muted mt-1">Drafts</p>
          </DashboardGlassCard>
        </motion.div>

        {/* List + Panel */}
        <motion.div variants={item} className="flex flex-col lg:flex-row gap-5 items-start">

          {/* Blog list */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-24 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <DashboardGlassCard>
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                    <HiDocumentText size={24} className="text-purple-400" />
                  </div>
                  <p className="text-white font-medium mb-1">
                    {blogs.length === 0 ? "No blog posts yet" : "No results found"}
                  </p>
                  <p className="text-sm text-muted">
                    {blogs.length === 0
                      ? "Click \"New Post\" to write your first blog."
                      : "Try a different search or filter."}
                  </p>
                </div>
              </DashboardGlassCard>
            ) : (
              <div className="space-y-3">
                {filtered.map((blog) => {
                  const isSelected = (panelTarget as Blog)?._id === blog._id;
                  return (
                    <div
                      key={blog._id}
                      onClick={() => setPanelTarget(isSelected ? (undefined as unknown as null) : blog)}
                      className={`rounded-xl border transition-all duration-200 cursor-pointer group ${
                        isSelected
                          ? "border-purple-500/40 bg-purple-500/[0.06] shadow-lg shadow-purple-500/10"
                          : "border-white/[0.08] hover:border-purple-500/20 hover:bg-white/[0.02]"
                      }`}
                      style={{ background: isSelected ? undefined : "rgba(19,19,26,0.6)", backdropFilter: "blur(12px)" }}
                    >
                      <div className="flex items-start gap-4 p-4 sm:p-5">
                        {/* Thumbnail or icon */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative border border-white/10">
                          {blog.coverImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={`${API}${blog.coverImage}`} alt={blog.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-purple-500/15 flex items-center justify-center">
                              <HiDocumentText size={22} className="text-purple-400" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="min-w-0">
                              <p className="text-white font-medium text-sm truncate">{blog.title}</p>
                              <p className="text-xs text-muted truncate">{blog.category} · {blog.author}</p>
                            </div>
                            <StatusBadge status={blog.status} label={blog.status === "active" ? "Published" : "Draft"} />
                          </div>

                          {blog.excerpt && (
                            <p className="text-xs text-muted/80 mt-1.5 leading-relaxed line-clamp-1">{blog.excerpt}</p>
                          )}

                          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                            <div className="flex items-center gap-2 text-[10px] text-muted/60">
                              <span>{formatDate(blog.createdAt)}</span>
                              {blog.readingTime && <span>· {blog.readingTime}</span>}
                            </div>
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setPanelTarget(isSelected ? (undefined as unknown as null) : blog)}
                                className="p-1.5 text-muted hover:text-primary-light hover:bg-primary/5 rounded-lg transition"
                                title="Edit"
                              >
                                <HiPencil size={13} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ id: blog._id, label: blog.title })}
                                className="p-1.5 rounded-lg transition text-muted hover:text-red-400 hover:bg-red-500/5"
                                title="Delete"
                              >
                                <HiTrash size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Edit / Add panel */}
          <AnimatePresence mode="wait">
            {panelOpen && (
              <EditPanel
                key={panelTarget === "new" ? "new" : (panelTarget as Blog)?._id}
                editing={editingItem}
                onClose={() => setPanelTarget(undefined as unknown as null)}
                onSaved={fetchBlogs}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <DeleteConfirmModal
        open={!!deleteTarget}
        title="Delete Blog Post?"
        itemLabel={deleteTarget?.label}
        description="This will permanently remove this blog post and its cover image. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
