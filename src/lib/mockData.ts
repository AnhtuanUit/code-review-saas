import { Repository, PullRequest, CodeIssue, Stats, User } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64',
  githubUsername: 'johndoe',
  plan: 'free',
  createdAt: '2024-01-15T10:30:00Z'
};

export const mockRepositories: Repository[] = [
  {
    id: '1',
    name: 'awesome-project',
    fullName: 'johndoe/awesome-project',
    url: 'https://github.com/johndoe/awesome-project',
    private: false,
    webhookStatus: 'active',
    lastScan: '2024-01-20T14:30:00Z',
    language: 'TypeScript',
    stars: 342
  },
  {
    id: '2',
    name: 'api-server',
    fullName: 'johndoe/api-server',
    url: 'https://github.com/johndoe/api-server',
    private: true,
    webhookStatus: 'inactive',
    lastScan: '2024-01-19T09:15:00Z',
    language: 'Python',
    stars: 89
  },
  {
    id: '3',
    name: 'mobile-app',
    fullName: 'johndoe/mobile-app',
    url: 'https://github.com/johndoe/mobile-app',
    private: false,
    webhookStatus: 'pending',
    lastScan: '2024-01-18T16:45:00Z',
    language: 'JavaScript',
    stars: 156
  }
];

export const mockPullRequests: PullRequest[] = [
  {
    id: '1',
    number: 47,
    title: 'Add user authentication system',
    repository: 'awesome-project',
    branch: 'feature/auth',
    author: 'johndoe',
    status: 'needs_work',
    lastRun: '2024-01-20T14:30:00Z',
    issuesCount: 3,
    linesChanged: 245
  },
  {
    id: '2',
    number: 23,
    title: 'Fix database connection pooling',
    repository: 'api-server',
    branch: 'fix/db-pool',
    author: 'janedoe',
    status: 'approved',
    lastRun: '2024-01-20T11:15:00Z',
    issuesCount: 0,
    linesChanged: 89
  },
  {
    id: '3',
    number: 156,
    title: 'Implement dark mode toggle',
    repository: 'mobile-app',
    branch: 'feature/dark-mode',
    author: 'bobsmith',
    status: 'pending',
    lastRun: '2024-01-20T09:45:00Z',
    issuesCount: 1,
    linesChanged: 167
  }
];

export const mockCodeIssues: CodeIssue[] = [
  {
    id: '1',
    type: 'error',
    rule: 'no-unused-vars',
    message: 'Variable "user" is assigned a value but never used',
    file: 'src/auth/login.ts',
    line: 23,
    column: 8,
    severity: 'high',
    suggestion: 'Remove the unused variable or use it in the function'
  },
  {
    id: '2',
    type: 'warning',
    rule: 'no-console',
    message: 'Unexpected console statement',
    file: 'src/utils/logger.ts',
    line: 15,
    column: 4,
    severity: 'medium',
    suggestion: 'Use a proper logging library instead of console.log'
  },
  {
    id: '3',
    type: 'info',
    rule: 'prefer-const',
    message: 'Variable "config" is never reassigned, use const instead',
    file: 'src/config/app.ts',
    line: 8,
    column: 5,
    severity: 'low',
    suggestion: 'Change "let config" to "const config"'
  }
];

export const mockStats: Stats = {
  totalPRs: 156,
  issuesFound: 342,
  issuesFixed: 289,
  reposConnected: 8,
  topRules: [
    { rule: 'no-unused-vars', count: 45 },
    { rule: 'no-console', count: 32 },
    { rule: 'prefer-const', count: 28 },
    { rule: 'no-undef', count: 24 },
    { rule: 'semicolon', count: 19 }
  ],
  trendsData: [
    { date: '2024-01-14', issues: 23 },
    { date: '2024-01-15', issues: 34 },
    { date: '2024-01-16', issues: 28 },
    { date: '2024-01-17', issues: 41 },
    { date: '2024-01-18', issues: 35 },
    { date: '2024-01-19', issues: 29 },
    { date: '2024-01-20', issues: 38 }
  ]
};