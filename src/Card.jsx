import { useState } from 'react';

const THRESHOLD = 100; // pixels you must drag before it counts as a swipe

export default function Card({ profile, onSwipe }) {
  const [dx, setDx] = useState(0);
  const [startX, setStartX] = useState(null);
  const [leaving, setLeaving] = useState(null); // "like" or "pass" while flying off

  // Fly the card off screen; onTransitionEnd tells the parent once it is gone.
  function finish(action) {
    setLeaving(action);
    setDx((d) => d + (action === 'like' ? 600 : -600)); // always moves, so onTransitionEnd always fires
  }

  function onPointerDown(e) {
    if (leaving) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setStartX(e.clientX);
  }

  function onPointerMove(e) {
    if (startX !== null) setDx(e.clientX - startX);
  }

  function onPointerUp() {
    if (startX === null) return;
    setStartX(null);
    if (dx > THRESHOLD) finish('like');
    else if (dx < -THRESHOLD) finish('pass');
    else setDx(0); // not far enough: snap back
  }

  const style = {
    transform: `translateX(${dx}px) rotate(${dx / 20}deg)`,
    transition: startX === null ? 'transform 0.3s ease' : 'none',
  };

  return (
    <>
      <div
        className="card"
        style={style}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onTransitionEnd={() => leaving && onSwipe(leaving)}
      >
        <img src={profile.photo} alt={profile.name} draggable="false" />
        <span className="stamp like" aria-hidden="true" style={{ opacity: dx / THRESHOLD }}>LIKE</span>
        <span className="stamp nope" aria-hidden="true" style={{ opacity: -dx / THRESHOLD }}>NOPE</span>
        <div className="info">
          <h2>{profile.name}, {profile.age}</h2>
          <p className="city">{profile.city}</p>
          <p>{profile.bio}</p>
          <div className="tags">{profile.interests.map((i) => <span key={i}>{i}</span>)}</div>
        </div>
      </div>
      <div className="actions">
        <button className="pass" disabled={leaving} onClick={() => finish('pass')}>✕ Pass</button>
        <button className="like" disabled={leaving} onClick={() => finish('like')}>♥ Like</button>
      </div>
    </>
  );
}
