"use client";

import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignOutBtn() {
  const route = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);

      const res = await authClient.signOut();

      if (res.data?.success) {
        toast.info("Info", {
          description: "Successfully signed out",
        });

        return route.push("/");
      }
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "Unknown Error.",
      };
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={cn(
        loading
          ? "flex items-center gap-1 w-full pointer-events-none px-2 py-1.5 text-sm rounded-sm opacity-50 bg-destructive/10"
          : "flex items-center gap-1 w-full text-destructive hover:bg-destructive/20 px-2 py-1.5 text-sm rounded-sm hover:cursor-pointer",
      )}
      onClick={handleSignOut}
    >
      <LogOutIcon className="flex-none size-4" />
      Sign Out
    </div>
  );
}
