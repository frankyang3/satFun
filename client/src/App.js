import React, { useState, useEffect } from 'react';
import Player from './Player';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3001');

function App() {
  const [player, setPlayer] = useState({ x: 50, y: 50, id: socket.id });
  const [players, setPlayers] = useState({});

  useEffect(() => {
    socket.on('currentPlayers', (players) => {
      setPlayers(players);
    });

    socket.on('newPlayer', (player) => {
      setPlayers((prevPlayers) => ({
        ...prevPlayers,
        [player.id]: player,
      }));
    });

    socket.on('disconnect', (playerId) => {
      setPlayers((prevPlayers) => {
        const newPlayers = { ...prevPlayers };
        delete newPlayers[playerId];
        return newPlayers;
      });
    });

    socket.on('move', (player) => {
      setPlayers((prevPlayers) => ({
        ...prevPlayers,
        [player.id]: player,
      }));
    });

    const handleKeyDown = (e) => {
      setPlayer((prevPlayer) => {
        let newPlayer;
        switch (e.key) {
          case 'w':
            newPlayer = { ...prevPlayer, y: prevPlayer.y - 5 };
            break;
          case 'a':
            newPlayer = { ...prevPlayer, x: prevPlayer.x - 5 };
            break;
          case 's':
            newPlayer = { ...prevPlayer, y: prevPlayer.y + 5 };
            break;
          case 'd':
            newPlayer = { ...prevPlayer, x: prevPlayer.x + 5 };
            break;
          default:
            return prevPlayer;
        }
        socket.emit('move', newPlayer);
        return newPlayer;
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="App">
      <Player x={player.x} y={player.y} />
      {Object.values(players).map((p) => (
        <Player key={p.id} x={p.x} y={p.y} />
      ))}
    </div>
  );
}

export default App;
