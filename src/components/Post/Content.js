import { useEffect, useState } from "react";
import EditButtons from "./EditButtons";

export default function Content({ post, contentRef }) {
    const [reviseInput, setReviseInput] = useState("");

    useEffect(() => {
        contentRef.current.innerText = post?.content || "";
    }, [contentRef, post]);

    function getChildNodes(selection) {
        const allNodes = contentRef.current.childNodes,
            range = selection.getRangeAt(0),
            { startOffset, startContainer, endOffset, endContainer } = range;
        return {
            allNodes,
            start: { startOffset, startContainer },
            end: { endOffset, endContainer },
        };
    }

    return (
        <>
            <label htmlFor="content">content:</label>
            <div
                ref={contentRef}
                id="content"
                required
                contentEditable={true}
                onSelect={() => {
                    const selection = window.getSelection();
                    setReviseInput({
                        textInput: selection.toString(),
                        nodeInfo: getChildNodes(selection),
                    });
                }}
                onBlur={() => setTimeout(() => setReviseInput(""), 200)}
            ></div>
            <EditButtons {...{ contentRef, reviseInput }} />
        </>
    );
}
