'use client'

import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import remarkGfm from 'remark-gfm'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({ value, onChange }: Props) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val ?? '')}
        height={600}
        previewOptions={{
          remarkPlugins: [[remarkGfm]],
        }}
      />
    </div>
  )
}
