import { inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white flex flex-col items-start md:flex-row md:items-center md:justify-between gap-4 p-5">
      <div className="flex items-center gap-2">
        <Image
          src="/Logo.png"
          width={500}
          height={500}
          loading="lazy"
          className="w-10 h-10"
          alt="logo"
        />
        <h3 className={cn(inter.className, "tracking-tighter")}>
          Comm<em className="italic">unity</em>
        </h3>
      </div>
      <p className={cn("text-xs text-muted-foreground uppercase font-medium")}>
        Developed by HULITHEDEV
      </p>
      <div className="text-xs text-muted-foreground">
        &copy; 2026 Community. Built for neighbourhoods.
      </div>
    </footer>
  );
}
