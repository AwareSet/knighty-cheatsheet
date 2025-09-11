export const cheatsheets = [
  {
    id: 'cli',
    title: 'CLI Commands',
    description: '50 Most Essential Terminal Commands',
    category: 'System',
    icon: '💻',
    color: '#667eea',
    tags: ['terminal', 'bash', 'shell', 'commands'],
    file: 'cli_cheat_sheet.html',
    featured: true
  },
  {
    id: 'golang',
    title: 'Golang',
    description: 'Essential Go Commands & Development Workflow',
    category: 'Development',
    icon: '🐹',
    color: '#00ADD8',
    tags: ['go', 'programming', 'development', 'build'],
    file: 'golang_cheat_sheet.html',
    featured: true
  },
  {
    id: 'xargs',
    title: 'xargs',
    description: 'Command Construction & Parallel Execution',
    category: 'System',
    icon: '⚡',
    color: '#f59e0b',
    tags: ['xargs', 'parallel', 'pipes', 'automation'],
    file: 'xargs_cheat_sheet.html',
    featured: true
  },
  {
    id: 'sql',
    title: 'SQL',
    description: 'Database Queries & Data Management',
    category: 'Database',
    icon: '📊',
    color: '#10b981',
    tags: ['sql', 'database', 'queries', 'mysql', 'postgresql'],
    file: 'sql_cheat_sheet.html',
    featured: true
  },
  {
    id: 'networking',
    title: 'Networking',
    description: 'Network Commands by OSI/TCP-IP Layers',
    category: 'Network',
    icon: '🌐',
    color: '#3b82f6',
    tags: ['networking', 'tcp', 'ip', 'dns', 'firewall'],
    file: 'networking_cheat_sheet.html',
    featured: true
  },
  {
    id: 'find',
    title: 'Find Command',
    description: 'File Search and Directory Operations',
    category: 'System',
    icon: '🔍',
    color: '#8b5cf6',
    tags: ['find', 'search', 'files', 'directories'],
    file: 'find_cheat_sheet.html'
  },
  {
    id: 'grep',
    title: 'Grep',
    description: 'Text Search and Pattern Matching',
    category: 'System',
    icon: '🔎',
    color: '#ef4444',
    tags: ['grep', 'search', 'regex', 'text'],
    file: 'grep_cheat_sheet.html'
  },
  {
    id: 'git',
    title: 'Git',
    description: 'Version Control Commands',
    category: 'Development',
    icon: '📚',
    color: '#f97316',
    tags: ['git', 'version-control', 'github', 'commits'],
    file: 'git_cheat_sheet.html'
  },
  {
    id: 'docker',
    title: 'Docker',
    description: 'Container Management Commands',
    category: 'DevOps',
    icon: '🐳',
    color: '#0ea5e9',
    tags: ['docker', 'containers', 'images', 'devops'],
    file: 'docker_cheat_sheet.html'
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes',
    description: 'Container Orchestration Commands',
    category: 'DevOps',
    icon: '☸️',
    color: '#326ce5',
    tags: ['kubernetes', 'k8s', 'orchestration', 'pods'],
    file: 'kubernetes_cheat_sheet.html'
  },
  {
    id: 'vim',
    title: 'Vim',
    description: 'Text Editor Commands and Shortcuts',
    category: 'Editor',
    icon: '✏️',
    color: '#019833',
    tags: ['vim', 'editor', 'shortcuts', 'text'],
    file: 'vim_cheat_sheet.html'
  },
  {
    id: 'bash',
    title: 'Bash',
    description: 'Shell Scripting and Commands',
    category: 'System',
    icon: '🐚',
    color: '#4c1d95',
    tags: ['bash', 'shell', 'scripting', 'automation'],
    file: 'bash_cheat_sheet.html'
  },
  {
    id: 'curl',
    title: 'cURL',
    description: 'HTTP Client and API Testing',
    category: 'Network',
    icon: '🌍',
    color: '#059669',
    tags: ['curl', 'http', 'api', 'rest'],
    file: 'curl_cheat_sheet.html'
  },
  {
    id: 'ssh',
    title: 'SSH',
    description: 'Secure Shell and Remote Access',
    category: 'Network',
    icon: '🔐',
    color: '#7c3aed',
    tags: ['ssh', 'remote', 'security', 'tunneling'],
    file: 'ssh_cheat_sheet.html'
  },
  {
    id: 'tar',
    title: 'Tar',
    description: 'Archive and Compression Commands',
    category: 'System',
    icon: '📦',
    color: '#dc2626',
    tags: ['tar', 'archive', 'compression', 'backup'],
    file: 'tar_cheat_sheet.html'
  },
  {
    id: 'rsync',
    title: 'Rsync',
    description: 'File Synchronization and Transfer',
    category: 'System',
    icon: '🔄',
    color: '#0891b2',
    tags: ['rsync', 'sync', 'backup', 'transfer'],
    file: 'rsync_cheat_sheet.html'
  },
  {
    id: 'jq',
    title: 'jq',
    description: 'JSON Processing and Manipulation',
    category: 'Data',
    icon: '📄',
    color: '#f59e0b',
    tags: ['jq', 'json', 'data', 'parsing'],
    file: 'jq_cheat_sheet.html'
  },
  {
    id: 'awk',
    title: 'AWK',
    description: 'Text Processing and Data Extraction',
    category: 'System',
    icon: '📝',
    color: '#84cc16',
    tags: ['awk', 'text', 'processing', 'data'],
    file: 'awk_cheat_sheet.html'
  },
  {
    id: 'ffmpeg',
    title: 'FFmpeg',
    description: 'Video and Audio Processing',
    category: 'Media',
    icon: '🎬',
    color: '#16a34a',
    tags: ['ffmpeg', 'video', 'audio', 'conversion'],
    file: 'ffmpeg_reference_sheet.html'
  },
  {
    id: 'python-pip',
    title: 'Python pip',
    description: 'Python Package Management',
    category: 'Development',
    icon: '🐍',
    color: '#3776ab',
    tags: ['python', 'pip', 'packages', 'virtual-env'],
    file: 'python_pip_cheat_sheet.html'
  },
  {
    id: 'ytdlp',
    title: 'yt-dlp',
    description: 'YouTube and Video Download Tool',
    category: 'Media',
    icon: '📺',
    color: '#ff0000',
    tags: ['youtube', 'download', 'video', 'media'],
    file: 'ytdlp_cheat_sheet.html'
  },
  {
    id: 'fabric-ai',
    title: 'Fabric AI',
    description: 'AI-Powered Text Processing Framework',
    category: 'AI',
    icon: '🤖',
    color: '#6366f1',
    tags: ['ai', 'fabric', 'text', 'automation'],
    file: 'fabric_ai_cheat_sheet.html'
  },
  {
    id: 'claude-cli',
    title: 'Claude CLI',
    description: 'Claude AI Command Line Interface',
    category: 'AI',
    icon: '🧠',
    color: '#8b5a2b',
    tags: ['claude', 'ai', 'cli', 'assistant'],
    file: 'claude_cli_cheat_sheet.html'
  },
  {
    id: 'n8n',
    title: 'n8n',
    description: 'Workflow Automation Platform',
    category: 'Automation',
    icon: '🔗',
    color: '#ea580c',
    tags: ['n8n', 'workflow', 'automation', 'integration'],
    file: 'n8n_cheat_sheet.html'
  },
  {
    id: 'cron',
    title: 'Cron Scheduler',
    description: 'Task Scheduling and Automation',
    category: 'System',
    icon: '⏰',
    color: '#0d9488',
    tags: ['cron', 'scheduler', 'automation', 'tasks'],
    file: 'cron_scheduler_demo.html'
  }
];

export const categories = [
  'All',
  'System',
  'Development', 
  'Network',
  'Database',
  'DevOps',
  'Editor',
  'Data',
  'Media',
  'AI',
  'Automation'
];

export const getFeaturedCheatsheets = () => {
  return cheatsheets.filter(sheet => sheet.featured);
};

export const getCheatsheetsByCategory = (category) => {
  if (category === 'All') return cheatsheets;
  return cheatsheets.filter(sheet => sheet.category === category);
};

export const searchCheatsheets = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return cheatsheets.filter(sheet => 
    sheet.title.toLowerCase().includes(lowercaseQuery) ||
    sheet.description.toLowerCase().includes(lowercaseQuery) ||
    sheet.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
