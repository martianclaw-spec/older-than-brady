import { getPost, POSTS } from "@/lib/posts";
import { OG_CONTENT_TYPE, OG_SIZE, renderOG } from "@/lib/og";

export const runtime = "edge";
export const alt = "Older Than Brady? — Blog";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateImageMetadata() {
  return POSTS.map(() => ({ id: "default" }));
}

export default async function OG({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) {
    return renderOG({
      eyebrow: "Blog",
      title: "Older Than Brady?",
      accent: "white"
    });
  }
  return renderOG({
    eyebrow: `Blog · ${post.readMins} min read`,
    title: post.title,
    subtitle: post.description,
    accent: "amber"
  });
}
