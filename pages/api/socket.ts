// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Server } from 'socket.io';
// import type { NextApiRequest, NextApiResponse } from 'next';

const SocketHandler = (req: any, res: any) => {
    if (res.socket.server.io) {
        console.log('Socket is already running');
    } else {
        console.log('Socket is initializing');
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', (socket) => {
            socket.on('logout-user', (id) => {
                console.log(id, 'from api/socket.ts line 19');

                socket.broadcast.emit(`${id}-logout`, id);
            });
        });
    }
    res.end();
};

export default SocketHandler;
