'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo, Heading1, Heading2 } from 'lucide-react'

export function TipTapEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Escribe tu propuesta o carta comercial aquí...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[300px] max-w-none text-slate-800',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) {
    return <div className="h-[300px] w-full bg-slate-900/50 rounded-xl animate-pulse" />
  }

  return (
    <div className="border border-white/10 rounded-xl bg-white overflow-hidden flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50 shrink-0">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-cyan-100 text-cyan-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}
          title="Negrita"
          type="button"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-cyan-100 text-cyan-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}
          title="Cursiva"
          type="button"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-300 mx-1" />
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-cyan-100 text-cyan-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}
          title="Título Principal"
          type="button"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-cyan-100 text-cyan-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}
          title="Subtítulo"
          type="button"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-cyan-100 text-cyan-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}
          title="Lista con viñetas"
          type="button"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-cyan-100 text-cyan-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}
          title="Lista numerada"
          type="button"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-cyan-100 text-cyan-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}
          title="Cita"
          type="button"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 transition-colors"
          title="Deshacer"
          type="button"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 transition-colors"
          title="Rehacer"
          type="button"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Area */}
      <div className="p-4 bg-white flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
