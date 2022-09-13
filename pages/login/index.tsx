import { useRouter } from 'next/router';
import React, { FormEvent, useContext, useRef } from 'react';
import { UserContext } from '../../context/AuthContext';
import { UserContextType } from '../../types/userTypes';
import { getCookie, setCookie } from 'cookies-next';

export default function Login() {
    const userContext = useContext<UserContextType | null>(UserContext);

    const router = useRouter();

    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        const body = {
            email: email.current!.value,
            password: password.current!.value,
        };
        signin(body);
    };

    const signin = async (body: { email: string; password: string }) => {
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_BFF_URL}/auth/signin`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(body),
                credentials: 'include' as RequestCredentials,
            });

            const newUser = await data.json();

            if (newUser.statusCode !== 400) {
                userContext?.updateUser(newUser);

                alert('Logged in');
                router.push('/');
            } else {
                alert('something went wrong try again.');
            }
        } catch (error) {
            alert('wrong email or password');
            throw error;
        }
    };

    return (
        <section>
            <h1>Log in with your credentials</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <p>Email:</p>
                <input type="text" ref={email} placeholder="Enter your email" />
                <p>Password:</p>
                <input type="text" ref={password} placeholder="Enter your password" />
                <button type="submit">Log in</button>
            </form>
        </section>
    );
}
