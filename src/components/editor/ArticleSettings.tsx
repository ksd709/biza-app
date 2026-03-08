'use client'

type Props = {
  title: string
  slug: string
  excerpt: string
  isPaid: boolean
  price: number | null
  status: 'draft' | 'published'
  onTitleChange: (v: string) => void
  onSlugChange: (v: string) => void
  onExcerptChange: (v: string) => void
  onIsPaidChange: (v: boolean) => void
  onPriceChange: (v: number | null) => void
  onStatusChange: (v: 'draft' | 'published') => void
}

export default function ArticleSettings({
  title, slug, excerpt, isPaid, price, status,
  onTitleChange, onSlugChange, onExcerptChange,
  onIsPaidChange, onPriceChange, onStatusChange,
}: Props) {
  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="記事タイトル"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">スラッグ (URL)</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="my-article-slug"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">概要</label>
        <textarea
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="記事の概要（一覧に表示されます）"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPaid}
            onChange={(e) => onIsPaidChange(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">有料記事</span>
        </label>

        {isPaid && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">単品価格:</span>
            <span className="text-sm">¥</span>
            <input
              type="number"
              value={price ?? ''}
              onChange={(e) => onPriceChange(e.target.value ? Number(e.target.value) : null)}
              className="w-24 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="500"
              min="0"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <label className="block text-sm font-medium text-gray-700">公開状態:</label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as 'draft' | 'published')}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="draft">下書き</option>
          <option value="published">公開</option>
        </select>
      </div>
    </div>
  )
}
