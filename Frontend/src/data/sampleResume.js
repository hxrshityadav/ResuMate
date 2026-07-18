export const SAMPLE_TARGET_ROLE = "Senior Product Engineer";

export const SAMPLE_ORIGINAL_BULLET =
  "Worked on account onboarding, built React screens, and helped the team improve accessibility.";

export const SAMPLE_IMPROVED_BULLET =
  "Rebuilt account onboarding in React and TypeScript, reducing median setup time from 18 to 11 minutes.";

export const createSampleResume = () => ({
  name: "Jordan Lee",
  role: "Product Engineer",
  location: "Portland, OR",
  phone: "(503) 555-0147",
  email: "jordan.lee@example.com",
  linkedIn: "linkedin.com/in/jordanlee",
  gitHub: "github.com/jordanlee",
  summary:
    "Product engineer focused on dependable web products and the design systems behind them. Five years shipping React and TypeScript applications, partnering closely with design, and improving frontend performance.",
  education: {
    degree: "B.S. Computer Science",
    college: "Oregon State University",
    year: "2020",
  },
  skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Design Systems", "Accessibility"],
  experience: [
    {
      title: "Product Engineer",
      company: "Northstar Labs",
      time: "May 2022 - Present",
      points: [
        SAMPLE_IMPROVED_BULLET,
        "Introduced a shared component release workflow used across four product teams.",
        "Added accessibility checks to CI and documented review patterns for designers and engineers.",
      ],
    },
    {
      title: "Frontend Developer",
      company: "Cedar & Finch",
      time: "Jul 2020 - Apr 2022",
      points: [
        "Shipped customer account tools used by support and operations teams each day.",
        "Worked with design to consolidate repeated interface patterns into a small component library.",
      ],
    },
  ],
  projects: [
    {
      title: "Component Health Dashboard",
      description:
        "An internal dashboard that tracks component adoption, accessibility coverage, and release status across product teams.",
      technologiesUsed: ["React", "TypeScript", "Node.js"],
    },
  ],
  certifications: [],
  achievements: [],
  languages: [{ name: "English" }],
});
