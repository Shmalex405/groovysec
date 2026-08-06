import { useState } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { usePageMeta } from "@/lib/use-page-meta";
import { getAllPosts, getAllTags, formatDate } from "@/lib/blog";

const CATEGORY_COLORS: Record<string, string> = {
  Research: "bg-[#1A5FB4]/10 text-[#1A5FB4] border-[#1A5FB4]/25",
  Engineering: "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/25",
  News: "bg-[#A05F00]/10 text-[#A05F00] border-[#A05F00]/25",
};

export default function Blog() {
  usePageMeta(
    "Blog",
    "Insights on AI governance, compliance, and offensive security from the Groovy Security team — engineering deep dives, research, and product news."
  );

  const posts = getAllPosts();
  const tags = getAllTags();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const visible = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;

  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen">
        <Navigation />

        {/* Hero */}
        <section className="pt-32 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HeroTextReveal>
              <HeroLine>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-[#0F1B2D]">
                  The Groovy Security Blog
                </h1>
              </HeroLine>
              <HeroLine>
                <p className="text-lg text-[#51617A] max-w-2xl mx-auto leading-relaxed">
                  Engineering deep dives, original research, and product news on
                  securing AI and automating security.
                </p>
              </HeroLine>
            </HeroTextReveal>
          </div>
        </section>

        {/* Tag filter */}
        {tags.length > 0 && (
          <section className="pb-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  activeTag === null
                    ? "bg-[#0F1B2D]/[0.04] text-[#0F1B2D] border-[#0F1B2D]/30"
                    : "text-[#51617A] border-[#0F1B2D]/10 hover:text-[#0F1B2D] hover:border-[#0F1B2D]/25"
                }`}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                    activeTag === tag
                      ? "bg-[#0F1B2D]/[0.04] text-[#0F1B2D] border-[#0F1B2D]/30"
                      : "text-[#51617A] border-[#0F1B2D]/10 hover:text-[#0F1B2D] hover:border-[#0F1B2D]/25"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Post list */}
        <section className="pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {visible.length === 0 ? (
              <p className="text-center text-[#6E7B8C]">No posts yet — check back soon.</p>
            ) : (
              <StaggerChildren className="space-y-6">
                {visible.map((post) => (
                  <StaggerItem key={post.slug}>
                    <Link href={`/blog/${post.slug}`}>
                      <article className="group p-8 bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] hover:border-[#1A5FB4]/40 hover:shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)] transition-all duration-300 cursor-pointer">
                        <div className="flex items-center gap-3 mb-4">
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
                        <h2 className="text-xl font-bold text-[#0F1B2D] mb-3 group-hover:text-[#1A5FB4] transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-sm text-[#51617A] leading-relaxed mb-5">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#6E7B8C]">
                            By {post.author}
                            {post.role ? `, ${post.role}` : ""}
                          </span>
                          <span className="inline-flex items-center text-sm text-[#1A5FB4] group-hover:text-[#164F96] transition-colors">
                            Read more
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </article>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            )}
          </div>
        </section>

        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}
