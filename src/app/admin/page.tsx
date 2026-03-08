import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Article } from '@/types'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  const published = (articles as Article[] | null)?.filter(a => a.status === 'published').length ?? 0
  const drafts = (articles as Article[] | null)?.filter(a => a.status === 'draft').length ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">管理ダッシュボード</h1>
        <Link
          href="/admin/articles/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700"
        >
          + 新規記事
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">総記事数</p>
          <p className="text-3xl font-bold">{articles?.length ?? 0}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">公開中</p>
          <p className="text-3xl font-bold text-green-600">{published}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">下書き</p>
          <p className="text-3xl font-bold text-amber-500">{drafts}</p>
        </div>
      </div>

      <p className="text-sm text-gray-400">ログイン中: {user?.email}</p>
    </div>
  )
}
