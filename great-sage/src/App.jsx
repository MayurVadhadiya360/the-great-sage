import React, { useState } from 'react'
import './App.css';
import Sidebar from './components/Sidebar';
import { SidebarMenuIcon } from './components/sidebar_comps/SidebarMenuIcon';
import { ChatGround } from './components/ChatGround';

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div
      style={{
        backgroundColor: 'black',
        color: 'white',
        width: '100vw',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {/* visible when sidebar is hidden */}
      {!sidebarVisible &&
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            top: '16px',
            left: '16px'
          }}
        >
          <SidebarMenuIcon sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible} />
        </div>
      }
      {sidebarVisible && <Sidebar sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible} />}
      <ChatGround />

    </div>
  );
}

export default App;
