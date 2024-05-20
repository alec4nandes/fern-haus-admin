import { useRef } from "react";
import { db } from "../../database";
import { doc, setDoc } from "firebase/firestore";
import IdTitlesImage from "./IdTitlesImage";
import Content from "./Content";
import CategoriesTagsDate from "./CategoriesTagsDate";
import PublishButtons from "./PublishButtons";

export default function Post({ post, setPost, allPosts }) {
    const postIdRef = useRef(),
        contentRef = useRef();

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

    return (
        <>
            <header>
                <h1>Edit Post</h1>
            </header>
            <main>
                <form id="post" onSubmit={handlePublish}>
                    <IdTitlesImage {...{ post, postIdRef }} />
                    <Content {...{ post, contentRef }} />
                    <CategoriesTagsDate {...{ post }} />
                    <button type="submit">update</button>
                </form>
            </main>
            <footer>
                <PublishButtons {...{ post, setPost, postIdRef }} />
            </footer>
        </>
    );
}

// GLOBAL FUNCTIONS

function getBtnContainerStyle({ display }) {
    return {
        width: "fit-content",
        display,
        flexWrap: "wrap",
        gap: "10px",
        margin: "auto",
    };
}

export { getBtnContainerStyle };
