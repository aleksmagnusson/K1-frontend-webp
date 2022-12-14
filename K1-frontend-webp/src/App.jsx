import { useState, useEffect } from 'react'
import { io } from "socket.io-client"
import './App.css'

let socket = io("https://k1-backend-webp.herokuapp.com/")

function App() {
  const [socketId, setSocketId] = useState("");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageData, setMessageData] = useState([]);
  // const [user, setUser] = useState("");


  useEffect(() => {

    socket.on("connect", () => {
      socket.emit("username", "aleks");
      socket.on("message", (Data) => {

        // 'Data' visar vad vi skriver ut på server.js (backend).
        // Data = { username: "", message: "" }
        setMessageData((PrevMessage) => [...PrevMessage, Data])
      });


    });
    return () => {
      socket.off("message");
    }
  }, []);


  function createRoom() {
    // Använder en prompt/popup ruta.
    const room = prompt("Vad vill du namnge rummet?");
    // Socket -global används här.
    socket.emit("create_room", room);
    console.log(room);
  }

  // Skapa användare och namnge användare.
  function createUser() {
    const username = prompt("Ange ditt användarnamn:");
    socket.emit("username", username);
    console.log(username);
  }

  // Skicka meddelande.
  function handleMessage() {
    console.log(message);
    socket.emit("message", message);
  }

  function joinRoom() {
    // Använder en prompt/popup ruta.
    const room = prompt("Vilket rum vill du gå med i?");
    setRoom(room)
    socket.emit("join_room", room);
  }

  function leaveRoom() {
    // const room = prompt("Vilket rum vill du lämna?")
    setRoom("");

    socket.emit("leave_room", room);
  }

  function deleteRoom() {

    socket.emit("delete_room", room);
  }


  return (
    <div className="App">
      <header className="App-header">
        <p>Realtime Chat K3</p>
        <form id="form" action="" onSubmit={(e) => e.preventDefault()}></form>

        <main className="App-body">
          <ul id="message">{messageData.map((message) => {
            return <li>{message.username}:  {message.message}</li>
          })}</ul>

          <input id='message' type="text" value={message}
            placeholder="Skicka meddelande" onChange={(e) => setMessage(e.target.value)} />
          <button type='submit' onClick={() => handleMessage()}>Skicka</button>
          <br />

          <button onClick={() => createUser("username")}>Skapa Användare</button>

          <button onClick={() => createRoom("room")}>Skapa rum</button>

          <button onClick={() => joinRoom("room")}>Gå med i rum</button>

          <button onClick={() => leaveRoom("room")}>Lämna rum</button>

          <button onClick={() => deleteRoom("room")}>Ta bort rum</button>
        </main>

      </header >
    </div >
  )
}

export default App
