"use client";

import { LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PublicPanelLinkProps = {
  className?: string;
  authenticatedLabel?: string;
  guestLabel?: string;
  iconSize?: number;
};

export function PublicPanelLink({
  className,
  authenticatedLabel = "Yönetim Platformu",
  guestLabel = "Sisteme Giriş Yap",
  iconSize = 14,
}: PublicPanelLinkProps) {
  const supabase = useMemo(() => createClient(), []);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (mounted) setIsAuthenticated(Boolean(data.session?.user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const authenticated = isAuthenticated === true;
  const Icon = authenticated ? LayoutDashboard : LogIn;

  return (
    <Link href={authenticated ? "/app" : "/login"} className={className}>
      <Icon size={iconSize} />
      {authenticated ? authenticatedLabel : guestLabel}
    </Link>
  );
}
