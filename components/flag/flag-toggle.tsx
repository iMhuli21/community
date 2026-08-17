import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { TbShieldCheck } from "react-icons/tb";

export default function FlagToggle() {
  const route = useRouter();

  const searchParams = useSearchParams();

  const [value, setValue] = useState(
    searchParams.get("active") ?? "my_appeals",
  );

  return (
    <Tabs
      defaultValue={value}
      className="w-fit bg-white rounded-lg"
      onValueChange={(val) => route.push(`/flags?active=${val}`)}
    >
      <TabsList className="bg-white">
        <TabsTrigger
          value="my_appeals"
          className="data-active:bg-black data-active:text-white data-active:hover:text-white data-active:hover:bg-black/80 group"
        >
          <User className="size-4" />
          My appeals
        </TabsTrigger>
        <TabsTrigger
          value="mod_queue"
          className="data-active:bg-black data-active:text-white data-active:hover:text-white data-active:hover:bg-black/80 group"
        >
          <TbShieldCheck />
          Mod queue
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
