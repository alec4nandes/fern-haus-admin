import getOpenAiRevised from "./openai.js";
import format from "./format.js";

async function handleRevise({ e, contentRef, acceptRejectRef }) {
    e?.preventDefault();
    const selection = window.getSelection(),
        textInput = selection.toString(),
        nodeInfo = getNodeInfo({ contentRef, selection }),
        selectionIsEmpty = !textInput,
        textIsTooLong = textInput.length > 700,
        { start, end } = nodeInfo,
        { startContainer } = start,
        { endContainer } = end;
    if (selectionIsEmpty || textIsTooLong) {
        const warning =
            "Invalid text! Make sure the content is highlighted " +
            "and under 700 characters.";
        alert(warning);
        return false;
    }
    // TODO: better workaround for contentRef being one the containers
    if ([startContainer, endContainer].includes(contentRef.current)) {
        alert(
            "Selection starts or ends with a line break. " +
                "We're working on a fix, but until then, " +
                "please start and end you selection with a character."
        );
        return false;
    }
    const revised = await getOpenAiRevised(textInput),
        formatted = format({ original: textInput, revised });
    if (formatted) {
        insertFormattedRevisions({ formatted, nodeInfo, contentRef });
        acceptRejectRef.current.style.display = "flex";
    }
    return true;
}

function getNodeInfo({ contentRef, selection }) {
    const allNodes = contentRef.current.childNodes,
        range = selection.getRangeAt(0),
        { startOffset, startContainer, endOffset, endContainer } = range;
    return {
        allNodes,
        start: { startOffset, startContainer },
        end: { endOffset, endContainer },
    };
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
        } else if (node === startContainer) {
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
    contentRef.current.innerHTML = text;
    const revisedSpans = [...contentRef.current.querySelectorAll("span")];
    for (const span of revisedSpans) {
        // [...span.querySelectorAll("br")].forEach((br) => br.remove());
        span.onclick = () => handleRevision(span);
    }
}

function handleRevision(span) {
    const isRevised = window.confirm("Approve revision?");
    reviseSpan(span, isRevised);
}

function reviseSpan(span, isRevised) {
    const replace = span.querySelector(isRevised ? "b" : "s").innerHTML;
    if (replace) {
        span.innerHTML = replace;
        span.onclick = () => {};
        span.classList.remove("revision");
    }
}

function handleAccept({ e, contentRef, acceptRejectRef }) {
    handleAcceptReject({ e, contentRef, isAccept: true, acceptRejectRef });
}

function handleReject({ e, contentRef, acceptRejectRef }) {
    handleAcceptReject({ e, contentRef, isAccept: false, acceptRejectRef });
}

function handleAcceptReject({ e, contentRef, isAccept, acceptRejectRef }) {
    try {
        e?.preventDefault();
        const textElem = contentRef.current,
            spans = [...textElem.querySelectorAll("span")];
        for (const span of spans) {
            reviseSpan(span, isAccept);
        }
        getPlainText({ contentRef });
        acceptRejectRef.current.style.display = "none";
    } catch (err) {
        console.error(err);
    }
}

function getPlainText({ contentRef }) {
    contentRef.current.innerText = contentRef.current.innerText
        .replaceAll(/[\n]{3,}/g, "\n\n")
        .replaceAll(/[‘’]+/g, "'")
        .replaceAll(/[“”]+/g, '"')
        .trim();
}

export { handleRevise, handleAccept, handleReject };
