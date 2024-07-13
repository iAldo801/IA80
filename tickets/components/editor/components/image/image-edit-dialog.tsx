import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { IconLucide } from '@/lib/icon-lucide'
import type { Editor } from '@tiptap/core'
import { useState } from 'react'
import { ToolbarButton } from '../misc/toolbar-button'
import { ImageEditBlock } from './image-edit-block'

const ImageEditDialog = ({ editor }: { editor: Editor }) => {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <ToolbarButton isActive={editor.isActive('image')} tooltip="Image" aria-label="Image">
                    <IconLucide name="Image" className="h-5 w-5" />
                </ToolbarButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Select image</DialogTitle>
                </DialogHeader>
                <ImageEditBlock editor={editor} close={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}

export { ImageEditDialog }

