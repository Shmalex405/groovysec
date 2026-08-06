import { Link } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { usePageMeta } from "@/lib/use-page-meta";
import { getPostBySlug, formatDate } from "@/lib/blog";
import NotFound from "@/pages/not-found";

const CATEGORY_COLORS: Record<string, string> = {
  Research: "bg-[#1A5FB4]/10 text-[#1A5FB4] border-[#1A5FB4]/25",
  Engineering: "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/25",
  News: "bg-[#A05F00]/10 text-[#A05F00] border-[#A05F00]/25",
};

export default function BlogPost({ slug }: { slug: string }) {
  const post = getPostBySlug(slug);

  // Hooks must run unconditionally — pass undefined meta when the post is missing.
  usePageMeta(post?.title, post?.excerpt);

  if (!post) return <NotFound />;

  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen">
        <Navigation />

        <article className="pt-32 pb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-[#51617A] hover:text-[#0F1B2D] transition-colors mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to Blog
            </Link>

            {/* Header */}
            <header className="mb-10">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold border rounded ${
                    CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.News
                  }`}
                >
                  {post.category.toUpperCase()}
                </span>
                <span className="inline-flex items-center text-xs text-[#6E7B8C]">
                  <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
                  {formatDate(post.date)}
                </span>
                <span className="inline-flex items-center text-xs text-[#6E7B8C]">
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  {post.readingTime}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0F1B2D] mb-4 leading-tight tracking-tight">
                {post.title}
              </h1>
              <p className="text-sm text-[#6E7B8C]">
                By {post.author}
                {post.role ? `, ${post.role}` : ""}
              </p>
            </header>

            {/* Body */}
            <div className="prose prose-slate max-w-none prose-headings:text-[#0F1B2D] prose-headings:font-bold prose-a:text-[#1A5FB4] hover:prose-a:text-[#164F96] prose-strong:text-[#0F1B2D] prose-blockquote:border-l-[#1A5FB4]/40 prose-blockquote:text-[#51617A] prose-code:text-[#1A5FB4] prose-li:text-[#51617A] prose-p:text-[#51617A] prose-p:leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>

            {/* Footer / tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[#0F1B2D]/10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-md border border-[#0F1B2D]/10 text-[#51617A]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}
