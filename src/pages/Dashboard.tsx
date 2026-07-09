"use client";
import { motion } from "framer-motion";
import {
  BarChart3,
  Eye,
  Users,
  TrendingUp,
  Plus,
  Settings,
  LogOut,
  Bell,
  Search,
} from "lucide-react";

type DashboardProps = {
  onLogout?: () => void;
};

export function Dashboard({ onLogout }: DashboardProps) {
  const stats = [
    { label: "Views", value: "12,543", change: "+12.5%", icon: Eye },
    { label: "Visitors", value: "3,842", change: "+8.2%", icon: Users },
    { label: "Conversions", value: "284", change: "+23.1%", icon: TrendingUp },
    { label: "Avg. Time", value: "3m 24s", change: "+15.3%", icon: BarChart3 },
  ];

  const projects = [
    { id: 1, name: "Landing Page", status: "Published", views: 5241, date: "Today" },
    { id: 2, name: "Product Showcase", status: "Draft", views: 0, date: "Yesterday" },
    { id: 3, name: "Blog Layout", status: "Published", views: 3156, date: "2 days ago" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-[#0F1020]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 border-b border-white/10 bg-[#0F1020]/95 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-white to-white/50 rounded-lg flex items-center justify-center">
              <span className="text-[#0F1020] font-bold text-sm">K</span>
            </div>
            <span className="font-semibold text-white">Klin</span>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-lg transition relative">
              <Bell className="h-5 w-5 text-white/70" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            <button className="p-2 hover:bg-white/10 rounded-lg transition">
              <Settings className="h-5 w-5 text-white/70" />
            </button>

            <button
              onClick={onLogout}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <LogOut className="h-5 w-5 text-white/70" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-display text-white mb-2">Welcome back! 👋</h1>
          <p className="text-white/60">Here's what's happening with your sites today.</p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-400">{stat.change}</span>
                </div>
                <h3 className="text-white/60 text-sm mb-1">{stat.label}</h3>
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Projects section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main content area */}
          <div className="lg:col-span-2">
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display text-white">Your Projects</h2>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#0F1020] font-semibold hover:bg-white/90 transition">
                  <Plus className="h-4 w-4" />
                  New Project
                </button>
              </div>

              <div className="space-y-3">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    variants={itemVariants}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{project.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span>
                            {project.views > 0 ? `${project.views} views` : "No views yet"}
                          </span>
                          <span>{project.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.status === "Published"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {project.status}
                        </span>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="text-white/40 group-hover:text-white transition"
                        >
                          →
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Quick actions */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 rounded-lg bg-white text-[#0F1020] font-medium hover:bg-white/90 transition text-sm">
                  Create New Site
                </button>
                <button className="w-full px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition text-sm">
                  View Templates
                </button>
                <button className="w-full px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition text-sm">
                  Documentation
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <h3 className="text-white font-semibold mb-3">💡 Pro Tip</h3>
              <p className="text-sm text-white/70">
                Use keyboard shortcuts to speed up your workflow. Press <kbd className="bg-white/10 px-2 py-1 rounded text-xs">?</kbd> to see all shortcuts.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
