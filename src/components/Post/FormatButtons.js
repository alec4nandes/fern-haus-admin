import { getBtnContainerStyle } from "./Post";

export default function FormatButtons({ contentRef }) {
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
            <button onClick={handleFormat}>format</button>
            <button onClick={handleUnformat}>unformat</button>
        </div>
    );
}
