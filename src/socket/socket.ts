import mongoose from "mongoose";
import ChatModel from "../apis/users/chats/model"
import MessageModel from "../apis/users/messages/model"

export const newConnectionHandler = (socket) => {

  console.log(`user connected: ${socket.id}`)

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });




  socket.on("send_message", async (data) => {
    const message = new MessageModel({ sender: data.sender, content: { text: data.text, media: '' } })
    const { _id } = await message.save()
    const chat = await ChatModel.findByIdAndUpdate(data.room, { $push: { messages: _id } })

    socket.to(data.room).emit("receive_message", data);

  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
};