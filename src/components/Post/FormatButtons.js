import { getPlainText } from "../../ai-editor/editor.js";
import { getBtnContainerStyle } from "./Post";

export default function FormatButtons({ contentRef }) {
    function handlePlainText(e) {
        e.preventDefault();
        contentRef.current.innerText = getPlainText({ contentRef });
    }

    function handleFormat(e) {
        e.preventDefault();
        const content = contentRef.current.innerText,
            paragraphs =
                "<p>\n" +
                content.trim().replaceAll("\n\n", "\n</p>\n\n<p>\n") +
                "\n</p>";
        contentRef.current.innerText = paragraphs;
    }

    function handleUnformat(e) {
        e.preventDefault();
        const content = contentRef.current.innerText,
            paragraphs = content
                .replaceAll("<p>\n", "")
                .replaceAll("\n</p>", "")
                .trim();
        contentRef.current.innerText = paragraphs;
    }

    return (
        <div style={getBtnContainerStyle({ display: "flex" })}>
            <button onClick={handlePlainText}>plain text</button>
            <button onClick={handleFormat}>format</button>
            <button onClick={handleUnformat}>unformat</button>
        </div>
    );
}
