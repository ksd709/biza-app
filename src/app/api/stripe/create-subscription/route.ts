import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/client'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: user.email,
    line_items: [
      {
        price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID!,
        quantity: 1,
      },
    ],
    metadata: {
      type: 'subscription',
      user_id: user.id,
    },
    success_url: `${baseUrl}/?subscribed=true`,
    cancel_url: `${baseUrl}/subscribe`,
  })

  return NextResponse.json({ url: session.url })
}
