import { useEffect } from "react";
import EditButtons from "./EditButtons";

export default function Content({ post, contentRef }) {
    useEffect(() => {
        contentRef.current.innerText = post?.content || "";
    }, [contentRef, post]);

    return (
        <>
            <label htmlFor="content">content:</label>
            <div
                ref={contentRef}
                id="content"
                required
                contentEditable={true}
            ></div>
            <EditButtons {...{ contentRef }} />
        </>
    );
}
