'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PricingCard from '@/components/subscription/PricingCard'

export default function SubscribePage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = async () => {
    setLoading(true)
    const res = await fetch('/api/stripe/create-subscription', { method: 'POST' })
    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else if (data.error === 'unauthorized') {
      router.push('/login')
    } else {
      alert('エラーが発生しました。もう一度お試しください。')
      setLoading(false)
    }
  }

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">月額プラン</h1>
        <p className="text-gray-500">全有料記事が読み放題になります</p>
      </div>
      <PricingCard onSubscribe={handleSubscribe} loading={loading} />
    </div>
  )
}
