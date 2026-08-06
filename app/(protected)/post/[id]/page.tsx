import BackBtn from "@/components/back-btn";
import PostContent from "@/components/post/post-content";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function page({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <PostContent id={id} />
    </div>
  );
}
