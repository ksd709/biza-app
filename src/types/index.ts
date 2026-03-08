export type Profile = {
  id: string
  username: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
}

export type ArticleStatus = 'draft' | 'published'

export type Article = {
  id: string
  author_id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  cover_image_url: string | null
  is_paid: boolean
  status: ArticleStatus
  price: number | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export type Subscription = {
  id: string
  user_id: string
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  status: 'active' | 'canceled' | 'past_due'
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export type Purchase = {
  id: string
  user_id: string
  article_id: string
  stripe_payment_intent_id: string | null
  amount: number | null
  created_at: string
}
