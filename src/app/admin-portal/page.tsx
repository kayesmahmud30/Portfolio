"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import ImageUploader from "@/components/admin/ImageUploader";
import ProjectModal from "@/components/admin/ProjectModal";
import ThemeToggle from "@/components/ThemeToggle";
import { signOut, authClient } from "@/lib/auth-client";
import type { Project, SiteConfig, SkillGroup } from "@/types";
import {
  FiGrid,
  FiUser,
  FiLayers,
  FiBookOpen,
  FiLogOut,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSave,
  FiExternalLink,
  FiCheckCircle,
  FiAlertCircle,
  FiBriefcase,
  FiShield,
} from "react-icons/fi";

type Tab = "overview" | "projects" | "profile" | "skills" | "education";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);

  // Content States
  const [siteInfo, setSiteInfo] = useState<Partial<SiteConfig & { profileImage?: string; bannerImage?: string }>>({});
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [skillsList, setSkillsList] = useState<SkillGroup[]>([]);

  // UI States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [siteRes, projectsRes, skillsRes] = await Promise.all([
        fetch("/api/admin/site"),
        fetch("/api/admin/projects"),
        fetch("/api/admin/skills"),
      ]);

      const siteData = await siteRes.json();
      const projectsData = await projectsRes.json();
      const skillsData = await skillsRes.json();

      if (siteData.ok) setSiteInfo(siteData.data);
      if (projectsData.ok) setProjectsList(projectsData.data);
      if (skillsData.ok) setSkillsList(skillsData.data);
    } catch {
      showToast("error", "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const sessionRes = await authClient.getSession();
        const userRole = (sessionRes.data?.user as { role?: string } | undefined)?.role;

        if (!sessionRes.data?.user || userRole !== "admin") {
          router.push("/admin-portal/login");
          return;
        }

        setAuthorized(true);
        fetchData();
      } catch {
        router.push("/admin-portal/login");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchData, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black text-zinc-500">
        Authenticating admin session...
      </div>
    );
  }

  // --- Project Actions ---
  async function handleSaveProject(projectData: Partial<Project>) {
    try {
      if (editingProject && "_id" in editingProject) {
        const res = await fetch(`/api/admin/projects/${editingProject._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error);
        showToast("success", "Project updated successfully.");
      } else {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error);
        showToast("success", "New project created successfully.");
      }
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save project.";
      showToast("error", msg);
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      showToast("success", "Project deleted successfully.");
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete project.";
      showToast("error", msg);
    }
  }

  // --- Profile Actions ---
  async function handleSaveProfile() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteInfo),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      showToast("success", "Profile and site info updated!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save profile.";
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  }

  // --- Skills Actions ---
  async function handleSaveSkills() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillsList),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      showToast("success", "Skills updated successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save skills.";
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-950 dark:text-zinc-50 pb-16">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/50">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
              <FiShield className="text-[18px]" />
            </span>
            <span className="font-semibold tracking-tight text-lg">Portfolio Admin</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => {
                signOut();
                window.location.href = "/admin-portal/login";
              }}
              className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-500/20 dark:text-rose-300"
            >
              <FiLogOut />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </Container>
      </header>

      {/* Main Content Area */}
      <Container className="pt-8">
        {/* Toast Alert */}
        {toast ? (
          <div
            className={`mb-6 flex items-center gap-2 rounded-2xl border p-4 text-sm font-medium ${
              toast.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
            }`}
          >
            {toast.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
            <span>{toast.msg}</span>
          </div>
        ) : null}

        {/* Dashboard Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-black/5 pb-4 dark:border-white/10">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon={FiGrid}
            label="Overview"
          />
          <TabButton
            active={activeTab === "projects"}
            onClick={() => setActiveTab("projects")}
            icon={FiLayers}
            label={`Projects (${projectsList.length})`}
          />
          <TabButton
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
            icon={FiUser}
            label="Profile & Banner"
          />
          <TabButton
            active={activeTab === "skills"}
            onClick={() => setActiveTab("skills")}
            icon={FiBookOpen}
            label="Skill Sets"
          />
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="py-20 text-center text-zinc-500">Loading dashboard data...</div>
        ) : (
          <div className="mt-8">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard title="Total Projects" value={projectsList.length} icon={FiLayers} color="text-indigo-500" />
                  <StatCard
                    title="Skill Categories"
                    value={skillsList.length}
                    icon={FiBookOpen}
                    color="text-emerald-500"
                  />
                  <StatCard title="Status" value="Live & Dynamic" icon={FiCheckCircle} color="text-sky-500" />
                  <StatCard title="Storage" value="Cloudinary Active" icon={FiBriefcase} color="text-purple-500" />
                </div>

                <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-6 backdrop-blur dark:border-white/10">
                  <h3 className="text-base font-semibold">Quick Actions</h3>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setEditingProject(null);
                        setModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                    >
                      <FiPlus /> Add New Project
                    </button>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-5 py-2.5 text-sm font-semibold backdrop-blur hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60"
                    >
                      <FiUser /> Edit Profile & Banner
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold tracking-tight">Portfolio Projects</h2>
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                  >
                    <FiPlus /> Add New Project
                  </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {projectsList.map((p) => (
                    <div
                      key={p.slug}
                      className="rounded-3xl border border-black/10 bg-[var(--card)] p-5 backdrop-blur dark:border-white/10"
                    >
                      <h3 className="font-semibold text-lg">{p.title}</h3>
                      <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{p.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {p.tags?.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-black/5 px-2.5 py-0.5 text-[11px] font-medium dark:bg-white/10"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-3 dark:border-white/10">
                        {p.liveUrl ? (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:underline"
                          >
                            <span>Live Link</span>
                            <FiExternalLink />
                          </a>
                        ) : (
                          <span />
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingProject(p);
                              setModalOpen(true);
                            }}
                            className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300"
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteProject((p as { _id?: string })._id || "")}
                            className="rounded-full p-2 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROFILE & BANNER TAB */}
            {activeTab === "profile" && (
              <div className="max-w-3xl rounded-3xl border border-black/10 bg-[var(--card)] p-8 backdrop-blur dark:border-white/10 space-y-6">
                <h2 className="text-xl font-semibold tracking-tight">Edit Profile & Banner</h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  <ImageUploader
                    label="Profile Photo (Cloudinary)"
                    currentUrl={siteInfo.profileImage}
                    onUpload={(url) => setSiteInfo((s) => ({ ...s, profileImage: url }))}
                  />

                  <ImageUploader
                    label="Banner Background Image (Cloudinary)"
                    currentUrl={siteInfo.bannerImage}
                    onUpload={(url) => setSiteInfo((s) => ({ ...s, bannerImage: url }))}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Name</label>
                    <input
                      type="text"
                      value={siteInfo.name || ""}
                      onChange={(e) => setSiteInfo((s) => ({ ...s, name: e.target.value }))}
                      className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Location</label>
                    <input
                      type="text"
                      value={siteInfo.location || ""}
                      onChange={(e) => setSiteInfo((s) => ({ ...s, location: e.target.value }))}
                      className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Designations Loop (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={siteInfo.designationLoop?.join(", ") || ""}
                    onChange={(e) =>
                      setSiteInfo((s) => ({
                        ...s,
                        designationLoop: e.target.value.split(",").map((d) => d.trim()),
                      }))
                    }
                    className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Bio Intro</label>
                  <textarea
                    rows={4}
                    value={siteInfo.intro || ""}
                    onChange={(e) => setSiteInfo((s) => ({ ...s, intro: e.target.value }))}
                    className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30 resize-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Email</label>
                    <input
                      type="email"
                      value={siteInfo.email || ""}
                      onChange={(e) => setSiteInfo((s) => ({ ...s, email: e.target.value }))}
                      className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Phone</label>
                    <input
                      type="text"
                      value={siteInfo.phone || ""}
                      onChange={(e) => setSiteInfo((s) => ({ ...s, phone: e.target.value }))}
                      className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-zinc-900/30"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/10 flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                  >
                    <FiSave />
                    <span>{saving ? "Saving..." : "Save Profile & Banner"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* SKILLS TAB */}
            {activeTab === "skills" && (
              <div className="max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold tracking-tight">Edit Skill Sets</h2>
                  <button
                    onClick={handleSaveSkills}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                  >
                    <FiSave />
                    <span>{saving ? "Saving..." : "Save Skill Sets"}</span>
                  </button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {skillsList.map((group, groupIdx) => (
                    <div
                      key={group.title}
                      className="rounded-3xl border border-black/10 bg-[var(--card)] p-5 backdrop-blur dark:border-white/10 space-y-4"
                    >
                      <h3 className="font-semibold text-base border-b border-black/5 pb-2 dark:border-white/10">
                        {group.title}
                      </h3>
                      <div className="space-y-3">
                        {group.skills.map((skill, skillIdx) => (
                          <div key={skill.name} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span>{skill.name}</span>
                              <span>{skill.level}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={skill.level}
                              onChange={(e) => {
                                const newLevel = parseInt(e.target.value, 10);
                                setSkillsList((prev) => {
                                  const updated = [...prev];
                                  updated[groupIdx].skills[skillIdx].level = newLevel;
                                  return updated;
                                });
                              }}
                              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-black/10 dark:bg-white/10 accent-indigo-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Container>

      {/* Project Add/Edit Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProject}
        project={editingProject}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof FiGrid;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
          : "text-zinc-600 hover:bg-black/5 dark:text-zinc-400 dark:hover:bg-white/10"
      }`}
    >
      <Icon />
      <span>{label}</span>
    </button>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: typeof FiGrid;
  color: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-6 backdrop-blur dark:border-white/10 flex items-center justify-between">
      <div>
        <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{title}</div>
        <div className="mt-2 text-2xl font-bold">{value}</div>
      </div>
      <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-black/5 dark:bg-white/10 ${color}`}>
        <Icon className="text-xl" />
      </span>
    </div>
  );
}
