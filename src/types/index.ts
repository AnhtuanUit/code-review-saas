export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  githubUsername: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  url: string;
  private: boolean;
  webhookStatus: 'active' | 'inactive' | 'pending';
  lastScan: string;
  language: string;
  stars: number;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  repository: string;
  branch: string;
  author: string;
  status: 'pending' | 'approved' | 'needs_work' | 'failed';
  lastRun: string;
  issuesCount: number;
  linesChanged: number;
}

export interface CodeIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  rule: string;
  message: string;
  file: string;
  line: number;
  column: number;
  severity: 'high' | 'medium' | 'low';
  suggestion?: string;
}

export interface Stats {
  totalPRs: number;
  issuesFound: number;
  issuesFixed: number;
  reposConnected: number;
  topRules: { rule: string; count: number }[];
  trendsData: { date: string; issues: number }[];
}