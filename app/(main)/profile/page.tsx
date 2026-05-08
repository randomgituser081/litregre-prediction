"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { User, Bell, Shield, LogOut, Trophy, Star } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/profile");
    },
  });

  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="skeleton h-48 w-full rounded-2xl mb-4" />
        <div className="skeleton h-32 w-full rounded-xl" />
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      {/* Profile card */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 mb-5 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white/40">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={28} />}
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">{user?.name ?? "Member"}</h1>
            <p className="text-white/80 text-sm">{user?.email}</p>
            <span className="badge badge-sm bg-white/20 text-white border-0 mt-1">Free Plan</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { icon: <Trophy size={16} />, val: "0", label: "Tips Saved" },
          { icon: <Star size={16} />, val: "0", label: "Favourites" },
          { icon: <Bell size={16} />, val: "0", label: "Alerts" },
        ].map((s) => (
          <div key={s.label} className="bg-base-100 border border-base-300 rounded-xl p-3 text-center">
            <div className="flex justify-center text-primary mb-1">{s.icon}</div>
            <p className="font-bold text-lg">{s.val}</p>
            <p className="text-[10px] text-base-content/60">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="bg-base-100 border border-base-300 rounded-xl divide-y divide-base-300 mb-4">
        {[
          { icon: <User size={15} />, label: "Edit Profile", href: "#" },
          { icon: <Bell size={15} />, label: "Notifications", href: "#" },
          { icon: <Shield size={15} />, label: "Change Password", href: "#" },
        ].map((item) => (
          <a key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-3 hover:bg-base-200/50 transition-colors">
            <span className="text-primary">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
            <span className="ml-auto text-base-content/30">›</span>
          </a>
        ))}
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="btn btn-error btn-outline btn-sm gap-2"
      >
        <LogOut size={14} /> Sign Out
      </button>
    </div>
  );
}
