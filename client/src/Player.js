import React from 'react';

const Player = ({ x, y }) => {
  const playerStyle = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    width: '20px',
    height: '20px',
    backgroundColor: 'blue',
  };

  return <div style={playerStyle}></div>;
};

export default Player;
