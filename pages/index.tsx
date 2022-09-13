import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { useContext, useEffect } from 'react';
import { UserContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
    const router = useRouter();
    const { updateUser, user }: any = useContext(UserContext);
    useEffect(() => {
        fetchUser();
    }, [router]);
    const fetchUser = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BFF_URL}/auth/whoami`, {
                method: 'GET',
                credentials: 'include' as RequestCredentials,
            });
            const data = await res.json();
            updateUser({ ...data });
            if (data.id === null) {
                router.push('/login');
            }
        } catch (error) {
            throw error;
        }
    };

    if (user?.name === null) {
        return <h1>Loading...</h1>;
    } else {
        return (
            <div className={styles.container}>
                <h1>Hello from root</h1>
                <h2>{user.name}</h2>
                <h3>{user.email}</h3>
                <h3>{user.id}</h3>
            </div>
        );
    }
};

export default Home;
