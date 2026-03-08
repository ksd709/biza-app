import Link from 'next/link'
import type { Article } from '@/types'

type Props = {
  article: Article
}

export default function ArticleCard({ article }: Props) {
  return (
    <article className="border-b border-gray-100 py-8">
      <Link href={`/articles/${article.slug}`} className="group block">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-gray-600 mb-2">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {article.excerpt}
              </p>
            )}
            <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
              {article.published_at && (
                <time dateTime={article.published_at}>
                  {new Date(article.published_at).toLocaleDateString('ja-JP')}
                </time>
              )}
              {article.is_paid && (
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  {article.price ? `¥${article.price.toLocaleString()}` : '有料'}
                </span>
              )}
            </div>
          </div>
          {article.cover_image_url && (
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-24 h-16 object-cover rounded"
            />
          )}
        </div>
      </Link>
    </article>
  )
}
