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
        // clear revisions and change to plain text
        isRevising && handleReject({ contentRef, acceptRejectRef });
    }, [isRevising, contentRef]);

    async function handleSelect() {
        if (isRevising) {
            const success = await handleRevise({
                contentRef,
                acceptRejectRef,
            });
            success && setIsRevising(false);
        }
    }

    function isMobile() {
        const regex =
            /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return regex.test(navigator.userAgent);
    }

    return (
        <>
            <label htmlFor="content">content:</label>
            <div
                ref={contentRef}
                id="content"
                required
                contentEditable={true}
                onChange={() => setIsRevising(false)}
                onSelect={() => !isMobile() && handleSelect()}
                onTouchEnd={() => isMobile() && handleSelect()}
            ></div>
            <EditButtons
                {...{ contentRef, isRevising, setIsRevising, acceptRejectRef }}
            />
        </>
    );
}
