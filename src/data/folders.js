// Folder structure data
// Each folder has an id, name, parent (null for root folders), type, and optional content

export const folders = [
  // Root folders (shown on desktop)
  {
    id: 1,
    name: 'About Me',
    parent: null,
    type: 'folder',
    icon: 'folder',
  },
  {
    id: 2,
    name: 'Projects',
    parent: null,
    type: 'folder',
    icon: 'folder',
  },
  {
    id: 3,
    name: 'Skills',
    parent: null,
    type: 'folder',
    icon: 'folder',
  },
  {
    id: 4,
    name: 'Experience',
    parent: null,
    type: 'folder',
    icon: 'folder',
  },
  {
    id: 5,
    name: 'Contact',
    parent: null,
    type: 'folder',
    icon: 'folder',
  },

  // About Me contents
  {
    id: 101,
    name: 'bio.txt',
    parent: 1,
    type: 'file',
    icon: 'text',
    content: 'Write your bio here...',
  },
  {
    id: 102,
    name: 'resume.pdf',
    parent: 1,
    type: 'file',
    icon: 'pdf',
    content: 'Resume content...',
  },

  // Projects contents - nested folders
  {
    id: 201,
    name: 'prodlines',
    parent: 2,
    type: 'folder',
    icon: 'folder',
  },
  {
    id: 202,
    name: 'project_2',
    parent: 2,
    type: 'folder',
    icon: 'folder',
  },
  {
    id: 203,
    name: 'project_3',
    parent: 2,
    type: 'folder',
    icon: 'folder',
  },

  // Prodlines project contents
  {
    id: 2011,
    name: 'README.md',
    parent: 201,
    type: 'file',
    icon: 'markdown',
    content: `# ProdLines

A dashboard that shows production code ownership across your engineering team. Connect GitHub repos and see who owns the most lines currently in production—only merged code counts.

## What it does

- **Production LOC leaderboard** — Real ownership metrics based on what's actually shipped, not vanity stats
- **Multi-repo dashboard** — Connect several repos and see an overview across your team
- **Trend tracking** — Compare snapshots over time to see how LOC and contributor counts change
- **Notifications** — Email, Discord, and Slack alerts when stats sync
- **Read-only access** — Uses GitHub OAuth; no tokens stored and no writes to your repos

## Tech stack

- **Next.js 16** (App Router) · **React 19**
- **Supabase** — Auth (GitHub OAuth), Postgres, RLS
- **TanStack Query** · **Redux Toolkit**
- **Tailwind CSS** · **Radix UI**
- **Vercel** — Hosting & Analytics

## Links

- Live: prodlines.vercel.app
- Repo: github.com/Ad1tya-007/prodlines`,
  },
  {
    id: 2012,
    name: 'screenshots',
    parent: 201,
    type: 'folder',
    icon: 'folder',
  },

  // Prodlines - Screenshots folder
  {
    id: 20121,
    name: 'prodlines1.jpeg',
    parent: 2012,
    type: 'file',
    icon: 'image',
    content: '/src/data/projects/prodlines/prodlines1.jpeg',
  },
  {
    id: 20122,
    name: 'prodlines2.jpeg',
    parent: 2012,
    type: 'file',
    icon: 'image',
    content: '/src/data/projects/prodlines/prodlines2.jpeg',
  },
  {
    id: 20123,
    name: 'prodlines3.jpeg',
    parent: 2012,
    type: 'file',
    icon: 'image',
    content: '/src/data/projects/prodlines/prodlines3.jpeg',
  },
  {
    id: 20124,
    name: 'prodlines4.jpeg',
    parent: 2012,
    type: 'file',
    icon: 'image',
    content: '/src/data/projects/prodlines/prodlines4.jpeg',
  },

  // Project 2 contents
  {
    id: 2021,
    name: 'info.txt',
    parent: 202,
    type: 'file',
    icon: 'text',
    content: 'Project 2 information...',
  },
  {
    id: 2022,
    name: 'assets',
    parent: 202,
    type: 'folder',
    icon: 'folder',
  },

  // Project 2 - Assets folder
  {
    id: 20221,
    name: 'logo.svg',
    parent: 2022,
    type: 'file',
    icon: 'image',
    content: 'SVG content...',
  },

  // Skills contents
  {
    id: 301,
    name: 'technical_skills.txt',
    parent: 3,
    type: 'file',
    icon: 'text',
    content: 'JavaScript, React, Node.js...',
  },
  {
    id: 302,
    name: 'languages.txt',
    parent: 3,
    type: 'file',
    icon: 'text',
    content: 'English, Spanish...',
  },
  {
    id: 303,
    name: 'certifications',
    parent: 3,
    type: 'folder',
    icon: 'folder',
  },

  // Skills - Certifications folder
  {
    id: 3031,
    name: 'cert1.pdf',
    parent: 303,
    type: 'file',
    icon: 'pdf',
    content: 'Certificate content...',
  },
  {
    id: 3032,
    name: 'cert2.pdf',
    parent: 303,
    type: 'file',
    icon: 'pdf',
    content: 'Certificate content...',
  },

  // Experience contents
  {
    id: 401,
    name: 'work_history.txt',
    parent: 4,
    type: 'file',
    icon: 'text',
    content: 'Work history details...',
  },
  {
    id: 402,
    name: 'achievements.txt',
    parent: 4,
    type: 'file',
    icon: 'text',
    content: 'Major achievements...',
  },

  // Contact contents
  {
    id: 501,
    name: 'email.txt',
    parent: 5,
    type: 'file',
    icon: 'text',
    content: 'your.email@example.com',
  },
  {
    id: 502,
    name: 'social_links.txt',
    parent: 5,
    type: 'file',
    icon: 'text',
    content: 'GitHub: github.com/username\nLinkedIn: linkedin.com/in/username',
  },
];

// Helper functions
export const getFolderById = (id) => {
  return folders.find((folder) => folder.id === id);
};

export const getChildrenOfFolder = (parentId) => {
  return folders.filter((folder) => folder.parent === parentId);
};

export const getRootFolders = () => {
  return folders.filter((folder) => folder.parent === null);
};

export const getFolderPath = (folderId) => {
  const path = [];
  let currentFolder = getFolderById(folderId);

  while (currentFolder) {
    path.unshift(currentFolder.name);
    currentFolder = currentFolder.parent
      ? getFolderById(currentFolder.parent)
      : null;
  }

  return path.join(' > ');
};
