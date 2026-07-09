"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Puck, type Data } from "@measured/puck";
import { ArrowLeft, Save, Globe, Eye, Smartphone, Tablet, Monitor, Settings, FileText, Compass, Palette, Plus, Trash2, Copy, Check, Menu } from "lucide-react";
import { puckConfigBuilder } from "@/lib/puck-config-builder";
import { FloatingBlobs, GrainOverlay } from "@/components/klin/FloatingBlobs";
import { BuilderShell } from "../components/builder/core/BuilderShell";

export function PlaygroundPage() {
  const [website, setWebsite] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [activePageSlug, setActivePageSlug] = useState("home");
  const [puckData, setPuckData] = useState<Data>({ content: [], root: {} });
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Builder Shell states
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [preferences, setPreferences] = useState({ grid: true, snap: true, guides: true });

  // Debounce ref for autosave
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save Layout as Template States
  const [templatePromptOpen, setTemplatePromptOpen] = useState(false);
  const [newTplName, setNewTplName] = useState("");
  const [newTplCategory, setNewTplCategory] = useState("E-Commerce");
  const [newTplDesc, setNewTplDesc] = useState("");
  const [savingAsTemplate, setSavingAsTemplate] = useState(false);

  // Site Manager States
  const [siteManagerOpen, setSiteManagerOpen] = useState(false);
  const [managerTab, setManagerTab] = useState<"pages" | "navigation" | "theme" | "settings">("pages");
  const [siteSubdomain, setSiteSubdomain] = useState("");
  const [siteBusinessName, setSiteBusinessName] = useState("");
  
  // Theme Color States
  const [primaryColor, setPrimaryColor] = useState("#6366F1");
  const [accentColor, setAccentColor] = useState("#6366F1");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#0F1020");

  // Navigation States
  const [headerLinks, setHeaderLinks] = useState<any[]>([]);
  const [footerLinks, setFooterLinks] = useState<any[]>([]);

  // Load site manager states when website is fetched
  useEffect(() => {
    if (website) {
      setSiteSubdomain(website.settings?.subdomain || "");
      setSiteBusinessName(website.settings?.businessName || website.name || "");
      if (website.theme?.colors) {
        setPrimaryColor(website.theme.colors.primary || "#6366F1");
        setAccentColor(website.theme.colors.accent || "#6366F1");
        setBgColor(website.theme.colors.background || "#ffffff");
        setFgColor(website.theme.colors.foreground || "#0F1020");
      }
      if (website.navigation) {
        const header = website.navigation.find((n: any) => n.name === "Header Menu");
        const footer = website.navigation.find((n: any) => n.name === "Footer Menu");
        setHeaderLinks(header?.links || []);
        setFooterLinks(footer?.links || []);
      }
    }
  }, [website]);

  const handleSaveNavigation = async () => {
    if (!websiteId) return;
    try {
      const token = getAuthToken();
      const updatedNavigation = [
        { name: "Header Menu", links: headerLinks },
        { name: "Footer Menu", links: footerLinks }
      ];
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ navigation: updatedNavigation })
      });
      if (res.ok) {
        setWebsite((prev: any) => ({ ...prev, navigation: updatedNavigation }));
        alert("Navigation saved successfully!");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save navigation");
    }
  };

  const handleSaveTheme = async () => {
    if (!websiteId) return;
    try {
      const token = getAuthToken();
      const updatedTheme = {
        ...website.theme,
        colors: {
          primary: primaryColor,
          accent: accentColor,
          background: bgColor,
          foreground: fgColor
        }
      };
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ theme: updatedTheme })
      });
      if (res.ok) {
        setWebsite((prev: any) => ({ ...prev, theme: updatedTheme }));
        alert("Theme colors saved successfully!");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save theme colors");
    }
  };

  const handleSaveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteId) return;
    try {
      const token = getAuthToken();
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/settings/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          businessName: siteBusinessName,
          subdomain: siteSubdomain
        })
      });
      if (res.ok) {
        setWebsite((prev: any) => ({
          ...prev,
          name: siteBusinessName,
          settings: { ...prev.settings, subdomain: siteSubdomain }
        }));
        alert("Subdomain settings saved successfully!");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save settings");
    }
  };

  const handleAddPage = async () => {
    const title = prompt("Enter page title (e.g. About Us):");
    if (!title) return;
    const slug = prompt("Enter page slug (e.g. about):", title.toLowerCase().replace(/[^a-z0-9]/g, "-"));
    if (!slug) return;

    if (pages.some((p) => p.slug === slug)) {
      alert("A page with this slug already exists.");
      return;
    }

    const newPage = {
      title,
      slug,
      builderJson: { content: [], root: { props: { title } } }
    };
    const nextPages = [...pages, newPage];

    try {
      const token = getAuthToken();
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ pages: nextPages })
      });
      if (res.ok) {
        setPages(nextPages);
        setActivePageSlug(slug);
        alert(`Page '${title}' added successfully!`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to add page");
    }
  };

  const handleDeletePage = async (pageSlug: string) => {
    if (pageSlug === "home") {
      alert("Cannot delete the home page.");
      return;
    }
    if (!confirm("Are you sure you want to delete this page?")) return;

    const nextPages = pages.filter((p) => p.slug !== pageSlug);
    try {
      const token = getAuthToken();
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ pages: nextPages })
      });
      if (res.ok) {
        setPages(nextPages);
        setActivePageSlug("home");
        alert("Page deleted successfully.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to delete page");
    }
  };

  const getAuthToken = () => {
    try {
      const stored = localStorage.getItem("klin_user_session");
      if (stored) {
        const session = JSON.parse(stored);
        return session.token || "";
      }
    } catch (e) {}
    return "";
  };

  const handleSaveAsTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTplName.trim()) {
      alert("Please provide a template name");
      return;
    }

    setSavingAsTemplate(true);
    try {
      const token = getAuthToken();
      
      const res = await fetch("http://localhost:5000/api/templates/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newTplName,
          category: newTplCategory,
          description: newTplDesc,
          theme: website?.theme || {},
          pages: pages.map(p => {
            if (p.slug === activePageSlug) {
              return { ...p, builderJson: puckData };
            }
            return p;
          }),
          author: "Creator Dashboard"
        })
      });

      const result = await res.json();
      if (result.success) {
        alert(`Template '${newTplName}' created successfully in database catalog.`);
        setTemplatePromptOpen(false);
        setNewTplName("");
        setNewTplDesc("");
      } else {
        alert("Failed to save template: " + result.error);
      }
    } catch (err: any) {
      console.error(err);
      alert("Error saving template");
    } finally {
      setSavingAsTemplate(false);
    }
  };

  const [websiteId, setWebsiteId] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<string | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get("websiteId");
    const tId = query.get("templateId");
    setWebsiteId(id);
    setTemplateId(tId);
  }, []);

  useEffect(() => {
    if (!websiteId && !templateId) return;

    const fetchData = async () => {
      try {
        const token = getAuthToken();
        if (websiteId) {
          const res = await fetch(`http://localhost:5000/api/websites/${websiteId}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const result = await res.json();
          if (result.success && result.website) {
            setWebsite(result.website);
            const websitePages = result.website.pages || [];
            setPages(websitePages);
            
            const matched = websitePages.find((p: any) => p.slug === activePageSlug);
            if (matched && matched.builderJson) {
              setPuckData(matched.builderJson);
            } else if (websitePages.length > 0) {
              setPuckData(websitePages[0].builderJson || { content: [], root: {} });
              setActivePageSlug(websitePages[0].slug);
            }
          }
        } else if (templateId) {
          if (templateId === "new") {
            setWebsite({
              name: "New Custom Template",
              theme: {}
            });
            setPages([{ title: "Home", slug: "home", builderJson: { content: [], root: {} } }]);
            setPuckData({ content: [], root: {} });
            setLoading(false);
            return;
          }
          const res = await fetch(`http://localhost:5000/api/templates/${templateId}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const result = await res.json();
          if (result.success && result.template) {
            setWebsite({
              name: result.template.name,
              theme: result.template.theme
            });
            const templatePages = result.template.pages || [];
            setPages(templatePages);
            
            const matched = templatePages.find((p: any) => p.slug === activePageSlug);
            if (matched && matched.builderJson) {
              setPuckData(matched.builderJson);
            } else if (templatePages.length > 0) {
              setPuckData(templatePages[0].builderJson || { content: [], root: {} });
              setActivePageSlug(templatePages[0].slug);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load layout data for builder", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [websiteId, templateId, activePageSlug]);

  const handlePuckChange = (nextData: Data) => {
    setPuckData(nextData);

    // Debounced autosave
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSaving(true);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const token = getAuthToken();
        // Map updated Puck JSON back to pages list
        const nextPages = pages.map((p) => {
          if (p.slug === activePageSlug) {
            return { ...p, builderJson: nextData };
          }
          return p;
        });
        setPages(nextPages);

        if (websiteId) {
          await fetch(`http://localhost:5000/api/websites/${websiteId}/pages/${activePageSlug}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ builderJson: nextData })
          });
        } else if (templateId && templateId !== "new") {
          await fetch(`http://localhost:5000/api/templates/${templateId}/save`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ pages: nextPages })
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setSaving(false);
      }
    }, 1500); // 1.5s debounce
  };

  const handleSaveTemplateDirectly = async () => {
    if (!templateId) return;

    if (templateId === "new") {
      const name = prompt("Enter template name:", "My Beautiful Custom Store");
      if (!name) return;
      const category = prompt("Enter template category (e.g., E-Commerce, SaaS, Portfolio):", "E-Commerce") || "E-Commerce";
      const description = prompt("Enter template description (optional):", "Custom layout built visually from scratch.") || "";

      setSaving(true);
      try {
        const token = getAuthToken();
        const nextPages = pages.map((p) => {
          if (p.slug === activePageSlug) {
            return { ...p, builderJson: puckData };
          }
          return p;
        });

        const res = await fetch(`http://localhost:5000/api/templates/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            category,
            description,
            pages: nextPages,
            theme: website?.theme || {},
            author: "Visual Creator"
          })
        });

        const result = await res.json();
        if (result.success && result.template) {
          alert(`Template '${name}' created and published successfully.`);
          setTemplateId(result.template.templateId);
          setWebsite({ name, theme: website?.theme || {} });
          const newUrl = `${window.location.pathname}?templateId=${result.template.templateId}`;
          window.history.replaceState(null, "", newUrl);
        } else {
          alert("Failed to submit template: " + (result.error || "Unknown error"));
        }
      } catch (err: any) {
        console.error(err);
        alert("Failed to save template layout");
      } finally {
        setSaving(false);
      }
      return;
    }

    setSaving(true);
    try {
      const token = getAuthToken();
      const nextPages = pages.map((p) => {
        if (p.slug === activePageSlug) {
          return { ...p, builderJson: puckData };
        }
        return p;
      });

      const res = await fetch(`http://localhost:5000/api/templates/${templateId}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ pages: nextPages })
      });
      if (res.ok) {
        alert("Template layout saved successfully.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save template layout");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`http://localhost:5000/api/websites/${websiteId}/publish`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Website snapshot published!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const canvasWidth = useMemo(() => {
    switch (device) {
      case "tablet": return 768;
      case "mobile": return 375;
      default: return "100%";
    }
  }, [device]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] flex items-center justify-center relative overflow-hidden font-sans">
        <FloatingBlobs />
        <GrainOverlay />
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="w-8 h-8 border-2 border-black/10 border-t-[#0F1020] rounded-full animate-spin" />
          <p className="text-[#0F1020]/60 text-xs font-mono">Loading Puck Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BuilderShell
        contextValue={{
          website,
          setWebsite,
          pages,
          setPages,
          activePageSlug,
          setActivePageSlug,
          puckData,
          setPuckData: handlePuckChange,
          selectedNodeId,
          setSelectedNodeId,
          device,
          setDevice,
          zoom,
          setZoom,
          saving,
          setSaving,
          preferences,
          setPreferences
        }}
        onPublish={handlePublish}
        onSaveAsTemplate={() => setTemplatePromptOpen(true)}
        onSaveDirectly={handleSaveTemplateDirectly}
        onOpenSiteManager={websiteId ? () => setSiteManagerOpen(true) : undefined}
        onAddPage={handleAddPage}
        onDeletePage={handleDeletePage}
        isTemplate={!!templateId}
      />
      {templatePromptOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#0F1020]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-black/5 max-w-sm w-full p-6 shadow-2xl space-y-4 text-[#0F1020]">
            <div className="flex justify-between items-center pb-2 border-b border-black/5">
              <h2 className="text-base font-bold font-sans">Save Layout as Template</h2>
              <button 
                onClick={() => setTemplatePromptOpen(false)}
                className="p-1 hover:bg-neutral-100 rounded-full transition text-[#0F1020]/50"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAsTemplate} className="space-y-3.5 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[#0F1020]/60">Template Name</label>
                <input 
                  type="text" 
                  value={newTplName}
                  onChange={(e) => setNewTplName(e.target.value)}
                  placeholder="e.g. Modern Minimalist Store"
                  className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-black/5 focus:outline-none focus:border-indigo-500 font-sans"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#0F1020]/60">Category</label>
                <select 
                  value={newTplCategory}
                  onChange={(e) => setNewTplCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-black/5 focus:outline-none focus:border-indigo-500"
                >
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="Restaurant">Restaurant</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#0F1020]/60 font-sans">Description</label>
                <textarea 
                  value={newTplDesc}
                  onChange={(e) => setNewTplDesc(e.target.value)}
                  placeholder="e.g. A gorgeous commerce storefront designed visually."
                  className="w-full h-16 px-3 py-2 bg-neutral-50 rounded-xl border border-black/5 focus:outline-none focus:border-indigo-500 font-sans font-normal"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs">
                <button 
                  type="button" 
                  onClick={() => setTemplatePromptOpen(false)}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 transition text-[#0F1020]/80 rounded-xl font-bold font-sans"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={savingAsTemplate}
                  className="px-4 py-2 bg-[#0F1020] hover:bg-[#171A30] disabled:opacity-50 transition text-white rounded-xl font-bold font-sans"
                >
                  {savingAsTemplate ? "Saving..." : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {siteManagerOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#0F1020]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-black/5 max-w-4xl w-full h-[600px] shadow-2xl flex overflow-hidden text-[#0F1020]">
            
            {/* Sidebar tabs */}
            <aside className="w-56 border-r border-black/5 bg-neutral-50 p-6 flex flex-col justify-between shrink-0">
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold truncate">Site Manager</h2>
                  <p className="text-[9px] uppercase font-mono tracking-widest text-[#0F1020]/40 mt-1">Configure Website Features</p>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: "pages", label: "Page Manager", icon: FileText },
                    { id: "navigation", label: "Navigation Menu", icon: Compass },
                    { id: "theme", label: "Theme Colors", icon: Palette },
                    { id: "settings", label: "General Settings", icon: Settings }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setManagerTab(tab.id as any)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                          managerTab === tab.id
                            ? "bg-[#0F1020] text-white shadow-sm"
                            : "text-[#0F1020]/60 hover:bg-neutral-100 hover:text-black"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={() => setSiteManagerOpen(false)}
                className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 transition font-bold text-xs rounded-xl"
              >
                Close Manager
              </button>
            </aside>

            {/* Content pane */}
            <main className="flex-1 p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                
                {/* Pages tab content */}
                {managerTab === "pages" && (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold">Page Manager</h3>
                        <p className="text-xs text-[#0F1020]/50 mt-0.5">Manage existing pages or add new layouts to your site.</p>
                      </div>
                      <button
                        onClick={handleAddPage}
                        className="px-3 py-1.5 bg-[#0F1020] text-white hover:bg-neutral-800 transition text-xs font-bold rounded-lg flex items-center gap-1 font-sans"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Page
                      </button>
                    </div>

                    <div className="border border-black/5 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-neutral-50 border-b border-black/5 text-[#0F1020]/50 font-mono">
                            <th className="p-3">Title</th>
                            <th className="p-3">Slug</th>
                            <th className="p-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pages.map((p) => (
                            <tr key={p.slug} className="border-b border-black/5 hover:bg-neutral-50/50">
                              <td className="p-3 font-semibold">{p.title}</td>
                              <td className="p-3 font-mono text-indigo-600">/{p.slug}</td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleDeletePage(p.slug)}
                                  disabled={p.slug === "home"}
                                  className="p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-30 rounded-lg transition"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Navigation tab content */}
                {managerTab === "navigation" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-bold">Navigation Menu Editor</h3>
                      <p className="text-xs text-[#0F1020]/50 mt-0.5">Add, remove, or modify links in the Header and Footer navigation menus.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Header links */}
                      <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-black/5">
                        <h4 className="text-xs font-bold text-[#0F1020]/60 uppercase tracking-wide">Header Menu</h4>
                        <div className="space-y-2 font-normal">
                          {headerLinks.map((link, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={link.label}
                                onChange={(e) => {
                                  const next = [...headerLinks];
                                  next[idx].label = e.target.value;
                                  setHeaderLinks(next);
                                }}
                                className="flex-1 px-2.5 py-1.5 bg-white border border-black/5 rounded-lg text-xs font-sans"
                                placeholder="Label"
                              />
                              <input
                                type="text"
                                value={link.href}
                                onChange={(e) => {
                                  const next = [...headerLinks];
                                  next[idx].href = e.target.value;
                                  setHeaderLinks(next);
                                }}
                                className="flex-1 px-2.5 py-1.5 bg-white border border-black/5 rounded-lg text-xs font-mono text-indigo-600"
                                placeholder="URL"
                              />
                              <button
                                onClick={() => setHeaderLinks(headerLinks.filter((_, i) => i !== idx))}
                                className="text-red-500 p-1.5 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => setHeaderLinks([...headerLinks, { label: "New Link", href: "/home" }])}
                            className="w-full py-1.5 border border-dashed border-black/10 hover:bg-neutral-100 rounded-lg text-[10px] font-bold font-sans"
                          >
                            + Add Link
                          </button>
                        </div>
                      </div>

                      {/* Footer links */}
                      <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-black/5">
                        <h4 className="text-xs font-bold text-[#0F1020]/60 uppercase tracking-wide">Footer Menu</h4>
                        <div className="space-y-2 font-normal">
                          {footerLinks.map((link, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={link.label}
                                onChange={(e) => {
                                  const next = [...footerLinks];
                                  next[idx].label = e.target.value;
                                  setFooterLinks(next);
                                }}
                                className="flex-1 px-2.5 py-1.5 bg-white border border-black/5 rounded-lg text-xs font-sans"
                                placeholder="Label"
                              />
                              <input
                                type="text"
                                value={link.href}
                                onChange={(e) => {
                                  const next = [...footerLinks];
                                  next[idx].href = e.target.value;
                                  setFooterLinks(next);
                                }}
                                className="flex-1 px-2.5 py-1.5 bg-white border border-black/5 rounded-lg text-xs font-mono text-indigo-600"
                                placeholder="URL"
                              />
                              <button
                                onClick={() => setFooterLinks(footerLinks.filter((_, i) => i !== idx))}
                                className="text-red-500 p-1.5 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => setFooterLinks([...footerLinks, { label: "New Link", href: "/home" }])}
                            className="w-full py-1.5 border border-dashed border-black/10 hover:bg-neutral-100 rounded-lg text-[10px] font-bold font-sans"
                          >
                            + Add Link
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveNavigation}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white transition text-xs font-bold rounded-lg font-sans"
                      >
                        Save Navigation Changes
                      </button>
                    </div>
                  </div>
                )}

                {/* Theme colors tab content */}
                {managerTab === "theme" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-bold">Theme Colors & Fonts</h3>
                      <p className="text-xs text-[#0F1020]/50 mt-0.5">Customize global styles, primary branding palettes, and typography for your storefront.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                      <div className="space-y-1">
                        <label className="text-[#0F1020]/60">Primary Brand Color</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
                          <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 px-3 py-2 bg-neutral-50 rounded-xl border border-black/5" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[#0F1020]/60">Accent Highlight Color</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
                          <input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="flex-1 px-3 py-2 bg-neutral-50 rounded-xl border border-black/5" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[#0F1020]/60">Background Theme Color</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
                          <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 px-3 py-2 bg-neutral-50 rounded-xl border border-black/5" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[#0F1020]/60">Foreground Text Color</label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
                          <input type="text" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="flex-1 px-3 py-2 bg-neutral-50 rounded-xl border border-black/5" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveTheme}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white transition text-xs font-bold rounded-lg font-sans"
                      >
                        Save Theme Changes
                      </button>
                    </div>
                  </div>
                )}

                {/* General settings tab content */}
                {managerTab === "settings" && (
                  <form onSubmit={handleSaveGeneralSettings} className="space-y-5">
                    <div>
                      <h3 className="text-lg font-bold">General settings</h3>
                      <p className="text-xs text-[#0F1020]/50 mt-0.5">Manage domain names, business branding, and general domain routing paths.</p>
                    </div>

                    <div className="space-y-3.5 text-xs font-semibold">
                      <div className="space-y-1">
                        <label className="text-[#0F1020]/60">Business Name</label>
                        <input
                          type="text"
                          value={siteBusinessName}
                          onChange={(e) => setSiteBusinessName(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-black/5 focus:outline-none focus:border-indigo-500 font-sans"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[#0F1020]/60">Subdomain Route Prefix</label>
                        <div className="flex rounded-xl border border-black/5 overflow-hidden">
                          <input
                            type="text"
                            value={siteSubdomain}
                            onChange={(e) => setSiteSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                            className="flex-1 px-3 py-2 bg-neutral-50 focus:outline-none focus:bg-white font-sans"
                            required
                          />
                          <span className="bg-neutral-100 text-[#0F1020]/40 px-3 py-2 border-l border-black/5 font-mono">.klin.store</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white transition text-xs font-bold rounded-lg font-sans"
                      >
                        Save General Settings
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </main>

          </div>
        </div>
      )}
    </>
  );
}
