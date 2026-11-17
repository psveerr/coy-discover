import { useState } from 'react';
import Discover from './Discover.jsx';

export default function App() {
  const [tab, setTab] = useState('discover');

  return (
    <div className="app">
      <main className="screen">{tab === 'discover' && <Discover />}</main>
      <nav className="tabbar">
        <button className={tab === 'home' ? 'active' : ''} aria-current={tab === 'home'} onClick={() => setTab('home')}>Home</button>
        <button className={tab === 'discover' ? 'active' : ''} aria-current={tab === 'discover'} onClick={() => setTab('discover')}>Discover</button>
      </nav>
    </div>
  );
}
