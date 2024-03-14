// Cài đặt socket .io bằng lệnh: npm i socket.io
const io = require( "socket.io" )();
const socketapi = {io: io };
//==== Viết code tương tác ở trước dòng export
var list_user = []
io.on("connection", (client) => {
    console.log("Client connection "+ client.id)
    // định nghĩa 1 sự kiện 
    client.on('get user', (user_name) => {
        
    });

    // if(list_user.indexOf(user_name) > -1){
    //     //         console.log("Tài khoản đã đc đăng nhập ở nơi khác");
    //     //         return;
    //     //     }
    //     //     list_user.push(user_name)
    //     //     client.user = user_name;
    //     //     console.log("=======>" + client.user);


    //sự kiện người dùng gửi tin nhắn lên
    client.on("add comment", (data) =>{
        console.log("dữ liệu nè "+data);
        // gửi thông báo cho mọi người 
        io.sockets.emit('add comment', z);
    })
    //sự kiện người dùng gửi tin nhắn lên
    client.on("add comic", () =>{ })

    // sự kiện ngắt kết nối
    client.on('disconnect', ()=>{
        console.log("Client disconected! ");
    });
});

module.exports = socketapi;