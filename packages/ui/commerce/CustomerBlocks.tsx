"use client";

import { forwardRef, useState } from "react";
import { Heart, GitCompare, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { cn } from "../../utils/cn";
import type { EditableProps } from "../../types";

export interface CustomerBlocksProps extends EditableProps {
  active?: boolean;
  onClick?: () => void;
}

const WishlistButton = forwardRef<HTMLButtonElement, CustomerBlocksProps>(
  ({ active = false, onClick, className, ...props }, ref) => {
    const [isWishlisted, setIsWishlisted] = useState(active);
    return (
      <button
        ref={ref}
        onClick={(e) => {
          setIsWishlisted(!isWishlisted);
          onClick?.();
        }}
        className={cn(
          "p-2.5 rounded-xl border border-[#0F1020]/10 bg-white transition duration-300",
          isWishlisted ? "text-red-500 border-red-500/20 bg-red-500/5" : "text-[#0F1020]/60 hover:text-[#0F1020] hover:border-[#0F1020]/25",
          className
        )}
        {...props}
      >
        <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
      </button>
    );
  }
);
WishlistButton.displayName = "WishlistButton";

const CompareButton = forwardRef<HTMLButtonElement, CustomerBlocksProps>(
  ({ active = false, onClick, className, ...props }, ref) => {
    const [isComparing, setIsComparing] = useState(active);
    return (
      <button
        ref={ref}
        onClick={() => {
          setIsComparing(!isComparing);
          onClick?.();
        }}
        className={cn(
          "p-2.5 rounded-xl border border-[#0F1020]/10 bg-white transition duration-300",
          isComparing ? "text-blue-500 border-blue-500/20 bg-blue-500/5" : "text-[#0F1020]/60 hover:text-[#0F1020] hover:border-[#0F1020]/25",
          className
        )}
        {...props}
      >
        <GitCompare className="h-5 w-5" />
      </button>
    );
  }
);
CompareButton.displayName = "CompareButton";

const AccountMenu = forwardRef<HTMLDivElement, { username?: string; className?: string }>(
  ({ username = "User", className, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#0F1020]/5 text-[#0F1020] transition duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
            {username.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-sm font-semibold hidden sm:inline">{username}</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-[#0F1020]/10 shadow-2xl rounded-2xl p-2 z-50 animate-scaleIn">
            <div className="px-3 py-2 text-xs font-bold text-[#0F1020]/40 uppercase tracking-wider">
              My Account
            </div>
            <ul className="space-y-0.5">
              <li>
                <a
                  href="/dashboard/home"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#FAFBFC] text-[#0F1020]/80 hover:text-[#0F1020]"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/settings"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#FAFBFC] text-[#0F1020]/80 hover:text-[#0F1020]"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </a>
              </li>
              <li className="border-t border-[#0F1020]/5 mt-1 pt-1">
                <button
                  onClick={() => (window.location.href = "/logout")}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-red-500/5 text-red-500 text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }
);
AccountMenu.displayName = "AccountMenu";

const LoginButton = forwardRef<HTMLButtonElement, CustomerBlocksProps>(
  ({ onClick, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 px-5 py-2 h-10 rounded-xl bg-[#0F1020] text-white hover:bg-[#171A30] transition duration-300 font-semibold text-sm shadow-md",
          className
        )}
        {...props}
      >
        <User className="h-4 w-4" />
        Login
      </button>
    );
  }
);
LoginButton.displayName = "LoginButton";

export { WishlistButton, CompareButton, AccountMenu, LoginButton };
