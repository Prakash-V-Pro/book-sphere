"use client";

import { useEffect, useState } from "react";

interface UserProfile {
  name: string;
}

const STORAGE_KEY = "booksphere-user";

export function AuthButton() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setUser(JSON.parse(raw) as UserProfile);
    }
  }, []);

  const handleSignIn = () => {
    const profile = { name: "Guest" };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setUser(profile);
  };

  const handleSignOut = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  if (!user) {
    return (
      <button
        className="btn-secondary dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        onClick={handleSignIn}
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        {user.name.charAt(0)}
      </div>
      <div className="text-sm text-slate-700 dark:text-slate-200">
        Hi, {user.name}
        <button
          className="ml-3 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

