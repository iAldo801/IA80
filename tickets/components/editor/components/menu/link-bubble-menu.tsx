import type { Editor } from '@tiptap/core'
import type { EditorState } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import { BubbleMenu } from '@tiptap/react'
import { useState } from 'react'
import { LinkEditBlock } from '../link/link-edit-block'
import { LinkPopoverBlock } from '../link/link-popover-block'

export interface LinkProps {
    url: string
    text?: string
    openInNewTab?: boolean
}

export interface ShouldShowProps {
    editor: Editor
    view: EditorView
    state: EditorState
    oldState?: EditorState
    from: number
    to: number
}

const LinkBubbleMenu = ({ editor }: { editor: Editor }) => {
    const [showEdit, setShowEdit] = useState(false)
    const shouldShow = ({ editor, from, to }: ShouldShowProps) => {
        if (from === to) {
            return false
        }

        const link = editor.getAttributes('link')

        if (link.href) {
            return true
        }

        return false
    }

    const unSetLink = () => {
        editor.chain().extendMarkRange('link').unsetLink().focus().run()
        setShowEdit(false)
    }

    function onSetLink({ url, text, openInNewTab }: LinkProps) {
        editor
            .chain()
            .extendMarkRange('link')
            .insertContent({
                type: 'text',
                text: text,
                marks: [
                    {
                        type: 'link',
                        attrs: {
                            href: url,
                            target: openInNewTab ? '_blank' : ''
                        }
                    }
                ]
            })
            .setLink({ href: url })
            .focus()
            .run()

        setShowEdit(false)
    }

    return (
        <BubbleMenu
            editor={editor}
            shouldShow={shouldShow}
            tippyOptions={{
                placement: 'bottom-start',
                onHidden: () => {
                    setShowEdit(false)
                }
            }}
        >
            {showEdit ? (
                <LinkEditBlock
                    onSetLink={onSetLink}
                    editor={editor}
                    className="w-full min-w-80 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none"
                />
            ) : (
                <LinkPopoverBlock onClear={unSetLink} link={editor.getAttributes('link')} onEdit={() => setShowEdit(true)} />
            )}
        </BubbleMenu>
    )
}

export { LinkBubbleMenu }