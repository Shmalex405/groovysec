import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { ChevronLeft, ChevronRight, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import { navigation } from '@/lib/navigation';

export function DocPage() {
  const { category, slug } = useParams();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  // Determine the doc path based on URL
  const docPath = category ? `${category}/${slug}` : slug || 'overview';

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      try {
        const response = await fetch(`/content/${docPath}.md`);
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          setContent(null);
        }
      } catch {
        setContent(null);
      }
      setLoading(false);
    }
    loadContent();
  }, [docPath]);

  // Find prev/next navigation
  const allItems = navigation.flatMap(section => section.items);
  const currentHref = `/admin-guides/${docPath}`;
  const currentIndex = allItems.findIndex(item => item.href === currentHref);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The documentation page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="text-primary hover:underline"
        >
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <article className="pb-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-foreground">Docs</Link>
          </li>
          <ChevronRight size={14} />
          {category && (
            <>
              <li className="capitalize">{category.replace(/-/g, ' ')}</li>
              <ChevronRight size={14} />
            </>
          )}
          <li className="text-foreground capitalize">
            {(slug || 'overview').replace(/-/g, ' ')}
          </li>
        </ol>
      </nav>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeSlug]}
          components={{
            // Custom code block with copy button
            pre: ({ children, ...props }) => {
              const codeElement = children as React.ReactElement;
              const code = codeElement?.props?.children || '';
              const id = `code-${Math.random().toString(36).substr(2, 9)}`;
              return (
                <div className="relative group">
                  <pre {...props}>{children}</pre>
                  <button
                    onClick={() => copyToClipboard(String(code), id)}
                    className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Copy code"
                  >
                    {copied === id ? (
                      <Check size={14} className="text-green-400" />
                    ) : (
                      <Copy size={14} className="text-slate-300" />
                    )}
                  </button>
                </div>
              );
            },
            // External links open in new tab
            a: ({ href, children, ...props }) => {
              const isExternal = href?.startsWith('http');
              // Convert relative .md links to proper routes
              let finalHref = href || '';
              if (finalHref.endsWith('.md')) {
                finalHref = finalHref.replace('.md', '').replace('./', '/admin-guides/');
              }
              return (
                <a
                  href={finalHref}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  {...props}
                >
                  {children}
                  {isExternal && <ExternalLink size={12} className="inline ml-1" />}
                </a>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Prev/Next Navigation */}
      <nav className="mt-12 pt-6 border-t border-border">
        <div className="flex justify-between">
          {prevItem ? (
            <Link
              to={prevItem.href}
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <div>
                <div className="text-xs uppercase tracking-wide">Previous</div>
                <div className="font-medium">{prevItem.title}</div>
              </div>
            </Link>
          ) : <div />}

          {nextItem ? (
            <Link
              to={nextItem.href}
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground text-right"
            >
              <div>
                <div className="text-xs uppercase tracking-wide">Next</div>
                <div className="font-medium">{nextItem.title}</div>
              </div>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : <div />}
        </div>
      </nav>
    </article>
  );
}
