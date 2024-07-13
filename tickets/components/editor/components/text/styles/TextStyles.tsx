import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { IconLucide } from "@/lib/icon-lucide";
import { Editor } from "@tiptap/react";
import { LinkEditPopover } from "../../link/link-edit-popover";
import { ImageEditDialog } from "../../image/image-edit-dialog";

export default function TextStyles({ editor }: { editor: Editor }) {
    return (
        <>
            <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
                <IconLucide name='Bold' className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            >
                <IconLucide name='Italic' className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            >
                <IconLucide name='Strikethrough' className="h-4 w-4" />
            </Toggle>
            <Separator orientation="vertical" className="w-[1px] h-8" />
            <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            >
                <IconLucide name='List' className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <IconLucide name='ListOrdered' className="h-4 w-4" />
            </Toggle>

        </>
    )
}