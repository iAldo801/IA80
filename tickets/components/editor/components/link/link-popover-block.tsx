import { Separator } from '@/components/ui/separator'
import { IconLucide } from '@/lib/icon-lucide'
import { useState } from 'react'
import { ToolbarButton } from '../misc/toolbar-button'

const LinkPopoverBlock = ({
    link,
    onClear,
    onEdit
}: {
    link: Record<string, unknown>
    onClear: () => void
    onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void
}) => {
    const [copyTitle, setCopyTitle] = useState<string>('Copy')

    const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        setCopyTitle('Copied!')
        navigator.clipboard.writeText(link.href as string)

        setTimeout(() => {
            setCopyTitle('Copy')
        }, 1000)
    }

    return (
        <div className="flex h-10 overflow-hidden rounded bg-background p-2 shadow-lg">
            <div className="inline-flex items-center gap-1">
                <ToolbarButton tooltip="Edit link" onClick={onEdit}>
                    Edit link
                </ToolbarButton>
                <Separator orientation="vertical" />
                <ToolbarButton tooltip="Open link in a new tab" onClick={() => window.open(link.href as string, '_blank')}>
                    <IconLucide name='ExternalLink' className="h-4 w-4" />
                </ToolbarButton>
                <Separator orientation="vertical" />
                <ToolbarButton tooltip="Clear link" onClick={onClear}>
                    <IconLucide name='Link2' className="h-4 w-4" />
                </ToolbarButton>
                <Separator orientation="vertical" />
                <ToolbarButton
                    tooltip={copyTitle}
                    onClick={handleCopy}
                    tooltipOptions={{
                        onPointerDownOutside: (e: Event) => {
                            if (e.target === e.currentTarget) e.preventDefault()
                        }
                    }}
                >
                    <IconLucide name='Copy' className="h-4 w-4" />
                </ToolbarButton>
            </div>
        </div>
    )
}

export { LinkPopoverBlock }

