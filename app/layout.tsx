import type { Metadata } from "next";
import { instrument, inter } from "@/lib/fonts";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/hooks/providers/react-query/query-provider";

export const metadata: Metadata = {
  title: "Comm-unity",
  description: "Your neighbourhood, open to everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        instrument.className,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
