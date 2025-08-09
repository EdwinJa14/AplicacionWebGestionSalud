
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar.jsx';

const styles = {
  container: {
    display: 'flex',
  },
  content: {
    flexGrow: 1, 
    padding: '2rem',
  }
};

export default function Layout() {
  return (
    <div style={styles.container}>
      <Sidebar />

      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}