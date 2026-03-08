'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import ArticleSettings from '@/components/editor/ArticleSettings'
import { createClient } from '@/lib/supabase/client'
import type { Article } from '@/types'

const MarkdownEditor = dynamic(() => import('@/components/editor/MarkdownEditor'), { ssr: false })

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  const [price, setPrice] = useState<number | null>(null)
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          const a = data as Article
          setTitle(a.title)
          setSlug(a.slug)
          setExcerpt(a.excerpt ?? '')
          setContent(a.content ?? '')
          setIsPaid(a.is_paid)
          setPrice(a.price)
          setStatus(a.status)
        }
        setLoading(false)
      })
  }, [id])

  const handleSave = async () => {
    if (!title || !slug) {
      setError('タイトルとスラッグは必須です')
      return
    }
    setSaving(true)
    setError(null)

    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('articles')
      .update({
        title,
        slug,
        excerpt,
        content,
        is_paid: isPaid,
        price: isPaid ? price : null,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (dbError) {
      setError(dbError.message)
      setSaving(false)
    } else {
      router.push('/admin/articles')
    }
  }

  const handleDelete = async () => {
    if (!confirm('この記事を削除しますか？この操作は元に戻せません。')) return
    const supabase = createClient()
    await supabase.from('articles').delete().eq('id', id)
    router.push('/admin/articles')
  }

  if (loading) return <p className="text-gray-500">読み込み中...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">記事編集</h1>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="border border-red-300 text-red-600 px-4 py-2 rounded-full text-sm hover:bg-red-50"
          >
            削除
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm hover:bg-gray-700 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
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
          onTitleChange={setTitle}
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
