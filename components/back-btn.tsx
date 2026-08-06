"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackBtn({ href }: { href: string }) {
  const route = useRouter();
  return (
    <Button
      className="flex items-center gap-2"
      variant={"outline"}
      onClick={() => route.push(href)}
    >
      <ArrowLeft />
      <span>Back</span>
    </Button>
  );
}
