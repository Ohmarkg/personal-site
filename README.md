# Mark Gonzalez — Portfolio

A responsive software developer portfolio with a standard professional view and an interactive, Spotify-inspired Player Mode. Built with **Next.js App Router, TypeScript, Tailwind CSS, Motion for React, and Lucide React**. No backend, API keys, account system, or paid service is required. Inter is bundled locally through `@fontsource/inter`, so the site does not request fonts from Google at runtime.

## Run locally

Use **Node.js 22.18+** (Node.js 24 is recommended) and npm.

```sh
git clone https://github.com/Ohmarkg/personal-site.git
cd personal-site
git switch feat/player-mode
npm ci
npm run dev
```

Open **http://localhost:3000**.

```sh
npm test              # 16 player-state and data-integrity checks
npm run typecheck     # TypeScript
npm run format:check  # Formatting
npm run build         # Production build
npm start             # Serve the production build after building
```

## Branches and pull requests

- `main`: initial, production-buildable Next.js foundation.
- `feat/standard-portfolio`: standard portfolio, detail dialogs, and resume overview (**PR #1**, targets `main`).
- `feat/player-mode`: complete end-to-end website, including all standard portfolio work (**PR #2**, stacked on `feat/standard-portfolio`).

Review and merge PR #1 first, then retarget PR #2 to `main` and merge it. Keep the standard feature branch until PR #2 has been retargeted. Until both are merged, use `feat/player-mode` for the complete implementation. Neither PR configures deployment.

## Routes

| Route                       | Experience                                                                                            |
| --------------------------- | ----------------------------------------------------------------------------------------------------- |
| `/`                         | Professional homepage: introduction, Work / Education tabs, experience, projects, skills, and contact |
| `/player`                   | Player Mode, starting with About, as specified by the Figma annotation                                |
| `/player?playlist=projects` | Open a playlist (`about`, `work`, `education`, `projects`, `skills`)                                  |
| `/player?entry=frogslayer`  | Select a specific entry and its playlist                                                              |
| `/resume`                   | Printable resume overview generated from the portfolio data                                           |

Invalid entry or playlist parameters safely fall back to About.

## Features

- Desktop and mobile layouts with shared typed content and reusable covers, tags, detail content, dialogs, and playback controls.
- Standard portfolio navigation, accessible Work / Education tabs, native modal detail dialogs, and a printable resume overview.
- Player Home, five playlists, text search across titles/descriptions/technologies, and saved entries stored only in the current browser.
- Play/pause, previous/next, seek, shuffle without immediate repeats, and repeat off/all/one.
- Fullscreen player with entry details and working playback controls.
- Local player back/forward navigation, mobile bottom navigation, and return links to the standard portfolio.
- Keyboard-operable controls, skip links, visible focus, native modal focus trapping/Escape, descriptive button names, and reduced-motion support.

**Playback is a timed reading walkthrough, with no audio.** Durations represent reading windows. Entries advance automatically when Play is enabled; pause or seek to explore at your own pace. Saved entries require browser storage; if storage is unavailable, the site continues working without persistence. Player history is in-session and distinct from the browser's page history.

### Keyboard controls

| Key                       | Action                                                              |
| ------------------------- | ------------------------------------------------------------------- |
| Space                     | Play / pause while focus is outside an interactive control          |
| Left / Right              | Previous / next entry while focus is outside an interactive control |
| F                         | Toggle fullscreen while focus is outside an interactive control     |
| Escape                    | Close a modal or fullscreen player                                  |
| Left / Right / Home / End | Switch Work / Education tabs when a tab has focus                   |
| Tab, Enter, Space         | Navigate and activate buttons and links                             |

Shortcuts do not intercept typing, native range adjustments, links, or buttons.

## Edit content

`lib/portfolio.ts` owns the profile, typed entries, playlists, skill groups, read durations, and optional links. Both experiences consume the same data.

- Add an entry to `entries` with a unique ID and one of the existing categories.
- Set an entry's optional `artwork` to a local exported Figma asset path to replace its monogram cover (including organization emblems).
- Set an entry's optional `href` to a confirmed project URL to expose its external project link.
- Set `profile.email` to a confirmed address to expose the email contact link. Until then, contact uses Mark's verified GitHub profile.
- Replace or supplement the `/resume` overview with a reviewed resume PDF when ready. The current page is generated from portfolio content, not an uploaded official resume.
- Set `profile.portraitDesktop` and `profile.portraitMobile` to local public paths after the original Figma assets are available. Desktop expects the exact square crop; mobile expects the exact circular crop. The current fallback is intentionally an initials cover, never a synthetic portrait.

`lib/player-state.ts` contains the pure playback reducer. `components/player-experience.tsx` owns navigation, search, saved entries, and orchestration. Playback controls and the fullscreen view are separate components.

## Design references and remaining work

Inspected through Figma before implementation:

- [Original reference](https://www.figma.com/design/POPjgSW574IHySkGW28O59/Figma-Mock-of-site): Desktop / Home (`2:2`) and the Enter Player Mode annotation (`42:564`).
- [Duplicate reference](https://www.figma.com/design/dY4HOBd4KEwBwodTf4hgLw/Figma-Mock-of-site--Copy-): Mobile / Home — Full Page (`20:144`), plus the file's component/frame structure.

The original and duplicate exposed one page containing standard desktop/mobile home and experience frames. **Player screens were not present in the accessible file structure.** Player Mode therefore follows the requested Spotify-inspired interactions and the standard design's colors/typography; it is not a verified match to missing player frames. Projects, skills, education content, and contact complete the requested scope beyond the visible standard frames.

**Asset limitation:** Figma design context and export metadata were readable, but its temporary asset URLs returned an HTML “Site Unavailable” response when downloaded in this environment. No invalid HTML files or expiring Figma URLs are shipped. The portrait and three organization emblems currently use monogram fallbacks, so these remain visual differences from the design. Replace those with the original static assets before considering the design match final.

**Verification:** TypeScript, 16 deterministic state/data checks, and the production build were run successfully. Browser-based visual and interaction QA was unavailable in this environment. Before release, review desktop and mobile rendering (especially 360px, 402px, 768px, and 1216px), native dialog focus/return behavior, keyboard shortcuts, reduced motion, saved-entry persistence, and print output.

## Deployment

Nothing has been deployed, and no paid services have been configured. The site uses no server-specific application features. After review, Vercel can host the existing Next.js build; GitHub Pages would require enabling Next.js static export and configuring the repository base path and hosting workflow. Choose and approve a deployment target before adding hosting configuration.
