import { useEffect, useState } from "react";
import EditButtons from "./EditButtons";

export default function Content({ post, contentRef }) {
    const [textInput, setTextInput] = useState("");

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
                onSelect={() => setTextInput(window.getSelection().toString())}
                onBlur={() => setTimeout(() => setTextInput(""), 500)}
            ></div>
            <EditButtons {...{ contentRef, textInput }} />
        </>
    );
}
