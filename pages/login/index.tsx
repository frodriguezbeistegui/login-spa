import { useRouter } from 'next/router';
import React, { FormEvent, useContext, useEffect, useRef } from 'react';
import { UserContext } from '../../context/AuthContext';
import { UserContextType } from '../../types/userTypes';
import * as Bowser from 'bowser';
import { GetServerSideProps, NextPage } from 'next';
import io from 'socket.io-client';
let socket;

interface Props {
    ip: string;
}

const Login: NextPage<Props> = ({ ip }) => {
    const router = useRouter();
    const userContext = useContext<UserContextType | null>(UserContext);

    // Refs inputs for sing in function
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    // Current browser provider
    let provider: string | undefined;
    useEffect(() => {
        // populate provider variable is made inside a useEffect to make window object available
        let browserObj = Bowser.getParser(window.navigator.userAgent).getBrowser();
        // console.log(browserObj);
        if (browserObj) {
            provider = browserObj.name;
        }
    }, []);

    // Triggers when form is submitted
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        // Prevent browser default behavior
        e?.preventDefault();
        const body = {
            email: email.current!.value,
            password: password.current!.value,
            ip,
            provider: provider,
        };
        // Signs in user if credentials are ok or stay in the page to try again
        signin(body);
    };

    const signin = async (body: { email: string; password: string; provider?: string }) => {
        try {
            // log in user and stores it in cookie as session with a new currentSession in session.current.currentSession
            const data = await fetch(`${process.env.NEXT_PUBLIC_BFF_URL}/auth/signin`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'PUT',
                body: JSON.stringify(body),
                credentials: 'include' as RequestCredentials,
            });

            if (data.status === 200) {
                // converts response to json
                const newUser = await data.json();
                userContext?.updateUser(newUser);

                await usingSocket(newUser._id);

                alert('Logged in');
                router.push('/');
            } else {
                // For any error stay in the page and show an alert
                alert('something went wrong try again.');
            }
        } catch (error) {
            alert('wrong email or password');
            throw error;
        }
    };
    const usingSocket = async (id: any) => {
        await fetch('/api/socket');
        socket = io();

        socket.on('connect', () => {
            console.log('connected');
        });

        socket.emit('logout-user', id);
    };

    return (
        <section>
            <h1>Log in with your credentials</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <p>Email:</p>
                <input
                    type="text"
                    ref={email}
                    placeholder="Enter your email"
                    defaultValue={'facu@test.com'}
                />
                <p>Password:</p>
                <input
                    type="text"
                    ref={password}
                    placeholder="Enter your password"
                    defaultValue={'test1234'}
                />
                <button type="submit">Log in</button>
            </form>
        </section>
    );
};

// Get ip address from the request and makes it available on props
export const getServerSideProps: GetServerSideProps = async (context) => {
    let ip;
    const { req } = context;
    // ip is coming into the headers?
    if (req.headers['x-forwarded-for']) {
        // .split conflicts with (string | string[])
        // @ts-ignore
        ip = req.headers['x-forwarded-for'].split(',')[0];
    } else if (req.headers['x-real-ip']) {
        ip = req.socket.remoteAddress;
    } else {
        // is not in the headers --> take it from the req obj
        ip = req.socket.remoteAddress;
    }

    return {
        props: {
            ip,
        },
    };
};

export default Login;
