import { ArrowUpRight, Code2, Play } from "lucide-react";
import { profile, type PortfolioEntry } from "@/lib/portfolio";

export function Cover({
  entry,
  className = "",
  large = false,
}: {
  entry: Pick<PortfolioEntry, "title" | "monogram" | "color" | "artwork">;
  className?: string;
  large?: boolean;
}) {
  return (
    <div
      className={`cover ${large ? "cover-large" : ""} ${className}`}
      style={{ "--cover-color": entry.color } as React.CSSProperties}
      aria-hidden="true"
    >
      {entry.artwork ? (
        <img className="cover-image" src={entry.artwork} alt="" />
      ) : (
        <>
          <Code2 className="cover-code" />
          <span>{entry.monogram}</span>
          {large && <small>{entry.title}</small>}
        </>
      )}
    </div>
  );
}
export function Portrait({ className = "" }: { className?: string }) {
  if (profile.portraitDesktop)
    return (
      <picture className={`portrait ${className}`}>
        <source
          media="(max-width: 767px)"
          srcSet={profile.portraitMobile ?? profile.portraitDesktop}
        />
        {/* Original images are local Figma exports; retain their exact crop. */}
        <img src={profile.portraitDesktop} alt="Mark Gonzalez" />
      </picture>
    );
  return (
    <div
      className={`portrait portrait-fallback ${className}`}
      aria-label="Mark Gonzalez"
    >
      <span className="portrait-kicker">DEVELOPER</span>
      <span className="portrait-initials">MG</span>
      <span className="portrait-caption">
        Mark Gonzalez · Software Developer
      </span>
    </div>
  );
}
export function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="tags" aria-label="Technologies">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}
export function EntryContent({ entry }: { entry: PortfolioEntry }) {
  return (
    <>
      <p className="entry-summary">{entry.summary}</p>
      <ul className="highlights">
        {entry.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Tags tags={entry.tags} />
      {entry.href && (
        <a
          className="text-link"
          href={entry.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          View project <ArrowUpRight size={16} />
        </a>
      )}
    </>
  );
}
export function PlayGlyph() {
  return <Play size={22} fill="currentColor" aria-hidden="true" />;
}
