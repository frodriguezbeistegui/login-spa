import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
let socket: any;
let shouldListen = false;

const Home: NextPage = () => {
    // console.log(ip);

    const router = useRouter();
    const { updateUser, user }: any = useContext(UserContext);
    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user._id && shouldListen) {
            socketInitializer();
        }

        return () => {
            socket = null;
        };
    }, [shouldListen]);

    const fetchUser = async () => {
        try {
            // get all user data
            const res = await fetch(`${process.env.NEXT_PUBLIC_BFF_URL}/auth/whoami`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                credentials: 'include' as RequestCredentials,
            });
            if (res.status === 200) {
                // Cant get user? send back to '/login'
                const data = await res.json();
                // set User into UserContext
                shouldListen = true;
                updateUser({ ...data });
            } else {
                router.replace('/login').then(()=>{
                    router.reload()
                });
            }
        } catch (error) {
            // any error sends user back to '/login'
            router.replace('/login').then(()=>{
                router.reload()
            });
            throw error;
        }
    };

    const socketInitializer = async () => {
        await fetch('/api/socket');
        socket = io();

        socket.on('connect', () => {
            console.log('connected');
        });

        console.log(shouldListen);

        socket.on(`${user._id}-logout`, (id: string) => {
            if (id === user._id) {
                console.log('on id-logout');

                logout();
            }
        });
    };

    const logout = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BFF_URL}/auth/signout`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                credentials: 'include' as RequestCredentials,
            });

            if (res.status === 201) {
                updateUser(null);
                shouldListen = false;
                alert('Logged out.');
                router.replace('/login').then(()=>{
                    router.reload()
                });
            }
        } catch (error) {
            throw error;
        }
    };

    // console.log(user);
    return (
        <div className={styles.container}>
            <h1>This user is currently logged in</h1>
            <h2>name: {user.name}</h2>
            <h3>email: {user.email}</h3>
            <h3>id: {user.id}</h3>

            {/* <input placeholder="Type something" value={input} onChange={onChangeHandler} /> */}

            <button onClick={logout}>Log out</button>
        </div>
    );
};

export default Home;
