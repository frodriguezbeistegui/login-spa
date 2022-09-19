// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

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
            socket.on('logout-user', (id) => {
                console.log(id, 'from api/socket.ts line 19');

                // emits the id of the current user to make it only accessible by the current user
                socket.broadcast.emit(`${id}-logout`, id);
            });
        });
    }

    // ends service
    res.end();
};

export default SocketHandler;
