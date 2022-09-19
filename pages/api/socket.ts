import { Server } from 'socket.io';
// import type { NextApiRequest, NextApiResponse } from 'next';

const SocketHandler = (req: any, res: any) => {
    // connection exits?
    if (res.socket.server.io) {
        console.log('Socket is already running');
    } else {
        console.log('Socket is initializing');
        // creates a new socket.io connection
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        // gets all emitted actions
        io.on('connection', (socket) => {
            // when user signs in emits this action to logout all other sessions for the same user
            socket.on('login-user', (id) => {
                console.log(id, 'from api/socket.ts line 19');
                if (id === '') {
                    socket.broadcast.volatile.emit(`${id}-logout`, id);
                }
                // emits the id of the current user to make it only accessible by the current user
                socket.to(id).volatile.emit(`logout-user`, id);
            });

            // Adds the session to a room with user's id
            socket.on('join-room', (room) => {
                socket.join(room);
            });
        });
    }

    // ends service
    res.end();
};

export default SocketHandler;
