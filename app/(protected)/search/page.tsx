import SearchContent from "@/components/search/search-content";
import { ensureUserCreated } from "@/lib/db/function";

export const dynamic = "force-dynamic";

export default async function page() {
  await ensureUserCreated();
  return (
    <main className="p-5">
      <SearchContent />
    </main>
  );
}
