"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  FileText,
  Compass,
  Palette,
  Eye,
  Send,
  Trash2,
  Copy,
  Plus,
  ArrowLeft,
  Settings,
  History,
  FileCode,
  Layers,
  Clock,
  FolderOpen,
  Image as ImageIcon,
  Film,
  Type,
  FileUp,
  RotateCcw,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import type { UserSession } from "@/lib/session";
import { FloatingBlobs, GrainOverlay } from "@/components/klin/FloatingBlobs";
import { Input } from "@/components/ui/input";
import { WebsitePreview } from "./WebsitePreview";

type WebsiteDashboardProps = {
  websiteId: string;
  user: UserSession | null;
  onNavigate: (path: string) => void;
};

export function WebsiteDashboard({ websiteId, user, onNavigate }: WebsiteDashboardProps) {
  const [website, setWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState("overview");

  // Local state for settings subdivision
  const [activeSettingSection, setActiveSettingSection] = useState("general");

  // Local state for simulator preview
  const [showLivePreviewSimulator, setShowLivePreviewSimulator] = useState(false);

  // Lists states
  const [pages, setPages] = useState<any[]>([]);
  const [navigation, setNavigation] = useState<any[]>([]);
  const [theme, setTheme] = useState<any>({ colors: {} });
  const [seo, setSeo] = useState<any>({ title: "", description: "", keywords: [] });
  const [settings, setSettings] = useState<any>({ subdomain: "", customDomain: "", localization: {} });
  const [deployments, setDeployments] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  
  // Publish Validation Issues
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  // Asset folder view
  const [selectedAssetFolder, setSelectedAssetFolder] = useState<"images" | "videos" | "fonts" | "svg" | "documents">("images");

  // Mock Assets data structure
  const [assetsList, setAssetsList] = useState({
    images: [
      { name: "hero-bg.jpg", size: "1.2 MB", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8" },
      { name: "logo-dark.png", size: "45 KB", url: "https://placehold.co/150x50" }
    ],
    videos: [
      { name: "product-tour.mp4", size: "18.5 MB", url: "/assets/hero-bg.mp4" }
    ],
    fonts: [
      { name: "InstrumentSerif-Regular.woff2", size: "82 KB", url: "#" },
      { name: "Inter-Variable.woff2", size: "140 KB", url: "#" }
    ],
    svg: [
      { name: "chevron-right.svg", size: "1.2 KB", url: "#" },
      { name: "shopping-bag.svg", size: "2.4 KB", url: "#" }
    ],
    documents: [
      { name: "privacy-policy.pdf", size: "320 KB", url: "#" }
    ]
  });

  // Page Creator Modal
  const [showPageModal, setShowPageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");

  const fetchWebsiteData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}`, {
        headers: { "Authorization": `Bearer ${user?.token}` }
      });
      if (!res.ok) throw new Error("Failed to load website configuration");
      const result = await res.json();
      if (result.success) {
        setWebsite(result.website);
        setPages(result.website.pages || []);
        setNavigation(result.website.navigation || []);
        setTheme(result.website.theme || { colors: {} });
        setSeo(result.website.seo || { title: "", description: "" });
        setSettings(result.website.settings || { subdomain: "", customDomain: "", localization: {} });
      } else {
        throw new Error(result.error || "Failed to load website");
      }
    } catch (err: any) {
      setError(err.message || "Failed to retrieve details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token && websiteId) {
      fetchWebsiteData();
    }
  }, [websiteId, user?.token]);

  // Fetch deployments
  const fetchDeployments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/deployments`, {
        headers: { "Authorization": `Bearer ${user?.token}` }
      });
      const result = await res.json();
      if (result.success) {
        setDeployments(result.deployments || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user?.token && activeSubTab === "deployments") {
      fetchDeployments();
    }
  }, [websiteId, activeSubTab, user?.token]);

  // Fetch activities
  const fetchActivities = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/activity`, {
        headers: { "Authorization": `Bearer ${user?.token}` }
      });
      const result = await res.json();
      if (result.success) {
        setActivities(result.activities || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user?.token && activeSubTab === "activity") {
      fetchActivities();
    }
  }, [websiteId, activeSubTab, user?.token]);

  const handleUpdateWebsite = async (updatedData: any) => {
    if (!user?.token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setWebsite((prev: any) => ({ ...prev, ...updatedData }));
      }
    } catch (e) {
      console.error("Save website state failed", e);
    }
  };

  const handleSaveSettingsSection = async (section: string, payload: any) => {
    if (!user?.token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/settings/${section}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert(`${section.toUpperCase()} settings saved successfully.`);
        fetchWebsiteData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublish = async () => {
    if (!user?.token) return;
    setPublishing(true);
    setValidationIssues([]);
    try {
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ environment: "Production" })
      });
      const result = await res.json();
      if (result.success) {
        alert("Website published successfully! Static snapshot deployed.");
        fetchWebsiteData();
      } else {
        if (result.issues) {
          setValidationIssues(result.issues);
        } else {
          alert("Publish failed: " + result.error);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPublishing(false);
    }
  };

  const handleRollback = async (snapshotId: string) => {
    if (!user?.token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/deployments/rollback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ snapshotId })
      });
      const result = await res.json();
      if (result.success) {
        alert("Rollback trigger initiated successfully! Restored snapshots.");
        fetchWebsiteData();
        fetchDeployments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Page Managers
  const handleAddPage = async () => {
    if (!newPageTitle || !newPageSlug) return;
    const updatedPages = [...pages, { title: newPageTitle, slug: newPageSlug, builderJson: { content: [], root: {} } }];
    setPages(updatedPages);
    await handleUpdateWebsite({ pages: updatedPages });
    setShowPageModal(false);
    setNewPageTitle("");
    setNewPageSlug("");
  };

  const handleDeletePage = async (slug: string) => {
    const updatedPages = pages.filter((p) => p.slug !== slug);
    setPages(updatedPages);
    await handleUpdateWebsite({ pages: updatedPages });
  };

  const handleDuplicatePage = async (page: any) => {
    const updatedPages = [...pages, { ...page, title: `${page.title} (Copy)`, slug: `${page.slug}-copy` }];
    setPages(updatedPages);
    await handleUpdateWebsite({ pages: updatedPages });
  };

  // Nav Item Add Helper
  const handleAddNavItem = async (navIndex: number) => {
    const nextNav = [...navigation];
    nextNav[navIndex].links.push({ label: "New Link", href: "/home" });
    setNavigation(nextNav);
    await handleUpdateWebsite({ navigation: nextNav });
  };

  const handleUpdateNavItem = async (navIndex: number, linkIndex: number, field: string, val: string) => {
    const nextNav = [...navigation];
    nextNav[navIndex].links[linkIndex][field] = val;
    setNavigation(nextNav);
    await handleUpdateWebsite({ navigation: nextNav });
  };

  const handleDeleteNavItem = async (navIndex: number, linkIndex: number) => {
    const nextNav = [...navigation];
    nextNav[navIndex].links.splice(linkIndex, 1);
    setNavigation(nextNav);
    await handleUpdateWebsite({ navigation: nextNav });
  };

  // Theme Toggler
  const handleThemeColorChange = async (colorKey: string, hexCode: string) => {
    const updatedTheme = {
      ...theme,
      colors: {
        ...theme.colors,
        [colorKey]: hexCode
      }
    };
    setTheme(updatedTheme);
    await handleUpdateWebsite({ theme: updatedTheme });
  };

  if (showLivePreviewSimulator) {
    return <WebsitePreview websiteId={websiteId} onBack={() => setShowLivePreviewSimulator(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] text-[#0F1020] flex items-center justify-center relative overflow-hidden">
        <FloatingBlobs />
        <GrainOverlay />
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="w-10 h-10 border-2 border-black/10 border-t-[#0F1020] rounded-full animate-spin" />
          <p className="text-[#0F1020]/60 text-sm font-mono">Retrieving cloned template details...</p>
        </div>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] text-[#0F1020] flex items-center justify-center p-6 relative overflow-hidden">
        <FloatingBlobs />
        <GrainOverlay />
        <div className="text-center space-y-4 max-w-md bg-white border border-black/5 shadow-2xl rounded-[32px] p-8 z-10">
          <h2 className="text-xl font-bold">Failed to load Dashboard</h2>
          <p className="text-[#0F1020]/60 text-sm">{error || "Missing configuration"}</p>
          <button
            onClick={() => onNavigate("/dashboard/website")}
            className="w-full py-3 bg-[#0F1020] text-white font-semibold rounded-xl text-sm"
          >
            Back to Websites
          </button>
        </div>
      </div>
    );
  }

  const subTabs = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "pages", label: "Pages", icon: FileText },
    { id: "navigation", label: "Navigation", icon: Compass },
    { id: "theme", label: "Theme", icon: Palette },
    { id: "assets", label: "Assets", icon: FolderOpen },
    { id: "seo", label: "SEO & Meta", icon: Globe },
    { id: "activity", label: "Activity Logs", icon: Clock },
    { id: "deployments", label: "Deployments", icon: History },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] text-[#0F1020] flex relative overflow-hidden font-sans">
      <FloatingBlobs />
      <GrainOverlay />

      {/* Sidebar Nav */}
      <aside className="w-64 border-r border-black/5 bg-white/70 backdrop-blur-md p-6 flex flex-col justify-between relative z-10 shrink-0">
        <div className="space-y-8">
          <button
            onClick={() => onNavigate("/dashboard/website")}
            className="flex items-center gap-2 text-xs font-semibold text-[#0F1020]/60 hover:text-black transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Websites
          </button>

          <div>
            <h2 className="text-base font-bold truncate">{website.name}</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest text-[#0F1020]/40 mt-1">{website.templateName}</p>
          </div>

          <nav className="space-y-1">
            {subTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    activeSubTab === tab.id
                      ? "bg-[#0F1020] text-white shadow-md shadow-black/5"
                      : "text-[#0F1020]/60 hover:bg-black/5 hover:text-black"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-black/5">
          <button
            onClick={() => {
              window.location.href = `/playground?websiteId=${website.websiteId}`;
            }}
            className="w-full py-3 bg-[#0F1020] text-white hover:bg-[#171A30] transition font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
          >
            <FileCode className="h-4 w-4" />
            Launch Builder
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto relative z-10 font-sans">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* OVERVIEW TAB */}
          {activeSubTab === "overview" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold">Website Overview</h1>
                  <p className="text-[#0F1020]/50 text-xs mt-1">Status, deployments, and visual template configuration attributes.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowLivePreviewSimulator(true)}
                    className="px-4 py-2 bg-black/5 hover:bg-black/10 transition text-xs font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview Simulator
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={publishing}
                    className="px-4 py-2 bg-[#0F1020] text-white hover:bg-[#171A30] transition text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {publishing ? (
                      <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    Publish Changes
                  </button>
                </div>
              </div>

              {validationIssues.length > 0 && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl space-y-2 text-xs">
                  <span className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Publishing Blocked (Validation Failures)
                  </span>
                  <ul className="list-disc pl-4 space-y-1">
                    {validationIssues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bento Grid Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-[24px] bg-white border border-black/5 shadow-sm space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#0F1020]/40">Status</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${website.status === 'Published' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    <h3 className="text-lg font-bold">{website.status || "Draft"}</h3>
                  </div>
                </div>

                <div className="p-6 rounded-[24px] bg-white border border-black/5 shadow-sm space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#0F1020]/40">Private Cloned Pages</span>
                  <h3 className="text-lg font-bold">{pages.length} Pages</h3>
                </div>

                <div className="p-6 rounded-[24px] bg-white border border-black/5 shadow-sm space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#0F1020]/40">Live Endpoint</span>
                  <h3 className="text-sm font-semibold text-blue-600 truncate">{website.settings?.subdomain}.klin.store</h3>
                </div>
              </div>
            </div>
          )}

          {/* PAGES MANAGER TAB */}
          {activeSubTab === "pages" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold">Page Manager</h1>
                  <p className="text-[#0F1020]/50 text-xs mt-1">Configure layout structures. Cloned pages become private editable copies.</p>
                </div>
                <button
                  onClick={() => setShowPageModal(true)}
                  className="px-4 py-2 bg-[#0F1020] text-white hover:bg-[#171A30] transition text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add New Page
                </button>
              </div>

              <div className="bg-white border border-black/5 shadow-sm rounded-[24px] overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-black/5 text-[#0F1020]/40 font-mono">
                      <th className="p-4">Title</th>
                      <th className="p-4">Slug</th>
                      <th className="p-4">Components</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page) => (
                      <tr key={page.slug} className="border-b border-black/5 hover:bg-black/[0.01]">
                        <td className="p-4 font-bold text-[#0F1020]">{page.title}</td>
                        <td className="p-4 font-mono text-blue-600">{page.slug}</td>
                        <td className="p-4 text-[#0F1020]/50">{(page.builderJson?.content?.length || 0)} blocks</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleDuplicatePage(page)}
                            className="p-1.5 bg-black/5 hover:bg-black/10 rounded-lg transition inline-flex items-center text-[#0F1020]"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeletePage(page.slug)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg transition inline-flex items-center"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* NAVIGATION MANAGER TAB */}
          {activeSubTab === "navigation" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Navigation Manager</h1>
                <p className="text-[#0F1020]/50 text-xs mt-1">Configure Header, Footer, and nested navigation directories.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {navigation.map((menu, menuIdx) => (
                  <div key={menuIdx} className="p-6 rounded-[24px] bg-white border border-black/5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-black/5 pb-3">
                      <h3 className="text-sm font-bold">{menu.name}</h3>
                      <button
                        onClick={() => handleAddNavItem(menuIdx)}
                        className="px-2.5 py-1 bg-black/5 hover:bg-black/10 rounded-lg text-[10px] font-bold text-[#0F1020] flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Add Link
                      </button>
                    </div>

                    <div className="space-y-3">
                      {menu.links?.map((link: any, linkIdx: number) => (
                        <div key={linkIdx} className="flex gap-2 items-center">
                          <Input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleUpdateNavItem(menuIdx, linkIdx, "label", e.target.value)}
                            className="text-xs px-3 py-1 bg-[#FAFBFC] border border-black/10 rounded-lg flex-1"
                            placeholder="Label"
                          />
                          <Input
                            type="text"
                            value={link.href}
                            onChange={(e) => handleUpdateNavItem(menuIdx, linkIdx, "href", e.target.value)}
                            className="text-xs px-3 py-1 bg-[#FAFBFC] border border-black/10 rounded-lg flex-1"
                            placeholder="Href"
                          />
                          <button
                            onClick={() => handleDeleteNavItem(menuIdx, linkIdx)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* THEME BUILDER TAB */}
          {activeSubTab === "theme" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Theme Editor</h1>
                <p className="text-[#0F1020]/50 text-xs mt-1">Visual theme customizer. Cloned variables inject immediately into components.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Colors Card */}
                <div className="p-6 rounded-[24px] bg-white border border-black/5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold border-b border-black/5 pb-3">Brand Colors</h3>
                  <div className="space-y-4 pt-2">
                    {Object.entries(theme.colors || {}).map(([key, val]: any) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-xs font-semibold capitalize text-[#0F1020]/75">{key} Color</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[#0F1020]/50">{val}</span>
                          <input
                            type="color"
                            value={val || "#ffffff"}
                            onChange={(e) => handleThemeColorChange(key, e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-black/10"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography / Presets Card */}
                <div className="p-6 rounded-[24px] bg-white border border-black/5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold border-b border-black/5 pb-3">Typography & Tokens</h3>
                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#0F1020]/50">Heading Font</span>
                      <span className="font-bold">{theme.fonts?.heading || "Outfit"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#0F1020]/50">Body Font</span>
                      <span className="font-bold">{theme.fonts?.body || "Inter"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#0F1020]/50">Radius Presets</span>
                      <span className="font-mono text-[10px]">{theme.radii?.md || "8px"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ASSETS MANAGER TAB */}
          {activeSubTab === "assets" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold">Asset Manager</h1>
                  <p className="text-[#0F1020]/50 text-xs mt-1">Directory of media structures mapped to Cloudinary storage.</p>
                </div>
                <button
                  onClick={() => alert("Simulated asset file upload triggered.")}
                  className="px-4 py-2 bg-[#0F1020] text-white hover:bg-[#171A30] transition text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <FileUp className="h-3.5 w-3.5" />
                  Upload Asset
                </button>
              </div>

              {/* Sub folder headers */}
              <div className="flex gap-2 border-b border-black/5 pb-3">
                {([
                  { id: "images", label: "Images", icon: ImageIcon },
                  { id: "videos", label: "Videos", icon: Film },
                  { id: "fonts", label: "Fonts", icon: Type },
                  { id: "svg", label: "SVGs", icon: FileText },
                  { id: "documents", label: "Docs", icon: FileText }
                ] as const).map((fol) => {
                  const Icon = fol.icon;
                  return (
                    <button
                      key={fol.id}
                      onClick={() => setSelectedAssetFolder(fol.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        selectedAssetFolder === fol.id ? "bg-black/5 text-[#0F1020]" : "text-[#0F1020]/50 hover:text-black"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {fol.label}
                    </button>
                  );
                })}
              </div>

              {/* Assets Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {assetsList[selectedAssetFolder]?.map((asset: any, idx: number) => (
                  <div key={idx} className="p-4 bg-white border border-black/5 rounded-[20px] shadow-sm flex flex-col justify-between h-40">
                    <div className="space-y-1.5">
                      <div className="h-16 w-full rounded-lg bg-black/5 overflow-hidden flex items-center justify-center text-black/30 font-mono text-[9px]">
                        {selectedAssetFolder === "images" ? (
                          <img src={asset.url} alt={asset.name} className="h-full w-full object-cover" />
                        ) : selectedAssetFolder === "videos" ? (
                          <Film className="h-6 w-6" />
                        ) : selectedAssetFolder === "fonts" ? (
                          <Type className="h-6 w-6" />
                        ) : <FileText className="h-6 w-6" />}
                      </div>
                      <h4 className="text-xs font-bold truncate mt-2">{asset.name}</h4>
                      <p className="text-[10px] text-black/40 font-mono">{asset.size}</p>
                    </div>
                    <button
                      onClick={() => {
                        const updated = { ...assetsList };
                        updated[selectedAssetFolder].splice(idx, 1);
                        setAssetsList(updated);
                      }}
                      className="text-red-500 hover:text-red-700 text-[10px] font-bold text-right pt-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {assetsList[selectedAssetFolder]?.length === 0 && (
                  <div className="col-span-4 py-16 text-center text-[#0F1020]/40 text-xs">This directory is empty.</div>
                )}
              </div>
            </div>
          )}

          {/* SEO TAB */}
          {activeSubTab === "seo" && (
            <div className="max-w-2xl p-6 rounded-[24px] bg-white border border-black/5 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold border-b border-black/5 pb-3">SEO & Metadata Configuration</h3>
                <p className="text-[10px] text-[#0F1020]/40 mt-1">Configure search engine visibility index parameters.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-mono text-[#0F1020]/50">Meta Title Tag</label>
                  <Input
                    type="text"
                    value={seo.title}
                    onChange={(e) => {
                      const nextSeo = { ...seo, title: e.target.value };
                      setSeo(nextSeo);
                      handleUpdateWebsite({ seo: nextSeo });
                    }}
                    className="w-full px-4 py-2 bg-[#FAFBFC] border border-black/10 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[#0F1020]/50">Meta Description</label>
                  <textarea
                    value={seo.description}
                    onChange={(e) => {
                      const nextSeo = { ...seo, description: e.target.value };
                      setSeo(nextSeo);
                      handleUpdateWebsite({ seo: nextSeo });
                    }}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-[#FAFBFC] border border-black/10 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITY LOGS TAB */}
          {activeSubTab === "activity" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Activity Logs</h1>
                <p className="text-[#0F1020]/50 text-xs mt-1">Chronological history index of workspace operations.</p>
              </div>

              <div className="bg-white border border-black/5 shadow-sm rounded-[24px] overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/5 text-[#0F1020]/40 font-mono">
                      <th className="p-4">Activity Event</th>
                      <th className="p-4">Action Description</th>
                      <th className="p-4">Author</th>
                      <th className="p-4 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((act) => (
                      <tr key={act.activityId} className="border-b border-black/5 hover:bg-black/[0.01]">
                        <td className="p-4 font-bold text-indigo-600">{act.type}</td>
                        <td className="p-4 text-[#0F1020]/80">{act.description}</td>
                        <td className="p-4 font-mono font-medium">{act.user}</td>
                        <td className="p-4 text-right text-[#0F1020]/40">{new Date(act.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                    {activities.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-[#0F1020]/40">No activity logs recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DEPLOYMENTS & SNAPSHOTS TAB */}
          {activeSubTab === "deployments" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Deployment Snapshots</h1>
                <p className="text-[#0F1020]/50 text-xs mt-1">List of immutable historical snapshots. Restore page layouts instantly.</p>
              </div>

              <div className="bg-white border border-black/5 shadow-sm rounded-[24px] overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/5 text-[#0F1020]/40 font-mono">
                      <th className="p-4">Deployment ID</th>
                      <th className="p-4">Snapshot Version</th>
                      <th className="p-4">Environment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deployments.map((dep) => (
                      <tr key={dep.deploymentId} className="border-b border-black/5 hover:bg-black/[0.01]">
                        <td className="p-4 font-mono font-semibold text-blue-600">{dep.deploymentId}</td>
                        <td className="p-4 font-mono text-black/50">{dep.snapshotVersion}</td>
                        <td className="p-4 font-bold text-indigo-600">{dep.environment}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                            dep.status === "Published" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
                          }`}>
                            {dep.status}
                          </span>
                        </td>
                        <td className="p-4 font-mono">{dep.duration}s</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleRollback(dep.snapshotVersion)}
                            className="px-3 py-1.5 bg-[#0F1020] text-white hover:bg-[#171A30] transition rounded-lg text-[10px] flex items-center gap-1 ml-auto"
                          >
                            <RotateCcw className="h-3 w-3" /> Rollback
                          </button>
                        </td>
                      </tr>
                    ))}
                    {deployments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#0F1020]/40">No deployment logs created yet. Click publish to deploy one!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeSubTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Settings Expansion</h1>
                <p className="text-[#0F1020]/50 text-xs mt-1">Split workspace and DNS routing setups into focused channels.</p>
              </div>

              <div className="flex gap-4">
                {/* Left side setting subtabs */}
                <div className="w-48 bg-white/50 border border-black/5 rounded-[20px] p-3 flex flex-col gap-1 h-fit">
                  {([
                    { id: "general", label: "General" },
                    { id: "branding", label: "Branding" },
                    { id: "localization", label: "Localization" },
                    { id: "domains", label: "Domains" }
                  ]).map((sect) => (
                    <button
                      key={sect.id}
                      onClick={() => setActiveSettingSection(sect.id)}
                      className={`text-xs font-semibold px-3 py-2 text-left rounded-lg transition ${
                        activeSettingSection === sect.id ? "bg-black/5 text-[#0F1020]" : "text-[#0F1020]/50 hover:text-black"
                      }`}
                    >
                      {sect.label}
                    </button>
                  ))}
                </div>

                {/* Right side forms */}
                <div className="flex-1 bg-white border border-black/5 rounded-[24px] p-6 shadow-sm">
                  {activeSettingSection === "general" && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as any;
                      handleSaveSettingsSection("general", {
                        websiteName: form.websiteName.value,
                        websiteDescription: form.websiteDescription.value,
                        supportEmail: form.supportEmail.value,
                        supportPhone: form.supportPhone.value,
                      });
                    }} className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-semibold text-black/75">Store Title Name</label>
                        <Input name="websiteName" type="text" defaultValue={website.metadata?.websiteName || website.name} />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-black/75">Store Description</label>
                        <textarea 
                          name="websiteDescription" 
                          rows={3} 
                          className="w-full bg-[#FAFBFC] border border-black/10 rounded-xl p-3 focus:outline-none"
                          defaultValue={website.metadata?.websiteDescription || ""} 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-black/75">Customer Support Email</label>
                        <Input name="supportEmail" type="email" defaultValue={website.metadata?.supportEmail || user?.email} />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-black/75">Support Phone</label>
                        <Input name="supportPhone" type="text" defaultValue={website.metadata?.supportPhone || ""} />
                      </div>
                      <button type="submit" className="px-4 py-2 bg-[#0F1020] text-white hover:bg-[#171A30] font-bold rounded-xl">
                        Save General settings
                      </button>
                    </form>
                  )}

                  {activeSettingSection === "branding" && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as any;
                      handleSaveSettingsSection("branding", {
                        logo: form.logo.value,
                        favicon: form.favicon.value,
                        themeStyle: form.themeStyle.value,
                      });
                    }} className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-semibold text-black/75">Branding Logo Link</label>
                        <Input name="logo" type="text" defaultValue={website.metadata?.logo || ""} />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-black/75">Favicon Shortcut Icon</label>
                        <Input name="favicon" type="text" defaultValue={website.metadata?.favicon || ""} />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-black/75">Layout Design Theme Style</label>
                        <select name="themeStyle" defaultValue={settings.themeStyle || "modern"} className="w-full bg-[#FAFBFC] border border-black/10 rounded-xl p-3">
                          <option value="modern">Modern Sleek</option>
                          <option value="minimal">Minimalist Light</option>
                          <option value="glass">Glassmorphic</option>
                        </select>
                      </div>
                      <button type="submit" className="px-4 py-2 bg-[#0F1020] text-white hover:bg-[#171A30] font-bold rounded-xl">
                        Save Branding settings
                      </button>
                    </form>
                  )}

                  {activeSettingSection === "localization" && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as any;
                      handleSaveSettingsSection("localization", {
                        currency: form.currency.value,
                        language: form.language.value,
                        timezone: form.timezone.value,
                      });
                    }} className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-semibold text-black/75">Default Currency</label>
                        <Input name="currency" type="text" defaultValue={settings.localization?.currency || "USD"} />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-black/75">Primary Language Code</label>
                        <Input name="language" type="text" defaultValue={settings.localization?.language || "en"} />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-black/75">Local Timezone</label>
                        <Input name="timezone" type="text" defaultValue={settings.localization?.timezone || "UTC"} />
                      </div>
                      <button type="submit" className="px-4 py-2 bg-[#0F1020] text-white hover:bg-[#171A30] font-bold rounded-xl">
                        Save Localization settings
                      </button>
                    </form>
                  )}

                  {activeSettingSection === "domains" && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as any;
                      handleSaveSettingsSection("domains", {
                        subdomain: form.subdomain.value,
                        customDomain: form.customDomain.value,
                      });
                    }} className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="font-semibold text-black/75">Klin subdomain</label>
                        <div className="flex gap-2">
                          <Input name="subdomain" type="text" defaultValue={settings.subdomain || ""} />
                          <span className="py-2.5 font-bold font-mono text-[#0F1020]/50 text-xs">.klin.store</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-black/75">Custom Domain Mapping</label>
                        <Input name="customDomain" type="text" placeholder="store.domain.com" defaultValue={settings.customDomain || ""} />
                      </div>
                      <button type="submit" className="px-4 py-2 bg-[#0F1020] text-white hover:bg-[#171A30] font-bold rounded-xl">
                        Save Domains settings
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* PAGE MODAL */}
      <AnimatePresence>
        {showPageModal && (
          <div className="fixed inset-0 bg-[#0F1020]/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-black/5 shadow-2xl rounded-[32px] max-w-sm w-full p-6 space-y-4 text-[#0F1020]"
            >
              <h3 className="text-base font-bold">Add Custom Page</h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-mono text-[#0F1020]/50">Page Title</label>
                  <Input
                    type="text"
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    placeholder="About Us"
                    className="w-full px-3 py-2 bg-[#FAFBFC] border border-black/10 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[#0F1020]/50">Page Slug</label>
                  <Input
                    type="text"
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value)}
                    placeholder="about-us"
                    className="w-full px-3 py-2 bg-[#FAFBFC] border border-black/10 rounded-xl font-mono text-blue-600"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 text-xs">
                <button
                  onClick={() => setShowPageModal(false)}
                  className="flex-1 py-2 bg-black/5 hover:bg-black/10 transition font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPage}
                  className="flex-1 py-2 bg-[#0F1020] text-white hover:bg-[#171A30] transition font-bold rounded-xl"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
export default WebsiteDashboard;
