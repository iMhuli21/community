import SettingsContent from "@/components/settings/settings-content";
import { ensureUserCreated } from "@/lib/db/function";

export const dynamic = "force-dynamic";

export default async function page() {
  await ensureUserCreated();
  return (
    <div>
      <SettingsContent />
    </div>
  );
}
