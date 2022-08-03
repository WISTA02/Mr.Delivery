import './App.css';
import { io } from 'socket.io-client';
import { useState } from 'react';
import Chat from './Chat';
import ToggleColorMode from './ToggleColorMode';
import axios from 'axios';

const socket = io.connect('http://localhost:5000');
function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);


  
  function joinRoom() {
    if (username !== '' && room !== '') {
      axios
        .get('http://localhost:5000/getUser')
        .then((user) => {
          console.log(user.data);
          for (let i = 0; i <= user.data.length - 1; i++) {
            if (user.data[i].username === username) {
              if (
                room === 'driver-customer' &&
                (user.data[i].role === 'user' || user.data[i].role === 'driver')
              ) {
                socket.emit('join_room', room);
                setShowChat(true);
              }
              if (
                room === 'owner-driver' &&
                (user.data[i].role === 'owner' ||
                  user.data[i].role === 'driver')
              ) {
                socket.emit('join_room', room);
                setShowChat(true);
              }
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
  return (
    <div className='App'>
      <ToggleColorMode></ToggleColorMode>
      {!showChat ? (
        <div className='joinChatContainer'>
          <h3>Join A Chat</h3>
          <input
            type='text'
            placeholder='Username...'
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <select
            value={room}
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          >
            <option value='none'>Select an Option</option>
            <option value='driver-customer'>driver-customer</option>
            <option value='owner-driver'>owner-driver</option>
          </select>
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat key={socket.id} socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
