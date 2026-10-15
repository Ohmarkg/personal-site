'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { type PortfolioEntry } from '@/lib/portfolio';
import { Cover, EntryContent } from './shared';
export function EntryDialog({ entry, onClose }: { entry: PortfolioEntry | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!entry || !ref.current) return;
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; };
  }, [entry]);
  return <dialog ref={ref} className="entry-dialog" aria-labelledby="entry-dialog-title" onClose={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    {entry && <div className="dialog-content"><button autoFocus className="icon-button dialog-close" aria-label="Close details" onClick={onClose}><X/></button><Cover entry={entry} className="dialog-cover"/><p className="eyebrow">{entry.category}</p><h2 id="entry-dialog-title">{entry.title}</h2><p className="muted">{entry.subtitle} · {entry.period}</p><EntryContent entry={entry}/><Link className="button button-green" href={`/player?entry=${entry.id}`}>Open in Player Mode</Link></div>}
  </dialog>;
}
