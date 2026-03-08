import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/client'
import { NextRequest, NextResponse } from 'next/server'
import type { Article } from '@/types'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const articleId = formData.get('articleId') as string

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', articleId)
    .single()

  if (!article || !(article as Article).price) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }

  const typedArticle = article as Article
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'jpy',
          product_data: { name: typedArticle.title },
          unit_amount: typedArticle.price!,
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: 'article_purchase',
      article_id: articleId,
      user_id: user.id,
    },
    success_url: `${baseUrl}/articles/${typedArticle.slug}?purchased=true`,
    cancel_url: `${baseUrl}/articles/${typedArticle.slug}`,
  })

  return NextResponse.redirect(session.url!, { status: 303 })
}
