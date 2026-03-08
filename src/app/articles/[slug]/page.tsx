import { createClient } from '@/lib/supabase/server'
import ArticleContent from '@/components/article/ArticleContent'
import PaywallBanner from '@/components/article/PaywallBanner'
import { notFound } from 'next/navigation'
import type { Article, Subscription, Purchase } from '@/types'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!article) notFound()

  const typedArticle = article as Article

  // Check paywall access
  let hasAccess = !typedArticle.is_paid

  if (!hasAccess) {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Check active subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      if ((subscription as Subscription | null)?.status === 'active') {
        hasAccess = true
      }

      if (!hasAccess) {
        // Check single purchase
        const { data: purchase } = await supabase
          .from('purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('article_id', typedArticle.id)
          .single()

        if (purchase as Purchase | null) hasAccess = true
      }
    }
  }

  const displayContent = hasAccess
    ? typedArticle.content ?? ''
    : (typedArticle.content ?? '').slice(0, 300)

  return (
    <article className="max-w-2xl mx-auto">
      {typedArticle.cover_image_url && (
        <img
          src={typedArticle.cover_image_url}
          alt={typedArticle.title}
          className="w-full h-64 object-cover rounded-xl mb-8"
        />
      )}

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {typedArticle.is_paid && (
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
              {typedArticle.price ? `¥${typedArticle.price.toLocaleString()}` : '有料'}
            </span>
          )}
          {typedArticle.published_at && (
            <time className="text-sm text-gray-400" dateTime={typedArticle.published_at}>
              {new Date(typedArticle.published_at).toLocaleDateString('ja-JP')}
            </time>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{typedArticle.title}</h1>
      </header>

      <ArticleContent content={displayContent} />

      {!hasAccess && typedArticle.is_paid && (
        <div className="mt-8">
          <PaywallBanner articleId={typedArticle.id} price={typedArticle.price} />
        </div>
      )}
    </article>
  )
}
