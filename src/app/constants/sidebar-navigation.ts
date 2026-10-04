export const SIDEBAR_NAVIGATION = [
  {
    label: 'WORKSPACE',
    items: [
      { label: 'Dashboard', icon: 'home', route: '/dashboard', roles: ["admin","director","manager","employee"] },
      { label: 'My Tasks', icon: 'file-check', route: '/tasks', roles: ["admin","director","manager","employee"] },
      { label: 'Team Board', icon: 'columns-2', route: '/team-board', roles: ["admin","director","manager","employee"] },
      { label: 'All Tasks', icon: 'list-check', route: '/all-tasks' , roles: ["admin","director"]},
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { label: 'Teams', icon: 'users', route: '/teams' , roles: ["admin","director"]},
      { label: 'Members', icon: 'user', route: '/members' , roles: ["admin","director","manager"]},
    ],
  },
  {
    label: 'INSIGHTS',
    items: [
      { label: 'Analytics', icon: 'chart-bar', route: '/analytics' , roles: ["admin","director","manager"]},
      { label: 'Reports', icon: 'chart-line', route: '/reports' , roles: ["admin","director"]},
      
    ],
  },
  {
    label: 'SYSTEM',
    items: [{ label: 'Settings', icon: 'cog', route: '/settings', roles: ["admin","director","manager","employee"] }],
  },
] as const;
