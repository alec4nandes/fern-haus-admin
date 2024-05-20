import getOpenAiRevised from "./openai.js";
import format from "./format.js";

async function handleRevise({ e, contentRef, acceptRejectRef }) {
    e.preventDefault();
    // clear notes
    handleReject({ e, contentRef, acceptRejectRef });
    const textInput = contentRef.current.innerText
        .replaceAll("\n\n\n", "\n\n")
        .trim();
    if (!textInput) {
        console.warn("INVALID TEXT INPUT");
        return;
    }
    const revised = await getOpenAiRevised(textInput),
        formatted = format({ original: textInput, revised });
    if (formatted) {
        insertFormattedRevisions({ contentRef, formatted });
        acceptRejectRef.current.style.display = "flex";
    }
}

function insertFormattedRevisions({ contentRef, formatted }) {
    contentRef.current.innerHTML = formatted.replaceAll("\n", "<br>");
    const revisedSpans = [...contentRef.current.querySelectorAll("span")];
    for (const span of revisedSpans) {
        // [...span.querySelectorAll("br")].forEach((br) => br.remove());
        span.onclick = () => handleRevision(span);
    }
}

function handleRevision(span) {
    const isRevised = window.confirm("Approve revision?"),
        replace = span.querySelector(isRevised ? "b" : "s").innerText;
    span.replaceWith(replace);
}

function handleAccept({ e, contentRef, acceptRejectRef }) {
    handleAcceptReject({ e, contentRef, isAccept: true, acceptRejectRef });
}

function handleReject({ e, contentRef, acceptRejectRef }) {
    handleAcceptReject({ e, contentRef, isAccept: false, acceptRejectRef });
}

function handleAcceptReject({ e, contentRef, isAccept, acceptRejectRef }) {
    e.preventDefault();
    const textElem = contentRef.current,
        spans = [...textElem.querySelectorAll("span")];
    for (const span of spans) {
        const replace = span.querySelector(isAccept ? "b" : "s").innerText;
        span.replaceWith(replace);
    }
    acceptRejectRef.current.style.display = "none";
}

export { handleRevise, handleAccept, handleReject };
