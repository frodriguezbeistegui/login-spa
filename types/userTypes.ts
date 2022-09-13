export interface UserI {
    id: number | null;
    name: string | null;
    email: string | null;
}

export type UserContextType = {
    user: UserI;
    updateUser: (user: UserI) => void;
};
