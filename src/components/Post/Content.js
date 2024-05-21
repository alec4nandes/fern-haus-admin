import { useEffect, useRef, useState } from "react";
import { handleReject, handleRevise } from "../../ai-editor/editor";
import EditButtons from "./EditButtons";

export default function Content({ post, contentRef }) {
    const [isRevising, setIsRevising] = useState(false),
        acceptRejectRef = useRef();

    useEffect(() => {
        contentRef.current.innerText = post?.content || "";
    }, [contentRef, post]);

    useEffect(() => {
        if (isRevising) {
            // clear revisions and change to plain text
            handleReject({ contentRef, acceptRejectRef });
        }
    }, [isRevising, contentRef]);

    return (
        <>
            <label htmlFor="content">content:</label>
            <div
                ref={contentRef}
                id="content"
                required
                contentEditable={true}
                onChange={() => setIsRevising(false)}
                onSelect={async () => {
                    if (isRevising) {
                        console.log("Revising...");
                        const success = await handleRevise({
                            contentRef,
                            acceptRejectRef,
                        });
                        success && setIsRevising(false);
                    }
                }}
            ></div>
            <EditButtons
                {...{ contentRef, isRevising, setIsRevising, acceptRejectRef }}
            />
        </>
    );
}
