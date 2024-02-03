import "../css/app.css";
import { useEffect, useState } from "react";
import { auth } from "../database";
import { onAuthStateChanged } from "firebase/auth";
import Post from "./Post";
import Posts from "./Posts";
import SignIn from "./SignIn";

function App() {
    const [loaded, setLoaded] = useState(false),
        [user, setUser] = useState(),
        [post, setPost] = useState(),
        [allPosts, setAllPosts] = useState();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            !loaded && setLoaded(true);
            setUser(user);
        });
    }, [loaded]);

    return (
        loaded && (
            <>
                {user ? (
                    post ? (
                        <Post {...{ post, setPost, allPosts }} />
                    ) : (
                        <Posts {...{ setPost, allPosts, setAllPosts }} />
                    )
                ) : (
                    <SignIn />
                )}
            </>
        )
    );
}

export default App;
