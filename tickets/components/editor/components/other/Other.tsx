import { Editor } from "@tiptap/react";
import { ImageEditDialog } from "../image/image-edit-dialog";
import { LinkEditPopover } from "../link/link-edit-popover";

export default function Other({ editor }: { editor: Editor }) {
    return (
        <>
            <LinkEditPopover editor={editor} />
            <ImageEditDialog editor={editor} />
        </>
    )
}