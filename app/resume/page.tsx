import Link from 'next/link';
import { entriesFor, profile } from '@/lib/portfolio';
import { PrintResume } from '@/components/print-resume';
export const metadata = { title: 'Resume Overview | Mark Gonzalez' };
export default function Resume() {
  return <main className="resume-page"><div className="resume-toolbar"><Link className="button button-outline" href="/">← Back to portfolio</Link><PrintResume/></div><header><p className="eyebrow">RESUME OVERVIEW</p><h1>{profile.name}</h1><p>{profile.headline}</p></header>{(['work','education','projects'] as const).map(category => <section key={category}><h2>{category === 'work' ? 'Experience' : category === 'education' ? 'Education' : 'Projects'}</h2>{entriesFor(category).map(entry => <article key={entry.id}><div className="entry-heading"><h3>{entry.title} · {entry.subtitle}</h3><span>{entry.period}</span></div><p>{entry.summary}</p><ul>{entry.highlights.map(item => <li key={item}>{item}</li>)}</ul><p className="muted">{entry.tags.join(' · ')}</p></article>)}</section>)}</main>;
}
