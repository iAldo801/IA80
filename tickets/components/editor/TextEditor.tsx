'use client'

import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Plugin, TextSelection } from '@tiptap/pm/state'
import { EditorContent, getMarkRange, ReactNodeViewRenderer, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Separator } from '../ui/separator'
import { ImageViewBlock } from './components/image/image-view-block'
import { ImageBubbleMenu } from './components/menu/image-bubble-menu'
import { LinkBubbleMenu } from './components/menu/link-bubble-menu'
import Other from './components/other/Other'
import TextStyles from './components/text/styles/TextStyles'

export default function TextEditor({ value, onChange }: { value: string; onChange: (value: string) => void; }) {
    const editor = useEditor({
        editorProps: {
            attributes: {
                class:
                    "min-h-[30rem] max-h-[30rem] w-full rounded-sm rounded-tr-none rounded-tl-none border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto",
            },
        },
        extensions: [
            StarterKit.configure({
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal pl-4",
                    },
                },
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc pl-4",
                    },
                },
            }),
            Image.configure({
                // @ts-expect-error
                addNodeView() {
                    return ReactNodeViewRenderer(ImageViewBlock)
                }
            }),
            Link.configure({
                openOnClick: false
            }).extend({
                inclusive: false,

                addProseMirrorPlugins() {
                    return [
                        new Plugin({
                            props: {
                                handleClick(view, pos) {
                                    const { schema, doc, tr } = view.state
                                    const range = getMarkRange(doc.resolve(pos), schema.marks.link)

                                    if (!range) {
                                        return
                                    }

                                    const { from, to } = range
                                    const start = Math.min(from, to)
                                    const end = Math.max(from, to)

                                    if (pos < start || pos > end) {
                                        return
                                    }

                                    const $start = doc.resolve(start)
                                    const $end = doc.resolve(end)
                                    const transaction = tr.setSelection(new TextSelection($start, $end))

                                    view.dispatch(transaction)
                                }
                            }
                        })
                    ]
                }
            })
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className='flex flex-col justify-stretch'>
            {editor && (
                <>
                    <TextEditorToolbar editor={editor} />
                    <EditorContent editor={editor} />
                    <LinkBubbleMenu editor={editor} />
                    <ImageBubbleMenu editor={editor} />
                </>
            )}
        </div>
    )
}

const TextEditorToolbar = ({ editor }: { editor: Editor }) => {
    return (
        <div className="border border-input bg-transparent rounded-tr-sm rounded-tl-sm p-1 flex flex-row items-center gap-1">
            <TextStyles editor={editor} />
            <Separator orientation="vertical" className="mx-2 h-7" />
            <Other editor={editor} />
        </div>
    );
};