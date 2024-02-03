import { useEffect } from "react";
import { auth, db } from "../database";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function Posts({ setPost, allPosts, setAllPosts }) {
    useEffect(() => {
        getAllPosts();

        async function getAllPosts() {
            const querySnapshot = await getDocs(collection(db, "posts")),
                all = [];
            querySnapshot.forEach((doc) => {
                all.push({ post_id: doc.id, ...doc.data() });
            });
            all.sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setAllPosts(all);
        }
    }, [setAllPosts]);

    function formatDate(date) {
        const d = new Date(date),
            formatted = d.toLocaleDateString("en-us", {
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
            });
        return formatted;
    }

    return (
        <>
            <header>
                <h1>All Posts</h1>
                <button onClick={() => setPost({})}>
                    write new post
                </button> |{" "}
                <button onClick={async () => await signOut(auth)}>
                    sign out
                </button>
            </header>
            <main>
                <ul>
                    {allPosts?.map((post) => (
                        <li key={post.post_id}>
                            <small className="date">
                                {formatDate(post.date)}
                            </small>
                            <br />
                            <button onClick={() => setPost(post)}>
                                {post.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </main>
        </>
    );
}
