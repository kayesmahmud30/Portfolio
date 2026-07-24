"use client";

import { useEffect, useState, useCallback, createElement } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import ImageUploader from "@/components/admin/ImageUploader";
import ProjectModal from "@/components/admin/ProjectModal";
import EducationModal from "@/components/admin/EducationModal";
import ExperienceModal from "@/components/admin/ExperienceModal";
import PromptModal from "@/components/admin/PromptModal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import ThemeToggle from "@/components/ThemeToggle";
import { signOut, authClient } from "@/lib/auth-client";
import type { Project, SiteConfig, SkillGroup, EducationItem, ExperienceItem, ContactConfig } from "@/types";
import { getSkillIcon } from "@/lib/skillIcons";
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
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiMenu,
  FiArrowUp,
  FiArrowDown,
  FiMove,
  FiX,
  FiMail,
} from "react-icons/fi";

type Tab = "overview" | "projects" | "profile" | "skills" | "education" | "experience" | "contact";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);

  // Content States
  const [siteInfo, setSiteInfo] = useState<Partial<SiteConfig & { profileImage?: string; bannerImage?: string }>>({});
  const [contactInfo, setContactInfo] = useState<ContactConfig>({ email: "", phone: "", whatsapp: "" });
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [skillsList, setSkillsList] = useState<SkillGroup[]>([]);
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([]);

  // Project Filter
  const [projectSearch, setProjectSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals & UI States
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null);

  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null);

  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // Custom Prompt & Confirm Modal States
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [promptGroupIdx, setPromptGroupIdx] = useState<number | null>(null);

  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Drag & Drop States
  const [dragGroupIdx, setDragGroupIdx] = useState<number | null>(null);
  const [dragSkillLoc, setDragSkillLoc] = useState<{ groupIdx: number; skillIdx: number } | null>(null);

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [siteRes, projectsRes, skillsRes, eduRes, expRes, contactRes] = await Promise.all([
        fetch("/api/admin/site"),
        fetch("/api/admin/projects"),
        fetch("/api/admin/skills"),
        fetch("/api/admin/education"),
        fetch("/api/admin/experience"),
        fetch("/api/admin/contact-config"),
      ]);

      const siteData = await siteRes.json();
      const projectsData = await projectsRes.json();
      const skillsData = await skillsRes.json();
      const eduData = await eduRes.json();
      const expData = await expRes.json();
      const contactData = await contactRes.json();

      if (siteData.ok) setSiteInfo(siteData.data);
      if (projectsData.ok) setProjectsList(projectsData.data);
      if (skillsData.ok) setSkillsList(skillsData.data);
      if (eduData.ok) setEducationList(eduData.data);
      if (expData.ok) setExperienceList(expData.data);
      if (contactData.ok) setContactInfo(contactData.data);
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
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black text-zinc-500 font-medium">
        Authenticating admin session...
      </div>
    );
  }

  // --- Actions: Projects ---
  async function handleSaveProject(projectData: Partial<Project>) {
    try {
      if (editingProject && "_id" in editingProject) {
        const res = await fetch(`/api/admin/projects/${(editingProject as unknown as { _id: string })._id}`, {
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

  function handleDeleteProject(id: string) {
    setConfirmModalState({
      isOpen: true,
      title: "Delete Project",
      message: "Are you sure you want to permanently delete this project from MongoDB?",
      onConfirm: async () => {
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
      },
    });
  }

  // --- Actions: Profile & Banner ---
  async function handleSaveSiteInfo() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteInfo),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      showToast("success", "Profile and site configuration updated.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile.";
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  }

  function handleAddDesignation() {
    if (!newDesignation.trim()) return;
    const current = siteInfo.designationLoop || [];
    setSiteInfo((s) => ({
      ...s,
      designationLoop: [...current, newDesignation.trim()],
    }));
    setNewDesignation("");
  }

  function handleRemoveDesignation(idx: number) {
    const current = siteInfo.designationLoop || [];
    setSiteInfo((s) => ({
      ...s,
      designationLoop: current.filter((_, i) => i !== idx),
    }));
  }

  // --- Actions: Contact Section ---
  async function handleSaveContactInfo() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/contact-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactInfo),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      showToast("success", "Contact section configuration updated.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update contact info.";
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  }

  // --- Actions: Skills ---
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
      showToast("success", "Skill sets updated successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update skills.";
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  }

  function handleAddGroup() {
    if (!newGroupTitle.trim()) return;
    setSkillsList((prev) => [...prev, { title: newGroupTitle.trim(), skills: [] }]);
    setNewGroupTitle("");
  }

  function handleDeleteGroup(groupIdx: number) {
    const group = skillsList[groupIdx];
    setConfirmModalState({
      isOpen: true,
      title: "Delete Skill Category",
      message: `Are you sure you want to delete "${group?.title || "this category"}" and all skills inside it?`,
      onConfirm: () => {
        setSkillsList((prev) => prev.filter((_, idx) => idx !== groupIdx));
        showToast("success", "Category deleted. Click 'Save All Skill Changes' to persist.");
      },
    });
  }

  function handleAddSkillToGroup(groupIdx: number) {
    setPromptGroupIdx(groupIdx);
    setPromptModalOpen(true);
  }

  function handleConfirmAddSkill(name: string) {
    if (promptGroupIdx === null) return;
    setSkillsList((prev) => {
      const copy = [...prev];
      copy[promptGroupIdx] = {
        ...copy[promptGroupIdx],
        skills: [...copy[promptGroupIdx].skills, { name, level: 80 }],
      };
      return copy;
    });
    showToast("success", `Added "${name}". Click 'Save All Skill Changes' to save.`);
  }

  function handleDeleteSkill(groupIdx: number, skillIdx: number) {
    setSkillsList((prev) => {
      const copy = [...prev];
      copy[groupIdx] = {
        ...copy[groupIdx],
        skills: copy[groupIdx].skills.filter((_, idx) => idx !== skillIdx),
      };
      return copy;
    });
  }

  function handleSkillLevelChange(groupIdx: number, skillIdx: number, level: number) {
    setSkillsList((prev) => {
      const copy = [...prev];
      const skillsCopy = [...copy[groupIdx].skills];
      skillsCopy[skillIdx] = { ...skillsCopy[skillIdx], level };
      copy[groupIdx] = { ...copy[groupIdx], skills: skillsCopy };
      return copy;
    });
  }

  // --- Drag & Drop: Group Re-ordering (GitHub Pinned Repos Style) ---
  function handleGroupDragStart(e: React.DragEvent, idx: number) {
    setDragGroupIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleGroupDragOver(e: React.DragEvent, targetIdx: number) {
    e.preventDefault();
    if (dragGroupIdx === null || dragGroupIdx === targetIdx) return;

    setSkillsList((prev) => {
      const copy = [...prev];
      const [draggedItem] = copy.splice(dragGroupIdx, 1);
      copy.splice(targetIdx, 0, draggedItem);
      return copy;
    });
    setDragGroupIdx(targetIdx);
  }

  function handleGroupDragEnd() {
    setDragGroupIdx(null);
  }

  // --- Drag & Drop: Skill Item Re-ordering ---
  function handleSkillDragStart(e: React.DragEvent, groupIdx: number, skillIdx: number) {
    e.stopPropagation();
    setDragSkillLoc({ groupIdx, skillIdx });
    e.dataTransfer.effectAllowed = "move";
  }

  function handleSkillDragOver(e: React.DragEvent, targetGroupIdx: number, targetSkillIdx: number) {
    e.preventDefault();
    e.stopPropagation();
    if (!dragSkillLoc) return;
    if (dragSkillLoc.groupIdx === targetGroupIdx && dragSkillLoc.skillIdx === targetSkillIdx) return;

    setSkillsList((prev) => {
      const copy = [...prev];
      const sourceSkills = [...copy[dragSkillLoc.groupIdx].skills];
      const [movedSkill] = sourceSkills.splice(dragSkillLoc.skillIdx, 1);

      if (dragSkillLoc.groupIdx === targetGroupIdx) {
        sourceSkills.splice(targetSkillIdx, 0, movedSkill);
        copy[targetGroupIdx] = { ...copy[targetGroupIdx], skills: sourceSkills };
      } else {
        const destSkills = [...copy[targetGroupIdx].skills];
        destSkills.splice(targetSkillIdx, 0, movedSkill);
        copy[dragSkillLoc.groupIdx] = { ...copy[dragSkillLoc.groupIdx], skills: sourceSkills };
        copy[targetGroupIdx] = { ...copy[targetGroupIdx], skills: destSkills };
      }
      return copy;
    });

    setDragSkillLoc({ groupIdx: targetGroupIdx, skillIdx: targetSkillIdx });
  }

  function handleSkillDragEnd(e: React.DragEvent) {
    e.stopPropagation();
    setDragSkillLoc(null);
  }

  function handleMoveGroupUp(groupIdx: number) {
    if (groupIdx === 0) return;
    setSkillsList((prev) => {
      const copy = [...prev];
      const temp = copy[groupIdx - 1];
      copy[groupIdx - 1] = copy[groupIdx];
      copy[groupIdx] = temp;
      return copy;
    });
  }

  function handleMoveGroupDown(groupIdx: number) {
    if (groupIdx === skillsList.length - 1) return;
    setSkillsList((prev) => {
      const copy = [...prev];
      const temp = copy[groupIdx + 1];
      copy[groupIdx + 1] = copy[groupIdx];
      copy[groupIdx] = temp;
      return copy;
    });
  }

  function handleMoveSkillUp(groupIdx: number, skillIdx: number) {
    if (skillIdx === 0) return;
    setSkillsList((prev) => {
      const copy = [...prev];
      const skillsCopy = [...copy[groupIdx].skills];
      const temp = skillsCopy[skillIdx - 1];
      skillsCopy[skillIdx - 1] = skillsCopy[skillIdx];
      skillsCopy[skillIdx] = temp;
      copy[groupIdx] = { ...copy[groupIdx], skills: skillsCopy };
      return copy;
    });
  }

  function handleMoveSkillDown(groupIdx: number, skillIdx: number) {
    if (skillIdx === skillsList[groupIdx].skills.length - 1) return;
    setSkillsList((prev) => {
      const copy = [...prev];
      const skillsCopy = [...copy[groupIdx].skills];
      const temp = skillsCopy[skillIdx + 1];
      skillsCopy[skillIdx + 1] = skillsCopy[skillIdx];
      skillsCopy[skillIdx] = temp;
      copy[groupIdx] = { ...copy[groupIdx], skills: skillsCopy };
      return copy;
    });
  }

  // --- Actions: Education ---
  async function handleSaveEducationList(newList: EducationItem[]) {
    try {
      const res = await fetch("/api/admin/education", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newList),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setEducationList(newList);
      showToast("success", "Education history updated successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save education.";
      showToast("error", msg);
    }
  }

  function handleSaveEduItem(item: EducationItem) {
    if (editingEduIndex !== null) {
      const updated = [...educationList];
      updated[editingEduIndex] = item;
      handleSaveEducationList(updated);
    } else {
      handleSaveEducationList([item, ...educationList]);
    }
  }

  function handleDeleteEducation(index: number) {
    const item = educationList[index];
    setConfirmModalState({
      isOpen: true,
      title: "Delete Education Entry",
      message: `Are you sure you want to delete "${item?.degree || item?.institution || "this entry"}"?`,
      onConfirm: () => {
        const updated = educationList.filter((_, idx) => idx !== index);
        handleSaveEducationList(updated);
      },
    });
  }

  // --- Actions: Experience ---
  async function handleSaveExperienceList(newList: ExperienceItem[]) {
    try {
      const res = await fetch("/api/admin/experience", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newList),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setExperienceList(newList);
      showToast("success", "Work experience updated successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save experience.";
      showToast("error", msg);
    }
  }

  function handleSaveExpItem(item: ExperienceItem) {
    if (editingExpIndex !== null) {
      const updated = [...experienceList];
      updated[editingExpIndex] = item;
      handleSaveExperienceList(updated);
    } else {
      handleSaveExperienceList([item, ...experienceList]);
    }
  }

  function handleDeleteExperience(index: number) {
    const item = experienceList[index];
    setConfirmModalState({
      isOpen: true,
      title: "Delete Experience Entry",
      message: `Are you sure you want to delete "${item?.role || item?.company || "this entry"}"?`,
      onConfirm: () => {
        const updated = experienceList.filter((_, idx) => idx !== index);
        handleSaveExperienceList(updated);
      },
    });
  }

  const filteredProjects = projectsList.filter((p) =>
    p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.tags?.some((t) => t.toLowerCase().includes(projectSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-950 dark:text-zinc-50 pb-16">
      {/* Toast Notification */}
      {toast ? (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3.5 shadow-2xl text-xs font-semibold backdrop-blur ${
            toast.type === "success"
              ? "bg-emerald-500/90 text-white dark:bg-emerald-600/90"
              : "bg-rose-500/90 text-white dark:bg-rose-600/90"
          }`}
        >
          {toast.type === "success" ? <FiCheckCircle className="text-base shrink-0" /> : <FiAlertCircle className="text-base shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      ) : null}

      {/* Header Bar */}
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/80">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
              <FiShield className="text-[18px]" />
            </span>
            <div>
              <h1 className="text-base font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Full MongoDB Portfolio Control</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              onClick={async () => {
                await signOut();
                router.push("/admin-portal/login");
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/5 px-3.5 py-1.5 text-xs font-semibold transition hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <FiLogOut />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </Container>
      </header>

      {/* Main Content & Responsive Navigation */}
      <Container className="mt-6 sm:mt-8 space-y-6">
        {/* Mobile Navigation Dropdown Menu (For Smaller Devices < md) */}
        <div className="relative md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-3xl border border-black/10 bg-[var(--card)] px-5 py-3.5 text-xs font-bold backdrop-blur shadow-sm dark:border-white/10"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                {activeTab === "overview" && <FiGrid className="text-sm" />}
                {activeTab === "projects" && <FiLayers className="text-sm" />}
                {activeTab === "profile" && <FiUser className="text-sm" />}
                {activeTab === "skills" && <FiBookOpen className="text-sm" />}
                {activeTab === "education" && <FiBookOpen className="text-sm" />}
                {activeTab === "experience" && <FiBriefcase className="text-sm" />}
                {activeTab === "contact" && <FiMail className="text-sm" />}
              </span>
              <span className="capitalize">{activeTab} Management</span>
            </div>

            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px] font-semibold">Select Section</span>
              {mobileMenuOpen ? <FiChevronUp className="text-base" /> : <FiChevronDown className="text-base" />}
            </div>
          </button>

          {mobileMenuOpen ? (
            <div className="absolute left-0 right-0 top-full z-40 mt-2 space-y-1 rounded-3xl border border-black/10 bg-[var(--card)] p-2 shadow-2xl backdrop-blur dark:border-white/10">
              {[
                { id: "overview", label: "Overview", icon: FiGrid, count: null },
                { id: "projects", label: "Projects", icon: FiLayers, count: projectsList.length },
                { id: "profile", label: "Profile & Banner", icon: FiUser, count: null },
                { id: "skills", label: "Skills Manager", icon: FiBookOpen, count: null },
                { id: "education", label: "Education History", icon: FiBookOpen, count: educationList.length },
                { id: "experience", label: "Work Experience", icon: FiBriefcase, count: experienceList.length },
                { id: "contact", label: "Contact Info", icon: FiMail, count: null },
              ].map((tabItem) => {
                const IconComp = tabItem.icon;
                const isActive = activeTab === tabItem.id;
                return (
                  <button
                    key={tabItem.id}
                    onClick={() => {
                      setActiveTab(tabItem.id as Tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-xs font-semibold transition ${
                      isActive
                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                        : "text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className="text-sm" />
                      <span>{tabItem.label}</span>
                    </div>
                    {tabItem.count !== null ? (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white dark:bg-black/20 dark:text-zinc-950"
                            : "bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300"
                        }`}
                      >
                        {tabItem.count}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Desktop Navigation Tabs (Visible on md+) */}
        <div className="hidden md:flex overflow-x-auto rounded-3xl border border-black/10 bg-[var(--card)] p-1.5 backdrop-blur dark:border-white/10 scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "overview"
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md"
                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            }`}
          >
            <FiGrid /> Overview
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "projects"
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md"
                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            }`}
          >
            <FiLayers /> Projects ({projectsList.length})
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "profile"
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md"
                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            }`}
          >
            <FiUser /> Profile & Banner
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "skills"
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md"
                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            }`}
          >
            <FiBookOpen /> Skills Manager
          </button>

          <button
            onClick={() => setActiveTab("education")}
            className={`flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "education"
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md"
                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            }`}
          >
            <FiBookOpen /> Education ({educationList.length})
          </button>

          <button
            onClick={() => setActiveTab("experience")}
            className={`flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "experience"
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md"
                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            }`}
          >
            <FiBriefcase /> Experience ({experienceList.length})
          </button>
          
          <button
            onClick={() => setActiveTab("contact")}
            className={`flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === "contact"
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md"
                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            }`}
          >
            <FiMail /> Contact Info
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" ? (
          <div className="space-y-6">
            {/* Stat Metrics Grid */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-5 backdrop-blur dark:border-white/10">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total Projects</span>
                <div className="mt-2 text-2xl font-extrabold">{projectsList.length}</div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-5 backdrop-blur dark:border-white/10">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Skill Categories</span>
                <div className="mt-2 text-2xl font-extrabold">{skillsList.length}</div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-5 backdrop-blur dark:border-white/10">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total Skills</span>
                <div className="mt-2 text-2xl font-extrabold">
                  {skillsList.reduce((acc, g) => acc + (g.skills?.length || 0), 0)}
                </div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-5 backdrop-blur dark:border-white/10">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Education Entries</span>
                <div className="mt-2 text-2xl font-extrabold">{educationList.length}</div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-5 backdrop-blur dark:border-white/10 col-span-2 sm:col-span-1">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Work Experience</span>
                <div className="mt-2 text-2xl font-extrabold">{experienceList.length}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-6 backdrop-blur dark:border-white/10 space-y-4">
              <h2 className="text-base font-bold">Quick Management Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                >
                  <FiPlus /> Add Project
                </button>

                <button
                  onClick={() => setActiveTab("skills")}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/40 px-5 py-2.5 text-xs font-semibold transition hover:bg-white/60 dark:border-white/10 dark:bg-zinc-900/30 dark:hover:bg-zinc-900/50"
                >
                  <FiBookOpen /> Manage Skills
                </button>

                <button
                  onClick={() => {
                    setEditingEduIndex(null);
                    setEduModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/40 px-5 py-2.5 text-xs font-semibold transition hover:bg-white/60 dark:border-white/10 dark:bg-zinc-900/30 dark:hover:bg-zinc-900/50"
                >
                  <FiPlus /> Add Education
                </button>

                <button
                  onClick={() => {
                    setEditingExpIndex(null);
                    setExpModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/40 px-5 py-2.5 text-xs font-semibold transition hover:bg-white/60 dark:border-white/10 dark:bg-zinc-900/30 dark:hover:bg-zinc-900/50"
                >
                  <FiPlus /> Add Experience
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* TAB 2: PROJECTS */}
        {activeTab === "projects" ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="Search projects by title or tag..."
                  className="w-full rounded-2xl border border-black/10 bg-white/40 pl-11 pr-4 py-2.5 text-xs outline-none transition focus:border-indigo-500 dark:border-white/10 dark:bg-zinc-900/30"
                />
              </div>

              <button
                onClick={() => {
                  setEditingProject(null);
                  setProjectModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
              >
                <FiPlus /> Add New Project
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs text-zinc-500">Loading projects from MongoDB...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12 text-xs text-zinc-500">No projects found. Add one above!</div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((p) => (
                  <div
                    key={(p as { _id?: string })._id || p.slug}
                    className="flex flex-col justify-between rounded-3xl border border-black/10 bg-[var(--card)] p-5 backdrop-blur dark:border-white/10"
                  >
                    <div>
                      <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                      </div>
                      <h3 className="mt-3 text-sm font-bold tracking-tight">{p.title}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">{p.summary}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.tags?.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium dark:bg-white/10"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/10">
                      <a
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        View <FiExternalLink />
                      </a>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProject(p);
                            setProjectModalOpen(true);
                          }}
                          className="rounded-xl border border-black/10 p-2 text-xs font-semibold hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteProject((p as unknown as { _id: string })._id)}
                          className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* TAB 3: PROFILE & BANNER */}
        {activeTab === "profile" ? (
          <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-6 backdrop-blur dark:border-white/10 space-y-6">
            <h2 className="text-base font-bold">Edit Profile & Banner Details</h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Name</label>
                <input
                  type="text"
                  value={siteInfo.name || ""}
                  onChange={(e) => setSiteInfo((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Kayes Mahmud"
                  className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-xs outline-none dark:border-white/10 dark:bg-zinc-900/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Location</label>
                <input
                  type="text"
                  value={siteInfo.location || ""}
                  onChange={(e) => setSiteInfo((s) => ({ ...s, location: e.target.value }))}
                  placeholder="Narayanganj, Dhaka, Bangladesh"
                  className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-xs outline-none dark:border-white/10 dark:bg-zinc-900/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">Intro / Bio</label>
              <textarea
                rows={3}
                value={siteInfo.intro || ""}
                onChange={(e) => setSiteInfo((s) => ({ ...s, intro: e.target.value }))}
                placeholder="Front-End Developer building fast, accessible web apps..."
                className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-xs outline-none dark:border-white/10 dark:bg-zinc-900/30 resize-none"
              />
            </div>

            {/* Hero Section Designation Titles (Typewriter Loop) */}
            <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/10">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Hero Section Designation Titles (Typewriter Loop)
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  These titles loop one-by-one in the Hero section typewriter animation on your homepage.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDesignation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                  placeholder="Add role title (e.g. Next.js & React Developer)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddDesignation();
                    }
                  }}
                  className="w-full max-w-md rounded-2xl border border-black/10 bg-white/40 px-4 py-2.5 text-xs outline-none dark:border-white/10 dark:bg-zinc-900/30"
                />
                <button
                  type="button"
                  onClick={handleAddDesignation}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                >
                  <FiPlus /> Add Title
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {(siteInfo.designationLoop || []).map((title, idx) => (
                  <span
                    key={title + idx}
                    className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-zinc-100 px-3.5 py-1.5 text-xs font-semibold text-zinc-800 backdrop-blur dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
                  >
                    <span>{title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDesignation(idx)}
                      className="rounded-full p-0.5 text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/20"
                      title="Remove title"
                    >
                      <FiX className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Images Upload */}
            <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-black/5 dark:border-white/10">
              <ImageUploader
                label="Profile Photo (Cloudinary)"
                currentUrl={siteInfo.profileImage}
                onUpload={(url) => setSiteInfo((s) => ({ ...s, profileImage: url }))}
              />
              <ImageUploader
                label="Hero Banner Image (Cloudinary)"
                currentUrl={siteInfo.bannerImage}
                onUpload={(url) => setSiteInfo((s) => ({ ...s, bannerImage: url }))}
              />
            </div>

            {/* Social Media Links */}
            <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Social Media Links</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">GitHub URL</label>
                  <input
                    type="url"
                    value={siteInfo.socials?.github || ""}
                    onChange={(e) =>
                      setSiteInfo((s) => ({ ...s, socials: { ...s.socials, github: e.target.value } }))
                    }
                    placeholder="https://github.com/kayesmahmud30"
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-2.5 text-xs outline-none dark:border-white/10 dark:bg-zinc-900/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">LinkedIn URL</label>
                  <input
                    type="url"
                    value={siteInfo.socials?.linkedin || ""}
                    onChange={(e) =>
                      setSiteInfo((s) => ({ ...s, socials: { ...s.socials, linkedin: e.target.value } }))
                    }
                    placeholder="https://linkedin.com/in/kayesmahmud"
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-2.5 text-xs outline-none dark:border-white/10 dark:bg-zinc-900/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Twitter / X URL</label>
                  <input
                    type="url"
                    value={siteInfo.socials?.twitter || ""}
                    onChange={(e) =>
                      setSiteInfo((s) => ({ ...s, socials: { ...s.socials, twitter: e.target.value } }))
                    }
                    placeholder="https://x.com/kayesmahmud"
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-2.5 text-xs outline-none dark:border-white/10 dark:bg-zinc-900/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Facebook URL</label>
                  <input
                    type="url"
                    value={siteInfo.socials?.facebook || ""}
                    onChange={(e) =>
                      setSiteInfo((s) => ({ ...s, socials: { ...s.socials, facebook: e.target.value } }))
                    }
                    placeholder="https://facebook.com/kayesmahmud"
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-2.5 text-xs outline-none dark:border-white/10 dark:bg-zinc-900/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">YouTube Channel URL</label>
                  <input
                    type="url"
                    value={siteInfo.socials?.youtube || ""}
                    onChange={(e) =>
                      setSiteInfo((s) => ({ ...s, socials: { ...s.socials, youtube: e.target.value } }))
                    }
                    placeholder="https://youtube.com/@kayesmahmud"
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-2.5 text-xs outline-none dark:border-white/10 dark:bg-zinc-900/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Instagram Profile URL</label>
                  <input
                    type="url"
                    value={siteInfo.socials?.instagram || ""}
                    onChange={(e) =>
                      setSiteInfo((s) => ({ ...s, socials: { ...s.socials, instagram: e.target.value } }))
                    }
                    placeholder="https://instagram.com/kayesmahmud"
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-2.5 text-xs outline-none dark:border-white/10 dark:bg-zinc-900/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">LeetCode Profile URL</label>
                  <input
                    type="url"
                    value={siteInfo.socials?.leetcode || ""}
                    onChange={(e) =>
                      setSiteInfo((s) => ({ ...s, socials: { ...s.socials, leetcode: e.target.value } }))
                    }
                    placeholder="https://leetcode.com/kayesmahmud"
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-2.5 text-xs outline-none dark:border-white/10 dark:bg-zinc-900/30"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveSiteInfo}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-xs font-semibold text-white transition hover:bg-zinc-900 disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
              >
                <FiSave />
                <span>{saving ? "Saving..." : "Save Profile & Banner"}</span>
              </button>
            </div>
          </div>
        ) : null}

        {/* TAB 4: SKILLS MANAGER */}
        {activeTab === "skills" ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-black/10 bg-[var(--card)] p-5 backdrop-blur dark:border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  placeholder="New Category (e.g. Database)"
                  className="rounded-2xl border border-black/10 bg-white/40 px-4 py-2 text-xs outline-none dark:border-white/10 dark:bg-zinc-900/30"
                />
                <button
                  onClick={handleAddGroup}
                  className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                >
                  <FiPlus /> Add Group
                </button>
              </div>

              <button
                onClick={handleSaveSkills}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <FiSave />
                <span>{saving ? "Saving..." : "Save All Skill Changes"}</span>
              </button>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {skillsList.map((group, groupIdx) => {
                const isGroupDragging = dragGroupIdx === groupIdx;

                return (
                  <div
                    key={group.title + groupIdx}
                    draggable
                    onDragStart={(e) => handleGroupDragStart(e, groupIdx)}
                    onDragOver={(e) => handleGroupDragOver(e, groupIdx)}
                    onDragEnd={handleGroupDragEnd}
                    className={`group rounded-3xl border bg-[var(--card)] p-5 backdrop-blur space-y-4 transition-all duration-200 cursor-grab active:cursor-grabbing ${
                      isGroupDragging
                        ? "border-dashed border-indigo-500 bg-indigo-500/5 shadow-2xl scale-[1.02] opacity-85"
                        : "border-black/10 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-black/5 pb-3 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="grid h-6 w-6 place-items-center rounded-lg bg-black/5 text-zinc-500 dark:bg-white/10 dark:text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition">
                          <FiMove className="text-xs shrink-0" />
                        </span>
                        <h3 className="text-sm font-bold tracking-tight">{group.title}</h3>
                      </div>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleMoveGroupUp(groupIdx)}
                          disabled={groupIdx === 0}
                          className="rounded-xl border border-black/10 p-1.5 text-xs font-semibold hover:bg-black/5 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/10"
                          title="Move group left / up"
                        >
                          <FiArrowUp />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveGroupDown(groupIdx)}
                          disabled={groupIdx === skillsList.length - 1}
                          className="rounded-xl border border-black/10 p-1.5 text-xs font-semibold hover:bg-black/5 disabled:opacity-30 dark:border-white/10 dark:hover:bg-white/10"
                          title="Move group right / down"
                        >
                          <FiArrowDown />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddSkillToGroup(groupIdx)}
                          className="rounded-xl border border-black/10 p-1.5 text-xs font-semibold hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                          title="Add skill to this group"
                        >
                          <FiPlus />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGroup(groupIdx)}
                          className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                          title="Delete group"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {group.skills?.map((skill, skillIdx) => {
                        const isSkillDragging =
                          dragSkillLoc?.groupIdx === groupIdx && dragSkillLoc?.skillIdx === skillIdx;

                        const skillIcon = getSkillIcon(skill.name);

                        return (
                          <div
                            key={skill.name + skillIdx}
                            draggable
                            onDragStart={(e) => handleSkillDragStart(e, groupIdx, skillIdx)}
                            onDragOver={(e) => handleSkillDragOver(e, groupIdx, skillIdx)}
                            onDragEnd={handleSkillDragEnd}
                            className={`rounded-2xl border p-3 transition-all duration-150 cursor-grab active:cursor-grabbing ${
                              isSkillDragging
                                ? "border-dashed border-indigo-500 bg-indigo-500/10 shadow-lg scale-[1.01]"
                                : "border-black/5 bg-white/40 hover:bg-white/60 dark:border-white/10 dark:bg-zinc-900/30 dark:hover:bg-zinc-900/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FiMove className="text-xs text-zinc-400 shrink-0" />
                                {createElement(skillIcon, {
                                  className: "text-sm text-indigo-600 dark:text-indigo-400 shrink-0",
                                })}
                                <span className="text-xs font-semibold">{skill.name}</span>
                              </div>
                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => handleMoveSkillUp(groupIdx, skillIdx)}
                                  disabled={skillIdx === 0}
                                  className="text-zinc-500 hover:text-zinc-950 disabled:opacity-20 dark:hover:text-zinc-50 text-xs p-1"
                                  title="Move skill up"
                                >
                                  <FiArrowUp />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveSkillDown(groupIdx, skillIdx)}
                                  disabled={skillIdx === group.skills.length - 1}
                                  className="text-zinc-500 hover:text-zinc-950 disabled:opacity-20 dark:hover:text-zinc-50 text-xs p-1"
                                  title="Move skill down"
                                >
                                  <FiArrowDown />
                                </button>
                                <span className="ml-1 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                  {skill.level}%
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSkill(groupIdx, skillIdx)}
                                  className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 text-xs p-1"
                                  title="Delete skill"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={skill.level}
                              onChange={(e) =>
                                handleSkillLevelChange(groupIdx, skillIdx, parseInt(e.target.value, 10))
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="mt-2 w-full accent-indigo-600 cursor-pointer"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* TAB 5: EDUCATION MANAGER */}
        {activeTab === "education" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Education History</h2>
              <button
                onClick={() => {
                  setEditingEduIndex(null);
                  setEduModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
              >
                <FiPlus /> Add Education
              </button>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {educationList.map((item, idx) => (
                <div
                  key={item.institution + idx}
                  className="flex flex-col justify-between rounded-3xl border border-black/10 bg-[var(--card)] p-5 backdrop-blur dark:border-white/10"
                >
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {item.year}
                    </span>
                    <h3 className="mt-1 text-sm font-bold">{item.institution}</h3>
                    <p className="mt-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">{item.degree}</p>
                    <p className="mt-2 text-xs leading-5 text-zinc-600 dark:text-zinc-400">{item.description}</p>
                  </div>

                  <div className="mt-4 flex justify-end gap-2 pt-3 border-t border-black/5 dark:border-white/10">
                    <button
                      onClick={() => {
                        setEditingEduIndex(idx);
                        setEduModalOpen(true);
                      }}
                      className="rounded-xl border border-black/10 p-2 text-xs font-semibold hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteEducation(idx)}
                      className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* TAB 6: EXPERIENCE MANAGER */}
        {activeTab === "experience" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Work Experience</h2>
              <button
                onClick={() => {
                  setEditingExpIndex(null);
                  setExpModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
              >
                <FiPlus /> Add Experience
              </button>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {experienceList.map((item, idx) => (
                <div
                  key={item.company + idx}
                  className="flex flex-col justify-between rounded-3xl border border-black/10 bg-[var(--card)] p-5 backdrop-blur dark:border-white/10"
                >
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {item.duration}
                    </span>
                    <h3 className="mt-1 text-sm font-bold">{item.company}</h3>
                    <p className="mt-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">{item.role}</p>
                    {item.responsibilities?.length ? (
                      <ul className="mt-2 list-disc pl-4 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {item.responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  <div className="mt-4 flex justify-end gap-2 pt-3 border-t border-black/5 dark:border-white/10">
                    <button
                      onClick={() => {
                        setEditingExpIndex(idx);
                        setExpModalOpen(true);
                      }}
                      className="rounded-xl border border-black/10 p-2 text-xs font-semibold hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(idx)}
                      className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* TAB 7: CONTACT SECTION */}
        {activeTab === "contact" ? (
          <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-6 backdrop-blur dark:border-white/10 space-y-6">
            <div>
              <h2 className="text-base font-bold">Edit Contact Section Details</h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Manage contact info for your portfolio. If an optional field (like WhatsApp or Phone) is left empty, it will be automatically hidden from the public view.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={contactInfo.email || ""}
                  onChange={(e) => setContactInfo((c) => ({ ...c, email: e.target.value }))}
                  placeholder="mahmudkayes30@gmail.com"
                  className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-xs outline-none dark:border-white/10 dark:bg-zinc-900/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  Contact Phone Number <span className="font-normal text-zinc-400">(Optional - Leave empty to hide)</span>
                </label>
                <input
                  type="text"
                  value={contactInfo.phone || ""}
                  onChange={(e) => setContactInfo((c) => ({ ...c, phone: e.target.value }))}
                  placeholder="+8801931835697"
                  className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-xs outline-none dark:border-white/10 dark:bg-zinc-900/30"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  WhatsApp Number / Direct Link <span className="font-normal text-zinc-400">(Optional - Leave empty to hide)</span>
                </label>
                <input
                  type="text"
                  value={contactInfo.whatsapp || ""}
                  onChange={(e) => setContactInfo((c) => ({ ...c, whatsapp: e.target.value }))}
                  placeholder="+8801931835697 or https://wa.me/8801931835697"
                  className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white/40 px-4 py-3 text-xs outline-none dark:border-white/10 dark:bg-zinc-900/30"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-black/5 dark:border-white/10">
              <button
                onClick={handleSaveContactInfo}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <FiSave />
                <span>{saving ? "Saving..." : "Save Contact Info"}</span>
              </button>
            </div>
          </div>
        ) : null}
      </Container>

      {/* Modals */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSave={handleSaveProject}
        project={editingProject}
      />

      <EducationModal
        isOpen={eduModalOpen}
        onClose={() => setEduModalOpen(false)}
        onSave={handleSaveEduItem}
        initialItem={editingEduIndex !== null ? educationList[editingEduIndex] : null}
      />

      <ExperienceModal
        isOpen={expModalOpen}
        onClose={() => setExpModalOpen(false)}
        onSave={handleSaveExpItem}
        initialItem={editingExpIndex !== null ? experienceList[editingExpIndex] : null}
      />

      {/* Custom Prompt Modal for Adding Skill */}
      <PromptModal
        isOpen={promptModalOpen}
        title="Add New Skill"
        subtitle="Type skill name to automatically detect its official brand icon (e.g. TypeScript, MongoDB, Docker)."
        placeholder="e.g. TypeScript"
        confirmText="Add Skill"
        onClose={() => setPromptModalOpen(false)}
        onSubmit={handleConfirmAddSkill}
      />

      {/* Custom Confirmation Modal for Deletions */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        onClose={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModalState.onConfirm}
      />
    </div>
  );
}
