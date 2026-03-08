'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import ArticleSettings from '@/components/editor/ArticleSettings'
import { createClient } from '@/lib/supabase/client'

const MarkdownEditor = dynamic(() => import('@/components/editor/MarkdownEditor'), { ssr: false })

export default function NewArticlePage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  const [price, setPrice] = useState<number | null>(null)
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTitleChange = (v: string) => {
    setTitle(v)
    if (!slug) {
      setSlug(v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    }
  }

  const handleSave = async () => {
    if (!title || !slug) {
      setError('タイトルとスラッグは必須です')
      return
    }
    setSaving(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('ログインが必要です')
      setSaving(false)
      return
    }

    const { error: dbError } = await supabase.from('articles').insert({
      author_id: user.id,
      title,
      slug,
      excerpt,
      content,
      is_paid: isPaid,
      price: isPaid ? price : null,
      status,
      published_at: status === 'published' ? new Date().toISOString() : null,
    })

    if (dbError) {
      setError(dbError.message)
      setSaving(false)
    } else {
      router.push('/admin/articles')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">新規記事作成</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm hover:bg-gray-700 disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存'}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg">{error}</p>
      )}

      <div className="mb-4">
        <ArticleSettings
          title={title}
          slug={slug}
          excerpt={excerpt}
          isPaid={isPaid}
          price={price}
          status={status}
          onTitleChange={handleTitleChange}
          onSlugChange={setSlug}
          onExcerptChange={setExcerpt}
          onIsPaidChange={setIsPaid}
          onPriceChange={setPrice}
          onStatusChange={setStatus}
        />
      </div>

      <MarkdownEditor value={content} onChange={setContent} />
    </div>
  )
}
