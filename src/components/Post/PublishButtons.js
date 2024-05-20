import { db } from "../../database";
import { deleteDoc, doc } from "firebase/firestore";
import { getBtnContainerStyle } from "./Post";

export default function PublishButtons({ post, setPost, postIdRef }) {
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

    return (
        <div style={getBtnContainerStyle({ display: "flex" })}>
            {post.post_id && (
                <button onClick={() => deletePost(postIdRef.current.value)}>
                    delete
                </button>
            )}
            <button onClick={() => setPost(null)}>back to admin</button>
        </div>
    );
}
