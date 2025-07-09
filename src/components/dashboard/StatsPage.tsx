import { Card } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  Bug, 
  Shield, 
  GitPullRequest, 
  Target,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockStats } from '@/lib/mockData';

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export function StatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Statistics</h1>
        <p className="text-slate-400">Analytics and insights about your code quality and review process</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-600/20 rounded-lg p-3">
              <GitPullRequest className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <ChevronUp className="h-4 w-4" />
                <span>+12%</span>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{mockStats.totalPRs}</h3>
          <p className="text-slate-400 text-sm">Total PRs Reviewed</p>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-600/20 rounded-lg p-3">
              <Bug className="h-6 w-6 text-red-400" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-red-400 text-sm">
                <ChevronDown className="h-4 w-4" />
                <span>-5%</span>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{mockStats.issuesFound}</h3>
          <p className="text-slate-400 text-sm">Issues Found</p>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-600/20 rounded-lg p-3">
              <Shield className="h-6 w-6 text-green-400" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <ChevronUp className="h-4 w-4" />
                <span>+8%</span>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{mockStats.issuesFixed}</h3>
          <p className="text-slate-400 text-sm">Issues Fixed</p>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-600/20 rounded-lg p-3">
              <Target className="h-6 w-6 text-purple-400" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <ChevronUp className="h-4 w-4" />
                <span>+3%</span>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{mockStats.reposConnected}</h3>
          <p className="text-slate-400 text-sm">Connected Repos</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Issues Trend</h3>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockStats.trendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="issues" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#06b6d4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Top Rules Triggered</h3>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockStats.topRules}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {mockStats.topRules.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Most Common Issues</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockStats.topRules.map((rule, index) => (
              <div key={rule.rule} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-slate-300 font-medium">{rule.rule}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(rule.count / mockStats.topRules[0].count) * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                  <span className="text-white font-semibold w-8 text-right">{rule.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}