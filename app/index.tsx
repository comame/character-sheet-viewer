import React from 'react';
import { createRoot } from 'react-dom/client'

function App() {
    return <div>Hello, world!</div>
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
