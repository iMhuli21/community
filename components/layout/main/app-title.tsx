"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function AppTitle() {
  const pathname = usePathname();

  const title = useMemo(() => {
    return pathname.split("/")[1];
  }, [pathname]);

  return <h1 className="text-base font-medium capitalize">{title}</h1>;
}
