export const SIDEBAR_NAVIGATION = [
  {
    label: 'WORKSPACE',
    items: [
      { label: 'Dashboard', icon: 'home', route: '/dashboard', roles: ["em", "manager"] },
      { label: 'My Tasks', icon: 'file-check', route: '/tasks' },
      { label: 'Team Board', icon: 'columns-2', route: '/team-board' },
      { label: 'All Tasks', icon: 'list-check', route: '/all-tasks' },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { label: 'Teams', icon: 'users', route: '/teams' },
      { label: 'Members', icon: 'user', route: '/members' },
    ],
  },
  {
    label: 'INSIGHTS',
    items: [
      { label: 'Analytics', icon: 'chart-bar', route: '/analytics' },
      { label: 'Reports', icon: 'chart-line', route: '/reports' },
      
    ],
  },
  {
    label: 'SYSTEM',
    items: [{ label: 'Settings', icon: 'cog', route: '/settings' }],
  },
] as const;
