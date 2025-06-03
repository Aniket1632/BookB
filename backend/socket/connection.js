export let onlineUsers = [];

export const SocketConnection = (io) => {
    io.on('connection', (socket) => {
        // onlineUsers = onlineUsers.filter(user => user.userId !== socket.userId);
        onlineUsers.push({ stylist: socket.stylist, socketId: socket.id, role: socket.role, salon: socket.salon });
        console.log('New Socket connection', socket.id);
        console.log(onlineUsers);
        io.emit('online-users', { onlineUsers });

        socket.on('test-message', () => {
            console.log('myEvent triggered');
        });
    });
    return io;
}