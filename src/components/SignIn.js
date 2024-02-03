import { useState } from "react";
import { auth } from "../database";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function SignIn() {
    const [error, setError] = useState();

    async function handleSignIn(e) {
        try {
            e.preventDefault();
            const email = e.target.email.value,
                password = e.target.password.value;
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError(err);
        }
    }

    return (
        <>
            <header>
                <h1>Sign In</h1>
            </header>
            <main>
                <form onSubmit={handleSignIn}>
                    {error && <p className="warning">{error.message}</p>}
                    <label htmlFor="email">email:</label>
                    <input id="email" type="email" name="email" />
                    <label htmlFor="password">password:</label>
                    <input id="password" type="password" name="password" />
                    <button type="submit">sign in</button>
                </form>
            </main>
        </>
    );
}
