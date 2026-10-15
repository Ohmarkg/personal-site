export type Category = "about" | "work" | "education" | "projects" | "skills";
export interface PortfolioEntry {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  period: string;
  location?: string;
  summary: string;
  highlights: string[];
  tags: string[];
  color: string;
  monogram: string;
  duration: number;
  href?: string;
  artwork?: string;
}
export const profile = {
  name: "Mark Gonzalez",
  headline: "Software developer from Dallas, Texas",
  bio: "I build software for practical problems and help people understand the systems behind it. My experience spans production development, mobile applications, and technical teaching.",
  github: "https://github.com/Ohmarkg",
  email: null as string | null,
  portraitDesktop: null as string | null,
  portraitMobile: null as string | null,
};
export const entries: PortfolioEntry[] = [
  {
    id: "about-mark",
    category: "about",
    title: "Mark Gonzalez",
    subtitle: "Software Developer",
    period: "Dallas, Texas",
    summary: profile.bio,
    highlights: [
      "Computer Science senior at Texas A&M University, graduating December 2026.",
      "I enjoy building practical applications, working with people, and explaining how software works.",
      "My work connects production software, mobile development, and technical teaching.",
    ],
    tags: ["Development", "Collaboration", "Teaching"],
    color: "#174b31",
    monogram: "MG",
    duration: 90,
  },
  {
    id: "frogslayer",
    category: "work",
    title: "Frogslayer",
    subtitle: "Junior Developer",
    period: "January 2026 – Present",
    location: "College Station, Texas",
    summary:
      "Work on production software with React and TypeScript, with responsibilities that have expanded into troubleshooting integrations and responding to technical client requests.",
    highlights: [
      "Investigate missing employee synchronization issues using logs and integration workflows.",
      "Handle manual sync requests and verify results.",
      "Contribute changes through tickets and pull requests.",
    ],
    tags: ["React", "TypeScript", "Production debugging", "Integrations"],
    color: "#284616",
    monogram: "F",
    duration: 150,
  },
  {
    id: "tamu-health",
    category: "work",
    title: "Texas A&M Health",
    subtitle: "Software Intern",
    period: "Summer 2025",
    location: "College Station, Texas",
    summary:
      "Worked on a workflow for extracting information from PDFs and exporting structured data.",
    highlights: [
      "Developed with Next.js, React, Flask, and PyMuPDF.",
      "Supported PDF-to-JSON extraction and Excel export.",
      "Presented the work in a project demo.",
    ],
    tags: ["Next.js", "React", "Flask", "Python"],
    color: "#124b69",
    monogram: "H",
    duration: 120,
  },
  {
    id: "shpe",
    category: "work",
    title: "SHPE Texas A&M",
    subtitle: "App Lead and Maintainer",
    period: "Summer 2025 – Present",
    location: "College Station, Texas",
    summary:
      "Led development work around the chapter’s mobile app and now contribute as a maintainer.",
    highlights: [
      "Worked with Expo React Native and Firebase.",
      "Led workshops explaining the app architecture to other developers.",
      "Contributed to chapter demographic data and business intelligence efforts.",
    ],
    tags: ["React Native", "Expo", "Firebase", "Technical leadership"],
    color: "#793315",
    monogram: "S",
    duration: 135,
  },
  {
    id: "tamu-education",
    category: "education",
    title: "Texas A&M University",
    subtitle: "B.S. in Computer Science",
    period: "Expected December 2026",
    location: "College Station, Texas",
    summary:
      "Computer Science senior with hands-on experience in software engineering, accessible computing, artificial intelligence, and data science.",
    highlights: [
      "Building an API-monitoring system for a sponsored senior capstone.",
      "Served as an ENGR 102 and ENGR 216 Peer Teacher, supporting students through office hours and grading.",
      "Mentored students through ESBP and the VIP Python Bootcamp.",
    ],
    tags: ["Computer Science", "Peer teaching", "Mentorship"],
    color: "#500000",
    monogram: "A&M",
    duration: 120,
  },
  {
    id: "api-monitor",
    category: "projects",
    title: "API Monitor",
    subtitle: "Senior Capstone · In progress",
    period: "Fall 2026",
    summary:
      "An early-warning system for silent API failures, built with Ruby on Rails and PostgreSQL.",
    highlights: [
      "Schedule API checks and compare responses against user-defined assertions.",
      "Track response times and failure history in a dashboard.",
      "Use background jobs to run checks and surface mismatches and timeouts.",
    ],
    tags: ["Ruby on Rails", "PostgreSQL", "Background jobs"],
    color: "#173e48",
    monogram: "API",
    duration: 135,
  },
  {
    id: "reaction",
    category: "projects",
    title: "ReACTION",
    subtitle: "Multiplayer script-reading app",
    period: "Personal project",
    summary:
      "A shared script-reading experience where friends play characters together and discover their lines as the scene unfolds.",
    highlights: [
      "Built with Expo React Native and Socket.IO.",
      "Supports sessions for two to six players.",
      "Combines structured scripts with narrator text-to-speech and hidden upcoming lines.",
    ],
    tags: ["React Native", "Socket.IO", "Text-to-speech"],
    color: "#3d285f",
    monogram: "R",
    duration: 105,
  },
  {
    id: "hamster-escape",
    category: "projects",
    title: "Hamster Escape",
    subtitle: "Game design project",
    period: "Course project",
    summary:
      "A game built in Unreal Engine, bringing C++ and Blueprint development into an interactive project.",
    highlights: [
      "Developed game behavior with Unreal Engine.",
      "Worked with C++ and Blueprint scripting.",
      "Applied game design concepts in a playable course project.",
    ],
    tags: ["Unreal Engine", "C++", "Blueprints"],
    color: "#734d23",
    monogram: "HE",
    duration: 90,
  },
  {
    id: "skills",
    category: "skills",
    title: "Tools of the Trade",
    subtitle: "Technical skills",
    period: "Always learning",
    summary:
      "A toolkit built through production work, mobile applications, teaching, and coursework.",
    highlights: [
      "Frontend: React, React Native, Expo, Next.js, Tailwind CSS, and MUI.",
      "Backend and data: Node.js, Flask, Spring Boot, Ruby on Rails, PostgreSQL, and Firebase.",
      "Languages and tools: TypeScript, Python, Java, C++, SQL, Git, Docker, and Postman.",
    ],
    tags: ["Frontend", "Backend", "Mobile", "Data"],
    color: "#403e17",
    monogram: "</>",
    duration: 90,
  },
];
export const playlists: {
  id: Category;
  title: string;
  description: string;
  color: string;
  monogram: string;
}[] = [
  {
    id: "about",
    title: "About",
    description: "Meet the developer behind the work.",
    color: "#174b31",
    monogram: "MG",
  },
  {
    id: "work",
    title: "Work Experience",
    description: "Production software, mobile apps, and teamwork.",
    color: "#284616",
    monogram: "01",
  },
  {
    id: "education",
    title: "Education",
    description: "Learning, teaching, and building at Texas A&M.",
    color: "#500000",
    monogram: "02",
  },
  {
    id: "projects",
    title: "Projects",
    description: "Practical problems. Creative solutions.",
    color: "#173e48",
    monogram: "03",
  },
  {
    id: "skills",
    title: "Skills",
    description: "The tools behind the applications.",
    color: "#403e17",
    monogram: "04",
  },
];
export function entriesFor(category: Category) {
  return entries.filter((entry) => entry.category === category);
}
export function entryById(id: string) {
  return entries.find((entry) => entry.id === id);
}

export const skillGroups: { title: string; tags: string[] }[] = [
  {
    title: "Frontend & Mobile",
    tags: [
      "React",
      "TypeScript",
      "Next.js",
      "React Native",
      "Expo",
      "Tailwind CSS",
      "MUI",
    ],
  },
  {
    title: "Backend & Data",
    tags: [
      "Node.js",
      "Flask",
      "Spring Boot",
      "Ruby on Rails",
      "PostgreSQL",
      "Firebase",
    ],
  },
  {
    title: "Languages & Tools",
    tags: ["Python", "Java", "C++", "SQL", "Git", "Docker", "Postman"],
  },
];
