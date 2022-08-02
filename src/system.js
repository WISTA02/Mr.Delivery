// "use strict";
// require("dotenv").config();
// const PORT = process.env.PORT ;

// const ioServer = require("socket.io")(PORT);
// // const io = require('socket.io-client');
// //namespace
// // const airline = ioServer.of("/airline");
// // // let PORT =process.env.PORT;
// // let host = `http://localhost:${PORT}`;
// // const airLineConnection = io.connect(`${host}/airline`);

// // airline.on("connection", (socket) => {
// // //   console.log("***************************************");
// //   socket.on("flight", (payload) => {
// //     payload.events = "took-off";
// //     console.log(payload);
// //     airline.emit("took-off", payload);
// //   });
// // });

// ioServer.on("connection", (socket) => {

//   socket.on("new-order", (payload) => {
//     console.log(payload);
   
//     // setTimeout(function(){
//     //     ioServer.emit("new-flight", payload);
//     // },3000)
   
//   });
// //   socket.on("flightArrived",(payload)=>{
// //     payload.events = "arrived";
// //     console.log(payload);
   
// //     setTimeout(function(){ airLineConnection.emit("flight",payload);},4000)
// //   })
// });
