import { useEffect, useState } from 'react';
import Card from './Card.jsx';

export default function Discover() {
  const [feed, setFeed] = useState(null);
  const [match, setMatch] = useState(null);
  const [matches, setMatches] = useState(null); // null = matches list is closed

  useEffect(() => {
    fetch('/feed').then((r) => r.json()).then(setFeed);
  }, []);

  async function swipe(action) {
    const profile = feed[0];
    const res = await fetch('/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: profile.id, action }),
    });
    const body = await res.json();
    setFeed((f) => f.slice(1));
    if (body.match) setMatch(profile);
  }

  async function openMatches() {
    setMatches(await fetch('/matches').then((r) => r.json()));
  }

  if (!feed) return <p className="empty">Loading...</p>;

  if (matches) {
    return (
      <div className="matches">
        <button className="link" onClick={() => setMatches(null)}>← Back</button>
        <h2>Matches</h2>
        {matches.length === 0 && <p className="empty">No matches yet. Keep swiping!</p>}
        {matches.map((p) => (
          <div key={p.id} className="match-row">
            <img src={p.photo} alt={p.name} />
            <span>{p.name}, {p.age} · {p.city}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="discover">
      <button className="link" onClick={openMatches}>Matches</button>
      {feed.length === 0 ? (
        <p className="empty">You've seen everyone for now. Check back later!</p>
      ) : (
        <Card key={feed[0].id} profile={feed[0]} onSwipe={swipe} />
      )}
      {match && (
        <div className="overlay" onClick={() => setMatch(null)}>
          <h1>It's a match!</h1>
          <img src={match.photo} alt={match.name} />
          <p>You and {match.name} liked each other.</p>
          <button>Keep swiping</button>
        </div>
      )}
    </div>
  );
}
