import {
    handleRevise,
    handleAccept,
    handleReject,
} from "../../ai-editor/editor.js";
import { getBtnContainerStyle } from "./Post";

export default function ReviseButtons({
    contentRef,
    isRevising,
    setIsRevising,
    acceptRejectRef,
}) {
    function handler(e) {
        e.preventDefault();
        const funcs = {
                revise: handleRevise,
                "accept all": handleAccept,
                "reject all": handleReject,
            },
            key = e.target.innerText.trim(),
            arg = { e, contentRef, acceptRejectRef };
        funcs[key]?.(arg);
    }

    return (
        <div style={getBtnContainerStyle({ display: "flex" })}>
            <label className="checkbox-label">
                <input
                    type="checkbox"
                    checked={isRevising}
                    onChange={(e) => setIsRevising(e.target.checked)}
                />
                <span>
                    revise{" "}
                    {isRevising && <em>(highlight content to revise)</em>}
                </span>
            </label>
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
