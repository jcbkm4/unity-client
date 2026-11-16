import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { useGetArticlesQuery } from "../../services/articlesApi";
import { formatDate, uploadUrlFromFilename } from "../../../libs/shared/ui";
import { getMarkdownPreview } from "../../../libs/utils/markdown";

export default function LatestArticlesSection() {
  const { data, isLoading, isError } = useGetArticlesQuery({ page: 1, limit: 3, order: "createdAt" });

  return (
    <section className="section-y bg-background">
      <div className="content-container">
        <div className="mb-12 text-center">
          <h2 className="display-lg text-foreground">Latest from the field.</h2>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading stories…</div>
        ) : isError ? (
          <div className="text-center text-destructive">Stories could not be loaded.</div>
        ) : !data?.items?.length ? (
          <div className="rounded-2xl bg-muted p-8 text-center text-muted-foreground">No stories yet.</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {data.items.map((article) => {
              const cover = uploadUrlFromFilename("community", article.boardImage);
              return (
                <Link key={article._id} to={`/articles/${article._id}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                    {cover && (
                      <img
                        src={cover}
                        alt={article.boardTitle}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <div className="mt-5 flex items-center gap-2">
                    <span className="rounded-full bg-foreground px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-background">
                      Story
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{formatDate(article.createdAt)}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-foreground">
                    {article.boardTitle}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[15px] leading-6 text-muted-foreground">
                    {getMarkdownPreview(article.boardContent, 120)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                    Read story <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link to="/articles" className="btn-pill btn-pill-outline">
            All stories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
