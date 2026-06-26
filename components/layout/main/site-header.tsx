import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AppTitle from "./app-title";
import NavAvatar from "../nav-avatar";
import { auth } from "@/lib/auth/server";

export async function SiteHeader() {
  const { data: session } = await auth.getSession();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <AppTitle />
        <div className="ml-auto flex items-center gap-2">
          {session?.user && <NavAvatar name={session.user.name} />}
        </div>
      </div>
    </header>
  );
}
