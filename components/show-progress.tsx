import { Progress } from "@/components/ui/progress";
import { Label } from "./ui/label";

export default function ShowProgress({ value }: { value: number }) {
  return (
    <div className="flex flex-col items-start gap-2 fixed bottom-5 right-5 bg-accent z-50 border border-line max-w-sm p-4 w-full rounded-md">
      <Label className="text-sm">Upload progess</Label>
      <Progress value={value} />
    </div>
  );
}
