import { useEffect, useRef } from "react";
import { db } from "../database";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import {
    handleRevise,
    handleAccept,
    handleReject,
} from "../ai-editor/editor.js";

export default function Post({ post, setPost, allPosts }) {
    const postIdRef = useRef(),
        titleRef = useRef(),
        captionRef = useRef(),
        contentRef = useRef(),
        dateRef = useRef(),
        changeDateRef = useRef(),
        acceptRejectRef = useRef();

    useEffect(() => {
        contentRef.current.innerText = post.content;
        dateRef.current.value = changeDate(post.date, true);
        changeDateRef.current.value = changeDate(post.date);
    }, [post.content, post.date]);

    async function handlePublish(e) {
        try {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target)),
                postId = data.post_id,
                splitter = (str) =>
                    str
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                tags = splitter(data.tags),
                categories = splitter(data.categories);
            delete data.post_id;
            data.tags = tags;
            data.categories = categories;
            // get content
            data.content = contentRef.current.innerText;
            // if writing a new post, make sure it doesn't overwrite an old one
            if (!post.post_id && allPosts.find((p) => p.post_id === postId)) {
                alert(
                    "There already is a post in the database with this ID. Please change it."
                );
                return;
            }
            await setDoc(doc(db, "posts", postId), data);
            alert(
                "Post added to database! To publish, run your SSG and deploy."
            );
            setPost(null);
        } catch (err) {
            alert(err.message);
        }
    }

    async function deletePost(postId) {
        const proceed = window.confirm(`Delete post with ID ${postId}?`);
        if (proceed) {
            try {
                await deleteDoc(doc(db, "posts", postId));
                alert("Post deleted!");
                setPost(null);
            } catch (err) {
                alert(err.message);
            }
        }
    }

    function handleSlugifyTitle(e) {
        e.preventDefault();
        const title = titleRef.current.value,
            slug = title.trim().toLowerCase().replaceAll(" ", "-");
        postIdRef.current.value = slug;
    }

    function handleFormatCaption(e) {
        e.preventDefault();
        const caption = captionRef.current.value,
            formatted = caption.trim().replaceAll("<a ", `<a target="_blank" `);
        captionRef.current.value = formatted;
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

    function getButtonsStyle({ display }) {
        return {
            width: "fit-content",
            display,
            flexWrap: "wrap",
            gap: "10px",
            margin: "auto",
        };
    }

    return (
        <>
            <header>
                <h1>Edit Post</h1>
            </header>
            <main>
                <form id="post" onSubmit={handlePublish}>
                    <label htmlFor="post-id">post id:</label>
                    <input
                        ref={postIdRef}
                        id="post-id"
                        name="post_id"
                        defaultValue={post.post_id}
                        required
                    />
                    <button onClick={handleSlugifyTitle}>
                        slugify title for ID
                    </button>
                    <label htmlFor="title">title:</label>
                    <input
                        ref={titleRef}
                        id="title"
                        name="title"
                        defaultValue={post.title}
                        required
                    />
                    <label htmlFor="subtitle">subtitle:</label>
                    <input
                        id="subtitle"
                        name="subtitle"
                        defaultValue={post.subtitle}
                    />
                    <label htmlFor="feature-image-path">
                        feature image path:
                    </label>
                    <input
                        id="feature-image-path"
                        name="feature_image"
                        defaultValue={post.feature_image}
                    />
                    <label htmlFor="feature-image-caption">
                        feature image caption:
                    </label>
                    <input
                        ref={captionRef}
                        id="feature-image-caption"
                        name="feature_image_caption"
                        defaultValue={post.feature_image_caption}
                    />
                    <button onClick={handleFormatCaption}>
                        format caption
                    </button>
                    <label htmlFor="feature-image-alt">
                        feature image alt:
                    </label>
                    <input
                        id="feature-image-alt"
                        name="feature_image_alt"
                        defaultValue={post.feature_image_alt}
                    />
                    <label htmlFor="content">content:</label>
                    <div
                        ref={contentRef}
                        id="content"
                        required
                        contentEditable={true}
                    ></div>
                    <div style={getButtonsStyle({ display: "flex" })}>
                        <div style={getButtonsStyle({ display: "flex" })}>
                            <button
                                onClick={(e) =>
                                    handleRevise({
                                        e,
                                        contentRef,
                                        acceptRejectRef,
                                    })
                                }
                            >
                                revise
                            </button>
                            <div
                                ref={acceptRejectRef}
                                style={getButtonsStyle({ display: "none" })}
                            >
                                <button
                                    onClick={(e) =>
                                        handleAccept({
                                            e,
                                            contentRef,
                                            acceptRejectRef,
                                        })
                                    }
                                >
                                    accept all
                                </button>
                                <button
                                    onClick={(e) =>
                                        handleReject({
                                            e,
                                            contentRef,
                                            acceptRejectRef,
                                        })
                                    }
                                >
                                    reject all
                                </button>
                            </div>
                        </div>
                        <div style={getButtonsStyle({ display: "flex" })}>
                            <button onClick={handleFormat}>format</button>
                            <button onClick={handleUnformat}>unformat</button>
                        </div>
                    </div>
                    <label htmlFor="categories">categories:</label>
                    <input
                        id="categories"
                        name="categories"
                        defaultValue={post.categories?.join(", ")}
                        required
                    />
                    <label htmlFor="tags">tags:</label>
                    <input
                        id="tags"
                        name="tags"
                        defaultValue={post.tags?.join(", ")}
                    />
                    <input
                        ref={dateRef}
                        name="date"
                        type="text"
                        defaultValue={post.date}
                        hidden
                    />
                    <label htmlFor="change-date">date:</label>
                    <input
                        ref={changeDateRef}
                        id="change-date"
                        type="datetime-local"
                        onChange={(e) => {
                            dateRef.current.value = changeDate(
                                e.target.value,
                                true
                            );
                        }}
                    />
                    <button type="submit">update</button>
                </form>
            </main>
            <footer style={getButtonsStyle({ display: "flex" })}>
                {post.post_id && (
                    <button onClick={() => deletePost(postIdRef.current.value)}>
                        delete
                    </button>
                )}
                <button onClick={() => setPost(null)}>back to admin</button>
            </footer>
        </>
    );
}

function changeDate(date, addTimezone) {
    const localDate = date ? new Date(date) : new Date(),
        pad = (num) => ("" + num).padStart(2, "0"),
        mm = pad(localDate.getMonth() + 1),
        dd = pad(localDate.getDate()),
        yyyy = pad(localDate.getFullYear()),
        hh = pad(localDate.getHours()),
        mi = pad(localDate.getMinutes()),
        parsed = `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    return parsed + (addTimezone ? getTZOffset(parsed) : "");
}

function getTZOffset(timestamp) {
    const minutesOffset = new Date(timestamp).getTimezoneOffset(),
        hours = minutesOffset / 60,
        // minutesOffset reflects how far ahead GMT is,
        // therefore invert it to get your timezone relative to GMT
        num = hours * -1,
        prefix = num >= 0 ? "+" : "-",
        offset = ("" + Math.abs(num)).padStart(2, "0");
    return prefix + offset + ":00";
}
