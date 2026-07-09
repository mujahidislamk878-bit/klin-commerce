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
  Layers
} from "lucide-react";
import type { UserSession } from "@/lib/session";
import { FloatingBlobs, GrainOverlay } from "@/components/klin/FloatingBlobs";
import { Input } from "@/components/ui/input";

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

  // Local state for forms
  const [pages, setPages] = useState<any[]>([]);
  const [navigation, setNavigation] = useState<any[]>([]);
  const [theme, setTheme] = useState<any>({ colors: {} });
  const [seo, setSeo] = useState<any>({ title: "", description: "", keywords: [] });
  const [settings, setSettings] = useState<any>({ subdomain: "", customDomain: "" });
  const [snapshots, setSnapshots] = useState<any[]>([]);

  // Page Creator Modal
  const [showPageModal, setShowPageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");

  useEffect(() => {
    if (!user?.token || !websiteId) return;

    const fetchWebsiteData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/websites/${websiteId}`, {
          headers: { "Authorization": `Bearer ${user.token}` }
        });
        if (!res.ok) throw new Error("Failed to load website configuration");
        const result = await res.json();
        if (result.success) {
          setWebsite(result.website);
          setPages(result.website.pages || []);
          setNavigation(result.website.navigation || []);
          setTheme(result.website.theme || { colors: {} });
          setSeo(result.website.seo || { title: "", description: "" });
          setSettings(result.website.settings || { subdomain: "", customDomain: "" });
        } else {
          throw new Error(result.error || "Failed to load website");
        }
      } catch (err: any) {
        setError(err.message || "Failed to retrieve details");
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteData();
  }, [websiteId, user?.token]);

  // Fetch snapshots
  useEffect(() => {
    if (!user?.token || activeSubTab !== "deployments") return;
    const fetchSnapshots = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/snapshots`, {
          headers: { "Authorization": `Bearer ${user.token}` }
        });
        const result = await res.json();
        if (result.success) {
          setSnapshots(result.snapshots || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSnapshots();
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

  const handlePublish = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/publish`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${user.token}` }
      });
      const result = await res.json();
      if (result.success) {
        alert("Website published successfully! Cloned snapshot created.");
        setWebsite((prev: any) => ({ ...prev, status: "Published" }));
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
    { id: "seo", label: "SEO & Meta", icon: Globe },
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
                    onClick={() => {
                      window.open(`http://${website.settings?.subdomain}.klin.store`, "_blank");
                    }}
                    className="px-4 py-2 bg-black/5 hover:bg-black/10 transition text-xs font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Live Preview
                  </button>
                  <button
                    onClick={handlePublish}
                    className="px-4 py-2 bg-[#0F1020] text-white hover:bg-[#171A30] transition text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Publish Changes
                  </button>
                </div>
              </div>

              {/* Bento Grid Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-[24px] bg-white border border-black/5 shadow-sm space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#0F1020]/40">Status</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${website.status === 'Published' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    <h3 className="text-lg font-bold">{website.status}</h3>
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
                      <th className="p-4">Snapshot ID</th>
                      <th className="p-4">Published By</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshots.map((snap) => (
                      <tr key={snap.snapshotId} className="border-b border-black/5 hover:bg-black/[0.01]">
                        <td className="p-4 font-mono font-semibold text-blue-600">{snap.snapshotId}</td>
                        <td className="p-4 font-bold">{snap.createdBy}</td>
                        <td className="p-4 text-[#0F1020]/50">{new Date(snap.timestamp).toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={async () => {
                              if (confirm("Restore website components to this version?")) {
                                try {
                                  const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/snapshots/restore`, {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                      "Authorization": `Bearer ${user?.token}`
                                    },
                                    body: JSON.stringify({ snapshotId: snap.snapshotId })
                                  });
                                  if (res.ok) {
                                    alert("Snapshot restored! Reloading...");
                                    window.location.reload();
                                  }
                                } catch (e) {
                                  console.error(e);
                                }
                              }
                            }}
                            className="px-3 py-1 bg-[#0F1020] text-white hover:bg-[#171A30] transition rounded-lg text-[10px]"
                          >
                            Restore
                          </button>
                        </td>
                      </tr>
                    ))}
                    {snapshots.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-[#0F1020]/40">No deployment snapshots created. Click publish to create one!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeSubTab === "settings" && (
            <div className="max-w-2xl p-6 rounded-[24px] bg-white border border-black/5 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold border-b border-black/5 pb-3">Subdomain & DNS Parameters</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-mono text-[#0F1020]/50">Klin Subdomain Name</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={settings.subdomain}
                      onChange={(e) => {
                        const nextSettings = { ...settings, subdomain: e.target.value };
                        setSettings(nextSettings);
                        handleUpdateWebsite({ settings: nextSettings });
                      }}
                      className="flex-1 px-4 py-2 bg-[#FAFBFC] border border-black/10 rounded-xl"
                    />
                    <span className="py-2.5 font-semibold text-[#0F1020]/60">.klin.store</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[#0F1020]/50">Custom External Domain Target</label>
                  <Input
                    type="text"
                    value={settings.customDomain}
                    onChange={(e) => {
                      const nextSettings = { ...settings, customDomain: e.target.value };
                      setSettings(nextSettings);
                      handleUpdateWebsite({ settings: nextSettings });
                    }}
                    placeholder="e.g. store.mydomain.com"
                    className="w-full px-4 py-2 bg-[#FAFBFC] border border-black/10 rounded-xl"
                  />
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
              className="bg-white border border-black/5 shadow-2xl rounded-[32px] max-w-sm w-full p-6 space-y-4"
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
