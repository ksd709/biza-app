import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Article } from '@/types'

export default async function AdminArticlesPage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">記事管理</h1>
        <Link
          href="/admin/articles/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700"
        >
          + 新規記事
        </Link>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">タイトル</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">ステータス</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">種別</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">作成日</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {(articles as Article[] | null)?.map((article) => (
              <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{article.title}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    article.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {article.status === 'published' ? '公開中' : '下書き'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {article.is_paid ? (
                    <span className="text-amber-600 font-medium">有料</span>
                  ) : (
                    <span className="text-gray-400">無料</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(article.created_at).toLocaleDateString('ja-JP')}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="text-gray-600 hover:text-gray-900 underline"
                  >
                    編集
                  </Link>
                </td>
              </tr>
            ))}
            {(!articles || articles.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  記事がありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
