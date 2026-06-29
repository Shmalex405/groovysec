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
  Research: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Engineering: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  News: "bg-amber-500/15 text-amber-400 border-amber-500/25",
};

export default function BlogPost({ slug }: { slug: string }) {
  const post = getPostBySlug(slug);

  // Hooks must run unconditionally — pass undefined meta when the post is missing.
  usePageMeta(post?.title, post?.excerpt);

  if (!post) return <NotFound />;

  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen bg-slate-950">
        <Navigation />

        <article className="pt-32 pb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-8"
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
                <span className="inline-flex items-center text-xs text-slate-500">
                  <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
                  {formatDate(post.date)}
                </span>
                <span className="inline-flex items-center text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  {post.readingTime}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
                {post.title}
              </h1>
              <p className="text-sm text-slate-500">
                By {post.author}
                {post.role ? `, ${post.role}` : ""}
              </p>
            </header>

            {/* Body */}
            <div className="prose prose-invert prose-slate max-w-none prose-headings:text-white prose-headings:font-bold prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-white prose-blockquote:border-l-blue-500/40 prose-blockquote:text-slate-300 prose-code:text-blue-300 prose-li:text-slate-300 prose-p:text-slate-300 prose-p:leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>

            {/* Footer / tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full border border-white/[0.08] text-slate-400"
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
