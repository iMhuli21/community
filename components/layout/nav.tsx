import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { inter } from "@/lib/fonts";
import { Button } from "../ui/button";
import { auth } from "@/lib/auth/server";
import { landingRoutes } from "@/lib/constants";
import NavAvatar from "./nav-avatar";

export default async function Navbar() {
  const { data: session } = await auth.getSession();

  return (
    <header className="border-b border-line bg-white">
      <nav className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-2">
          <Image
            src="/Logo.png"
            width={500}
            height={500}
            alt="Logo"
            className="w-12 h-12"
          />
          <h4
            className={cn(
              "text-lg tracking-tighter font-medium",
              inter.className,
            )}
          >
            Comm<em className="italic">unity</em>
          </h4>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground font-medium">
          {landingRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="hover:text-green transition-colors duration-100 ease-in"
            >
              {route.label}
            </Link>
          ))}
        </div>
        {!session?.user ? (
          <div className="flex items-center gap-4">
            <Button variant={"outline"} asChild>
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Join free</Link>
            </Button>
          </div>
        ) : (
          <NavAvatar name={session.user.name} />
        )}
      </nav>
    </header>
  );
}
