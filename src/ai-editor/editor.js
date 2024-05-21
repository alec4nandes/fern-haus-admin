import getOpenAiRevised from "./openai.js";
import format from "./format.js";

async function handleRevise({ e, reviseInput, contentRef, acceptRejectRef }) {
    e.preventDefault();
    const warning =
        "Invalid text! Make sure the content is highlighted " +
        "and under 700 characters.";
    if (!reviseInput) {
        alert(warning);
        return;
    }
    // clear notes
    handleReject({ e, contentRef, acceptRejectRef });
    const { textInput, nodeInfo } = reviseInput,
        selectionIsEmpty = !textInput,
        textIsTooLong = textInput.length > 700,
        { start, end } = nodeInfo,
        { startContainer } = start,
        { endContainer } = end;
    if (selectionIsEmpty || textIsTooLong) {
        alert(warning);
        return;
    }
    // TODO: better workaround for contentRef being one the containers
    if ([startContainer, endContainer].includes(contentRef.current)) {
        alert("Back container selected. Please select only text");
        return;
    }
    const revised = await getOpenAiRevised(textInput),
        formatted = format({ original: textInput, revised });
    if (formatted) {
        insertFormattedRevisions({ formatted, nodeInfo, contentRef });
        acceptRejectRef.current.style.display = "flex";
    }
}

function insertFormattedRevisions({ formatted, nodeInfo, contentRef }) {
    const { allNodes, start, end } = nodeInfo,
        { startOffset, startContainer } = start,
        { endOffset, endContainer } = end,
        noHighlight =
            startContainer === endContainer && startOffset === endOffset;
    if (noHighlight) {
        return;
    }
    let uncopied = "",
        isCopying = false,
        text = "";
    for (const node of allNodes) {
        let { wholeText } = node;
        wholeText = wholeText || node.outerHTML;
        if (startContainer === endContainer) {
            if (node === startContainer) {
                text +=
                    wholeText.slice(0, startOffset) +
                    formatted +
                    wholeText.slice(endOffset);
            } else {
                text += wholeText;
            }
        } else {
            if (node === startContainer) {
                uncopied = wholeText.slice(0, startOffset);
                text += uncopied + formatted;
                isCopying = true;
            } else if (node === endContainer) {
                uncopied = wholeText.slice(endOffset);
                text += uncopied;
                isCopying = false;
            } else if (!isCopying) {
                text += wholeText;
            }
        }
    }
    contentRef.current.innerHTML = text;
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
    span.onclick = () => {};
    span.classList.remove("revision");
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
            if (replace) {
                span.innerHTML = replace;
                span.onclick = () => {};
                span.classList.remove("revision");
            }
        }
        acceptRejectRef.current.style.display = "none";
    } catch (err) {
        console.error(err);
    }
}

export { handleRevise, handleAccept, handleReject };
