import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { IconLucide } from '@/lib/icon-lucide'
import type { Editor } from '@tiptap/core'
import { useState } from 'react'
import { ToolbarButton } from '../misc/toolbar-button'
import { LinkEditBlock } from './link-edit-block'


export interface LinkProps {
    url: string
    text?: string
    openInNewTab?: boolean
}

const LinkEditPopover = ({ editor }: { editor: Editor }) => {
    const [open, setOpen] = useState(false)

    const setLink = ({ url, text, openInNewTab }: LinkProps) => {
        editor
            .chain()
            .extendMarkRange('link')
            .insertContent({
                type: 'text',
                text: text || url,
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

        editor.commands.enter()
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <ToolbarButton isActive={editor.isActive('link')} tooltip="Link" disabled={editor.isActive('codeBlock')}>
                    <IconLucide name="Link" className="h-5 w-5" />
                </ToolbarButton>
            </PopoverTrigger>
            <PopoverContent className="w-full min-w-80" align="start" side="bottom">
                <LinkEditBlock editor={editor} close={() => setOpen(false)} onSetLink={setLink} />
            </PopoverContent>
        </Popover>
    )
}

export { LinkEditPopover }