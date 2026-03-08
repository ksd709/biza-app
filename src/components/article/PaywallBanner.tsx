'use client'

import Link from 'next/link'

type Props = {
  articleId: string
  price: number | null
}

export default function PaywallBanner({ articleId, price }: Props) {
  return (
    <div className="relative">
      {/* Gradient fade */}
      <div className="absolute -top-24 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none" />

      <div className="border border-gray-200 rounded-2xl p-8 text-center bg-white shadow-sm">
        <div className="text-2xl mb-2">🔒</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">この記事は有料コンテンツです</h3>
        <p className="text-gray-500 text-sm mb-6">
          続きを読むにはサブスクリプションへの加入、または単品購入が必要です。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/subscribe"
            className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-700"
          >
            月額プランに加入する
          </Link>
          {price && (
            <form action="/api/stripe/create-checkout" method="POST">
              <input type="hidden" name="articleId" value={articleId} />
              <button
                type="submit"
                className="border border-gray-900 text-gray-900 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 w-full"
              >
                ¥{price.toLocaleString()} で購入する
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
