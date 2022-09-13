import React, { createContext, useState } from 'react';
import { UserI, UserContextType } from '../types/userTypes';

export const UserContext = createContext<UserContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

const UserProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<UserI>({ id: null, name: null, email: null });

    const updateUser = (user: UserI) => {
        setUser({ ...user });
    };

    return <UserContext.Provider value={{ user, updateUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
