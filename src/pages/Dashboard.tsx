"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ShoppingCart,
  Package,
  FileCode,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  TrendingUp,
  Users,
  Eye,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  Globe,
  Mail,
  Shield,
  HelpCircle,
  Sparkles
} from "lucide-react";
import type { UserSession } from "@/lib/session";
import { FloatingBlobs, GrainOverlay } from "@/components/klin/FloatingBlobs";
import { Input } from "@/components/ui/input";

type DashboardProps = {
  onLogout?: () => void;
  activeTab: string;
  onNavigate: (path: string) => void;
  user: UserSession | null;
};

export function Dashboard({ onLogout, activeTab, onNavigate, user }: DashboardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Settings State variables
  const [businessName, setBusinessName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [theme, setTheme] = useState("dark");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch data for the active tab from MongoDB database
  useEffect(() => {
    if (!user?.token) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = `http://localhost:5000/api/dashboard/${activeTab}`;
        const res = await fetch(endpoint, {
          headers: {
            "Authorization": `Bearer ${user.token}`
          }
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch database data (${res.status})`);
        }
        const result = await res.json();
        if (result.success) {
          setData(result);
          // Pre-populate settings form when settings tab is loaded
          if (activeTab === "settings" && result.settings) {
            setBusinessName(result.settings.businessName || "");
            setSupportEmail(result.settings.supportEmail || "");
            setTheme(result.settings.theme || "dark");
            setEmailNotifications(result.settings.emailNotifications ?? true);
            setPushNotifications(result.settings.pushNotifications ?? false);
            setMarketingEmails(result.settings.marketingEmails ?? false);
          }
        } else {
          throw new Error(result.error || "Server error loading dashboard");
        }
      } catch (err: any) {
        console.error(`Error loading database records:`, err);
        setError(err.message || "Failed to load database records.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user?.token]);

  // Handle saving user settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;

    setSavingSettings(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          businessName,
          supportEmail,
          theme,
          emailNotifications,
          pushNotifications,
          marketingEmails
        })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        } else {
          throw new Error(result.error || "Save settings failed");
        }
      } else {
        throw new Error("Failed to post settings");
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSavingSettings(false);
    }
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "products", label: "Products", icon: Package },
    { id: "templates", label: "Templates", icon: FileCode },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] text-[#0F1020] flex items-center justify-center relative overflow-hidden">
        <FloatingBlobs />
        <GrainOverlay />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-2 border-black/10 border-t-[#0F1020] rounded-full"
          />
          <p className="text-[#0F1020]/60 text-sm font-mono">Querying database records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] text-[#0F1020] flex items-center justify-center p-6 relative overflow-hidden">
        <FloatingBlobs />
        <GrainOverlay />
        <div className="text-center space-y-4 max-w-md bg-white border border-black/5 shadow-2xl rounded-[32px] p-8 relative z-10">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Database Error</h2>
          <p className="text-[#0F1020]/60 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-[#0F1020] text-white font-semibold rounded-xl hover:bg-[#171A30] transition text-sm shadow-md"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F9FAFB] text-[#0F1020] flex relative overflow-hidden">
      <FloatingBlobs />
      <GrainOverlay />

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-black/5 bg-white/70 backdrop-blur-xl flex flex-col justify-between shrink-0 relative z-10">
        <div>
          {/* Logo Area */}
          <div className="h-20 flex items-center gap-3 px-6 border-b border-black/5">
            <div className="h-9 w-9 bg-gradient-to-br from-[#0F1020] to-[#0F1020]/70 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-base">K</span>
            </div>
            <div>
              <span className="font-bold text-[#0F1020] tracking-wide">Klin</span>
              <span className="text-[10px] block text-[#0F1020]/40 font-mono">Console v1.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(`/dashboard/${item.id}`)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden group border border-transparent ${
                    isActive
                      ? "text-[#0F1020] bg-black/5 border-black/5 shadow-inner"
                      : "text-[#0F1020]/60 hover:text-[#0F1020] hover:bg-[#0F1020]/5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#0F1020] rounded-r"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-[#0F1020]" : "text-[#0F1020]/40"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info / Log out */}
        <div className="p-4 border-t border-black/5 bg-black/[0.01]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-[#0F1020]/5 border border-black/5 flex items-center justify-center font-bold text-[#0F1020]">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <span className="text-sm font-semibold block truncate text-[#0F1020]/90">
                {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Operator"}
              </span>
              <span className="text-xs text-[#0F1020]/40 block truncate">{user?.email}</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-red-600 border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 transition duration-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
        {/* Header */}
        <header className="h-20 border-b border-black/5 bg-white/40 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[#0F1020]/40 text-sm font-mono">Console</span>
            <span className="text-[#0F1020]/20 font-mono">/</span>
            <span className="text-sm font-semibold capitalize text-[#0F1020] font-mono">
              {activeTab}
            </span>
          </div>

          {/* User notifications / status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/10 text-green-600 text-xs font-mono font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Connected to MongoDB
            </div>

            <button className="p-2.5 hover:bg-[#0F1020]/5 border border-black/5 bg-[#FAFBFC] rounded-xl transition relative">
              <Bell className="h-4.5 w-4.5 text-[#0F1020]/60" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-[#0F1020] rounded-full" />
            </button>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-grow p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {data && (
                /* Tab Layout render */
                <div className="space-y-8">
                  {/* HOME TAB */}
                  {activeTab === "home" && (
                    <div className="space-y-8">
                      {/* Welcome Block */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h1 className="text-3xl font-bold tracking-tight">Welcome to Klin Dashboard</h1>
                          <p className="text-[#0F1020]/50 text-sm mt-1">Here is a live summary of your e-commerce operations fetched from MongoDB.</p>
                        </div>
                        <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-black/5 flex items-center gap-2 text-xs font-bold text-blue-600">
                          <Sparkles className="h-4 w-4 text-blue-500" />
                          Premium Plan Active
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { label: "Total Revenue", value: data.stats?.revenue || "$0.00", desc: "Gross completed earnings", icon: CreditCard, color: "text-emerald-600 bg-emerald-500/5 border-emerald-500/10" },
                          { label: "Completed Orders", value: data.stats?.ordersCount || 0, desc: "Successful checkouts", icon: ShoppingCart, color: "text-blue-600 bg-blue-500/5 border-blue-500/10" },
                          { label: "Active Products", value: data.stats?.productsCount || 0, desc: "Items in collection", icon: Package, color: "text-purple-600 bg-purple-500/5 border-purple-500/10" },
                          { label: "Total Templates", value: data.stats?.templatesCount || 0, desc: "Ready canvases", icon: FileCode, color: "text-amber-600 bg-amber-500/5 border-amber-500/10" }
                        ].map((stat, idx) => {
                          const StatIcon = stat.icon;
                          return (
                            <div key={idx} className="p-6 rounded-[24px] bg-white border border-black/5 hover:border-black/10 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.01]">
                              <div className="flex justify-between items-start mb-4">
                                <div className={`p-2.5 rounded-xl border ${stat.color}`}>
                                  <StatIcon className="h-5 w-5" />
                                </div>
                              </div>
                              <span className="text-[#0F1020]/40 text-xs font-semibold uppercase tracking-wider block">{stat.label}</span>
                              <h3 className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                              <p className="text-[#0F1020]/40 text-xs mt-1.5">{stat.desc}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Activity & Recent Orders */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 p-6 rounded-[32px] bg-white border border-black/5 shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Recent Orders</h3>
                            <button onClick={() => onNavigate("/dashboard/orders")} className="text-xs text-blue-600 font-bold hover:underline">View All</button>
                          </div>
                          
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                              <thead>
                                <tr className="border-b border-black/5 text-[#0F1020]/40 font-mono text-xs">
                                  <th className="pb-3">Order</th>
                                  <th className="pb-3">Customer</th>
                                  <th className="pb-3">Total</th>
                                  <th className="pb-3">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.recentOrders?.map((order: any) => (
                                  <tr key={order._id} className="border-b border-black/5 hover:bg-black/[0.01] text-[#0F1020]">
                                    <td className="py-3 font-mono text-xs text-blue-600 font-bold">{order.orderNumber}</td>
                                    <td className="py-3">
                                      <div className="font-semibold">{order.customerName}</div>
                                      <div className="text-xs text-[#0F1020]/40">{order.customerEmail}</div>
                                    </td>
                                    <td className="py-3 font-mono font-bold">${order.total?.toFixed(2)}</td>
                                    <td className="py-3">
                                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                        order.status === "Completed" ? "bg-emerald-500/10 text-emerald-600" :
                                        order.status === "Pending" ? "bg-amber-500/10 text-amber-600" : "bg-red-500/10 text-red-600"
                                      }`}>
                                        {order.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                                {(!data.recentOrders || data.recentOrders.length === 0) && (
                                  <tr>
                                    <td colSpan={4} className="py-8 text-center text-[#0F1020]/40 text-xs">No orders in database</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Quick Tips */}
                        <div className="space-y-6">
                          <div className="p-6 rounded-[24px] bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent border border-blue-500/10 shadow-sm">
                            <Sparkles className="h-6 w-6 text-blue-500 mb-4 animate-pulse" />
                            <h4 className="text-sm font-bold mb-2 text-[#0F1020]">Configure Web Experience</h4>
                            <p className="text-xs text-[#0F1020]/60 leading-relaxed mb-4">Redesign and construct interfaces dynamically. Go to your visual Canvas, edit modules, and template assets instantly.</p>
                            <button onClick={() => onNavigate("/")} className="w-full py-2.5 bg-[#0F1020] hover:bg-[#171A30] text-white rounded-xl text-xs font-semibold transition shadow-md">
                              Open Canvas Editor
                            </button>
                          </div>

                          <div className="p-6 rounded-[24px] bg-white border border-black/5 shadow-sm space-y-3">
                            <h4 className="text-sm font-bold text-[#0F1020]">Workspace Security</h4>
                            <p className="text-xs text-[#0F1020]/40 leading-relaxed">Protected by JWT session authentication and database-level security protocols.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ORDERS TAB */}
                  {activeTab === "orders" && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                          <h1 className="text-2xl font-bold">Orders Registry</h1>
                          <p className="text-[#0F1020]/50 text-xs mt-1">Search and filter active buyer transactions stored in your database.</p>
                        </div>

                        {/* Search */}
                        <div className="relative max-w-xs w-full">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0F1020]/40" />
                          <Input
                            type="text"
                            placeholder="Filter by customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[#FAFBFC] border border-[#0F1020]/10 rounded-xl text-xs text-[#0F1020] placeholder:text-[#0F1020]/30 focus:outline-none focus:border-[#0F1020]/20"
                          />
                        </div>
                      </div>

                      {/* Orders Table */}
                      <div className="p-6 rounded-[32px] bg-white border border-black/5 shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-sm">
                            <thead>
                              <tr className="border-b border-black/5 text-[#0F1020]/40 font-mono text-xs">
                                <th className="pb-3">Order Number</th>
                                <th className="pb-3">Customer</th>
                                <th className="pb-3">Total Amount</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="text-[#0F1020]">
                              {data.orders
                                ?.filter((order: any) =>
                                  order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((order: any) => (
                                  <tr key={order._id} className="border-b border-black/5 hover:bg-black/[0.01]">
                                    <td className="py-4 font-mono text-xs text-blue-600 font-bold">{order.orderNumber}</td>
                                    <td className="py-4">
                                      <div className="font-semibold">{order.customerName}</div>
                                      <div className="text-xs text-[#0F1020]/40">{order.customerEmail}</div>
                                    </td>
                                    <td className="py-4 font-mono font-bold">${order.total?.toFixed(2)}</td>
                                    <td className="py-4 text-xs text-[#0F1020]/60">
                                      {new Date(order.date).toLocaleDateString(undefined, {
                                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                      })}
                                    </td>
                                    <td className="py-4">
                                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                        order.status === "Completed" ? "bg-emerald-500/10 text-emerald-600" :
                                        order.status === "Pending" ? "bg-amber-500/10 text-amber-600" : "bg-red-500/10 text-red-600"
                                      }`}>
                                        {order.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              {(!data.orders || data.orders.length === 0) && (
                                <tr>
                                  <td colSpan={5} className="py-12 text-center text-[#0F1020]/40 text-xs">No orders retrieved.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRODUCTS TAB */}
                  {activeTab === "products" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h1 className="text-2xl font-bold">Products</h1>
                          <p className="text-[#0F1020]/50 text-xs mt-1">Create, update, and manage inventory fetched from the database.</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F1020] hover:bg-[#171A30] text-white font-semibold text-xs transition duration-300 shadow-md">
                          <Plus className="h-3.5 w-3.5" />
                          New Product
                        </button>
                      </div>

                      {/* Products Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.products?.map((product: any) => (
                          <div key={product._id} className="rounded-[24px] border border-black/5 bg-white overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-all duration-300">
                            {/* Product Image */}
                            <div className="h-44 overflow-hidden relative bg-black/5">
                              <img
                                src={product.image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80"}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute top-3 right-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${
                                  product.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-black/10 text-[#0F1020]/60 border border-black/10"
                                }`}>
                                  {product.status}
                                </span>
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-[#0F1020]">
                              <div className="space-y-2">
                                <span className="text-[10px] uppercase font-mono tracking-widest text-blue-600 font-semibold">{product.category}</span>
                                <h3 className="text-base font-bold truncate">{product.name}</h3>
                                <p className="text-[#0F1020]/50 text-xs leading-relaxed line-clamp-2">{product.description}</p>
                              </div>

                              <div className="flex justify-between items-center pt-3 border-t border-black/5">
                                <div>
                                  <span className="text-[10px] text-[#0F1020]/40 block font-mono">Retail Price</span>
                                  <span className="font-mono font-bold text-lg text-[#0F1020]">${product.price?.toFixed(2)}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] text-[#0F1020]/40 block font-mono">Total Sold</span>
                                  <span className="text-sm font-semibold text-[#0F1020]/80">{product.salesCount || 0} units</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(!data.products || data.products.length === 0) && (
                          <div className="col-span-full py-16 text-center text-[#0F1020]/40 text-xs">No products in database.</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TEMPLATES TAB */}
                  {activeTab === "templates" && (
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-2xl font-bold">Klin Templates</h1>
                        <p className="text-[#0F1020]/50 text-xs mt-1">Pre-styled templates saved in MongoDB. Edit or launch templates instantly.</p>
                      </div>

                      {/* Templates Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.templates?.map((tpl: any) => (
                          <div key={tpl._id} className="rounded-[24px] border border-black/5 bg-white overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-all duration-300 text-[#0F1020]">
                            <div className="h-48 relative overflow-hidden bg-black/5">
                              <img
                                src={tpl.thumbnail}
                                alt={tpl.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div className="space-y-2 mb-4">
                                <span className="text-[10px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-600 px-2 py-0.5 rounded-full">{tpl.category}</span>
                                <h3 className="text-base font-bold mt-1">{tpl.name}</h3>
                                <p className="text-xs text-[#0F1020]/50 leading-relaxed">{tpl.description}</p>
                              </div>
                              <div className="flex justify-between items-center pt-3 border-t border-black/5 text-xs text-[#0F1020]/60">
                                <span>⭐ {tpl.rating} Rating</span>
                                <span>{tpl.downloads} Downloads</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PAYMENT TAB */}
                  {activeTab === "payment" && (
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-2xl font-bold">Payment Transactions</h1>
                        <p className="text-[#0F1020]/50 text-xs mt-1">Comprehensive list of Stripe and PayPal transactions fetched from MongoDB.</p>
                      </div>

                      <div className="p-6 rounded-[32px] bg-white border border-black/5 shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-sm">
                            <thead>
                              <tr className="border-b border-black/5 text-[#0F1020]/40 font-mono text-xs">
                                <th className="pb-3">Transaction ID</th>
                                <th className="pb-3">Order Ref</th>
                                <th className="pb-3">Customer</th>
                                <th className="pb-3">Amount</th>
                                <th className="pb-3">Method</th>
                                <th className="pb-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="text-[#0F1020]">
                              {data.payments?.map((txn: any) => (
                                <tr key={txn._id} className="border-b border-black/5 hover:bg-black/[0.01]">
                                  <td className="py-4 font-mono text-xs text-[#0F1020]/80">{txn.paymentId}</td>
                                  <td className="py-4 font-mono text-xs text-blue-600">{txn.orderId}</td>
                                  <td className="py-4 font-semibold">{txn.customerName}</td>
                                  <td className="py-4 font-mono font-bold text-emerald-600">${txn.amount?.toFixed(2)}</td>
                                  <td className="py-4 text-xs text-[#0F1020]/50">{txn.paymentMethod}</td>
                                  <td className="py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                      txn.status === "Successful" ? "bg-emerald-500/10 text-emerald-600" :
                                      txn.status === "Processing" ? "bg-amber-500/10 text-amber-600" : "bg-red-500/10 text-red-600"
                                    }`}>
                                      {txn.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                              {(!data.payments || data.payments.length === 0) && (
                                <tr>
                                  <td colSpan={6} className="py-12 text-center text-[#0F1020]/40 text-xs">No payment records found.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SETTINGS TAB */}
                  {activeTab === "settings" && (
                    <div className="max-w-2xl space-y-6">
                      <div>
                        <h1 className="text-2xl font-bold">Workspace Settings</h1>
                        <p className="text-[#0F1020]/50 text-xs mt-1">Configure company profiles, notification settings, and visual themes saved directly in MongoDB.</p>
                      </div>

                      <form onSubmit={handleSaveSettings} className="space-y-6">
                        {/* Profile Section */}
                        <div className="p-6 rounded-[24px] bg-white border border-black/5 shadow-sm space-y-4">
                          <h3 className="text-sm font-bold flex items-center gap-2 border-b border-black/5 pb-3 text-[#0F1020]">
                            <Globe className="h-4 w-4 text-blue-600" />
                            Business Information
                          </h3>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <label className="block text-xs text-[#0F1020]/40 font-mono">Business Name</label>
                              <Input
                                type="text"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#FAFBFC] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-black/20"
                                placeholder="E.g. Flora Botanicals"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-xs text-[#0F1020]/40 font-mono">Support Email Address</label>
                              <Input
                                type="email"
                                value={supportEmail}
                                onChange={(e) => setSupportEmail(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#FAFBFC] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-black/20"
                                placeholder="E.g. support@florabotanicals.com"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Notifications */}
                        <div className="p-6 rounded-[24px] bg-white border border-black/5 shadow-sm space-y-4">
                          <h3 className="text-sm font-bold flex items-center gap-2 border-b border-black/5 pb-3 text-[#0F1020]">
                            <Mail className="h-4 w-4 text-purple-600" />
                            Preferences & Notifications
                          </h3>

                          <div className="space-y-3.5">
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={(e) => setEmailNotifications(e.target.checked)}
                                className="rounded bg-black/10 border-black/15 text-blue-600 focus:ring-0 focus:ring-offset-0 h-4 w-4"
                              />
                              <div>
                                <span className="text-sm font-semibold block text-[#0F1020]/80 group-hover:text-black transition">Email notifications</span>
                                <span className="text-[11px] text-[#0F1020]/40 block">Receive emails on completed customer orders and system alerts.</span>
                              </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={pushNotifications}
                                onChange={(e) => setPushNotifications(e.target.checked)}
                                className="rounded bg-black/10 border-black/15 text-blue-600 focus:ring-0 focus:ring-offset-0 h-4 w-4"
                              />
                              <div>
                                <span className="text-sm font-semibold block text-[#0F1020]/80 group-hover:text-black transition">Push alerts</span>
                                <span className="text-[11px] text-[#0F1020]/40 block">Enable instant notifications directly inside your browser console.</span>
                              </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={marketingEmails}
                                onChange={(e) => setMarketingEmails(e.target.checked)}
                                className="rounded bg-black/10 border-black/15 text-blue-600 focus:ring-0 focus:ring-offset-0 h-4 w-4"
                              />
                              <div>
                                <span className="text-sm font-semibold block text-[#0F1020]/80 group-hover:text-black transition">Marketing & product updates</span>
                                <span className="text-[11px] text-[#0F1020]/40 block">Stay updated with new layout releases and templates.</span>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Theme selections */}
                        <div className="p-6 rounded-[24px] bg-white border border-black/5 shadow-sm space-y-4">
                          <h3 className="text-sm font-bold flex items-center gap-2 border-b border-black/5 pb-3 text-[#0F1020]">
                            <Shield className="h-4 w-4 text-amber-600" />
                            Visual Theme Selection
                          </h3>
                          <div className="flex gap-4">
                            {["dark", "light", "glass"].map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setTheme(t)}
                                className={`flex-1 p-3 rounded-xl border text-xs font-semibold uppercase font-mono transition-all ${
                                  theme === t
                                    ? "bg-blue-50/10 border-blue-500 text-blue-600"
                                    : "bg-[#FAFBFC] border-black/5 text-[#0F1020]/50 hover:bg-[#0F1020]/5"
                                }`}
                              >
                                {t} Theme
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            type="submit"
                            disabled={savingSettings}
                            className="flex items-center gap-2 px-6 py-3 bg-[#0F1020] hover:bg-[#171A30] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition duration-300 shadow-md"
                          >
                            <Save className="h-3.5 w-3.5" />
                            {savingSettings ? "Saving Settings..." : "Save Configuration"}
                          </button>

                          <AnimatePresence>
                            {saveSuccess && (
                              <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-emerald-600 text-xs font-bold flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Settings saved successfully in database
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
