'use client'

type Props = {
  onSubscribe: () => void
  loading?: boolean
}

export default function PricingCard({ onSubscribe, loading }: Props) {
  return (
    <div className="border border-gray-200 rounded-2xl p-8 max-w-sm mx-auto shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-1">月額プラン</h2>
      <p className="text-gray-500 text-sm mb-6">全有料記事が読み放題</p>

      <div className="text-4xl font-bold text-gray-900 mb-6">
        ¥980<span className="text-lg font-normal text-gray-500">/月</span>
      </div>

      <ul className="space-y-2 text-sm text-gray-600 mb-8">
        <li className="flex items-center gap-2">
          <span className="text-green-500">✓</span> 全有料記事の閲覧
        </li>
        <li className="flex items-center gap-2">
          <span className="text-green-500">✓</span> 新着記事の優先アクセス
        </li>
        <li className="flex items-center gap-2">
          <span className="text-green-500">✓</span> いつでもキャンセル可能
        </li>
      </ul>

      <button
        onClick={onSubscribe}
        disabled={loading}
        className="w-full bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-gray-700 disabled:opacity-50"
      >
        {loading ? '処理中...' : '月額プランに加入する'}
      </button>
    </div>
  )
}
