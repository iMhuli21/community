import { landingRoutes } from "@/lib/constants";
import { inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Navbar() {
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
        <div className="flex items-center gap-4">
          <Button variant={"outline"} asChild>
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Join free</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
