import Link from 'next/link';

export default function NotFound() {
  return <main className="not-found"><p className="eyebrow">OBJECT NOT FOUND</p><h1>Lost in the <em>dark.</em></h1><p>This body is not part of the current Sol Loom catalog.</p><Link className="explore-button" href="/">RETURN TO THE SYSTEM →</Link></main>;
}
