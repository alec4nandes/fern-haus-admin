import getOpenAiRevised from "./openai.js";
import format from "./format.js";

async function handleRevise({ e, textInput, contentRef, acceptRejectRef }) {
    e.preventDefault();
    // clear notes and convert to plain text
    handleReject({ e, contentRef, acceptRejectRef });
    const selectionIsEmpty = !textInput,
        textIsTooLong = textInput.length > 700;
    if (selectionIsEmpty || textIsTooLong) {
        alert(
            "Invalid text! Make sure the content is highlighted " +
                "and under 700 characters."
        );
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
        replace = span.querySelector(isRevised ? "b" : "s").innerHTML;
    span.innerHTML = replace;
}

function handleAccept({ e, contentRef, acceptRejectRef }) {
    handleAcceptReject({ e, contentRef, isAccept: true, acceptRejectRef });
}

function handleReject({ e, contentRef, acceptRejectRef }) {
    handleAcceptReject({ e, contentRef, isAccept: false, acceptRejectRef });
}

function handleAcceptReject({ e, contentRef, isAccept, acceptRejectRef }) {
    try {
        e.preventDefault();
        const textElem = contentRef.current,
            spans = [...textElem.querySelectorAll("span")];
        for (const span of spans) {
            const replace = span.querySelector(isAccept ? "b" : "s")?.innerHTML;
            replace && (span.innerHTML = replace);
        }
        contentRef.current.innerText = getPlainText({ contentRef });
        acceptRejectRef.current.style.display = "none";
    } catch (err) {
        console.error(err);
    }
}

function getPlainText({ contentRef }) {
    return contentRef.current.innerText
        .replaceAll(/[\n]{3,}/g, "\n\n")
        .replaceAll(/[‘’]+/g, "'")
        .replaceAll(/[“”]+/g, '"')
        .trim();
}

export { handleRevise, handleAccept, handleReject, getPlainText };
