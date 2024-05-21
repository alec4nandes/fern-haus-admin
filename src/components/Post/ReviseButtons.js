import { useRef } from "react";
import {
    handleRevise,
    handleAccept,
    handleReject,
} from "../../ai-editor/editor.js";
import { getBtnContainerStyle } from "./Post";
import { getPlainText } from "./FormatButtons";

export default function ReviseButtons({ contentRef, reviseInput }) {
    const acceptRejectRef = useRef();

    function handler(e) {
        e.preventDefault();
        const funcs = {
                revise: handleRevise,
                "accept all": handleAccept,
                "reject all": handleReject,
            },
            key = e.target.innerText.trim(),
            arg = { e, reviseInput, contentRef, acceptRejectRef };
        funcs[key]?.(arg);
        key !== "revise" && getPlainText({ contentRef });
    }

    return (
        <div style={getBtnContainerStyle({ display: "flex" })}>
            <button onClick={handler}>revise</button>
            <div
                ref={acceptRejectRef}
                style={getBtnContainerStyle({ display: "none" })}
            >
                <button onClick={handler}>accept all</button>
                <button onClick={handler}>reject all</button>
            </div>
        </div>
    );
}
