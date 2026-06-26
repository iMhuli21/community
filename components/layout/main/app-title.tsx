"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function AppTitle() {
  const pathname = usePathname();

  const title = useMemo(() => {
    const length = pathname.split("/").length;

    if (length > 2) {
      return `${pathname.split("/")[length - 1]} ${pathname.split("/")[1]}`;
    }

    return pathname.split("/")[length - 1];
  }, [pathname]);

  return <h1 className="text-base font-medium capitalize">{title}</h1>;
}
