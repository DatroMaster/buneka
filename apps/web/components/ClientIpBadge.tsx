"use client";

import { useEffect, useState } from "react";

export function ClientIpBadge() {
  const [ip, setIp] = useState<string>("...");

  useEffect(() => {
    let active = true;
    fetch("/api/client-ip", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { ip?: string } | null) => {
        if (active) setIp(data?.ip || "gizli");
      })
      .catch(() => {
        if (active) setIp("gizli");
      });

    return () => {
      active = false;
    };
  }, []);

  return <span>IP: {ip}</span>;
}
