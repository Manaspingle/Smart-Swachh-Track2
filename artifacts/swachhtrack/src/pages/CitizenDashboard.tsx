import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGetCitizenDashboard } from "@workspace/api-client-react";
import { MOCK_CITIZEN_DASHBOARD, MOCK_CHALLENGES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Award, Target, Trophy, ArrowRight, Camera, BookOpen, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { format, parseISO } from "date-fns";

export default function CitizenDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  // Attempt to fetch from API, fallback to mock if fails
  const { data: dashboardData, isLoading, isError } = useGetCitizenDashboard({ userId: user?.id });
  
  const data = dashboardData || MOCK_CITIZEN_DASHBOARD;

  if (!isAuthenticated) {
    setLocation("/auth");
    return null;
  }
  
  if (isLoading && !dashboardData && !isError) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Welcome back, {user?.name?.split(' ')[0] ?? "Citizen"}</h1>
            <p className="text-muted-foreground mt-1">Here's your recycling impact for this week.</p>
          </div>
          <Link href="/classify">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 h-11 px-6 hover-elevate group">
              <Camera className="mr-2 h-5 w-5" />
              Classify Waste
              <ArrowRight className="ml-2 w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-2 transition-all" />
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-card relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 text-green-600">
              <Award className="w-24 h-24" />
            </div>
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="font-medium text-green-700 dark:text-green-400">Total Green Points</CardDescription>
              <CardTitle className="text-4xl font-display text-green-900 dark:text-green-50">{data.totalPoints}</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-md inline-block">
                Level: {user?.level}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5"><Target className="w-4 h-4 text-blue-500"/> Items Segregated</CardDescription>
              <CardTitle className="text-3xl font-display">{data.itemsSegregated}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">+12 from last week</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5"><Leaf className="w-4 h-4 text-emerald-500"/> Eco Score</CardDescription>
              <CardTitle className="text-3xl font-display text-emerald-600">{data.ecoScore}/100</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-secondary/20 h-2 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${data.ecoScore}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-amber-500"/> City Rank</CardDescription>
              <CardTitle className="text-3xl font-display">#{data.rank}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Top 5% in {user?.city}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Charts Area */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Points earned over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--accent)/0.5)' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="points" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <h3 className="font-display font-bold text-xl mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/guide" className="block">
                <Card className="border-border/50 shadow-sm hover:border-primary/50 hover-elevate transition-all h-full text-center p-4 bg-white/50 backdrop-blur-sm">
                  <div className="w-10 h-10 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-sm">Segregation Guide</h4>
                </Card>
              </Link>
              <Link href="/rewards" className="block">
                <Card className="border-border/50 shadow-sm hover:border-primary/50 hover-elevate transition-all h-full text-center p-4 bg-white/50 backdrop-blur-sm">
                  <div className="w-10 h-10 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-sm">Leaderboard</h4>
                </Card>
              </Link>
              <Link href="/centers" className="block">
                <Card className="border-border/50 shadow-sm hover:border-primary/50 hover-elevate transition-all h-full text-center p-4 bg-white/50 backdrop-blur-sm">
                  <div className="w-10 h-10 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-sm">Find Centers</h4>
                </Card>
              </Link>
              <Link href="/reports" className="block">
                <Card className="border-border/50 shadow-sm hover:border-primary/50 hover-elevate transition-all h-full text-center p-4 bg-white/50 backdrop-blur-sm">
                  <div className="w-10 h-10 mx-auto bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-3">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-sm">Report Issue</h4>
                </Card>
              </Link>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Daily Challenge Widget */}
            <Card className="border-2 border-primary/20 shadow-md bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Daily Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                {MOCK_CHALLENGES.filter(c => !c.completed).slice(0,1).map(challenge => (
                  <div key={challenge.id} className="space-y-4">
                    <div>
                      <h4 className="font-bold">{challenge.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">+{challenge.points} pts</span>
                      <span className="text-xs text-muted-foreground bg-secondary/10 px-2 py-1 rounded-md">{challenge.deadline}</span>
                    </div>
                    <Button className="w-full mt-2 hover-elevate">Take Challenge</Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">Waste Composition</CardTitle>
              </CardHeader>
              <CardContent className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {data.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number, name: string) => [`${value} items`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 justify-center text-xs mt-[-20px]">
                  {data.categoryBreakdown.slice(0,3).map(c => (
                    <div key={c.category} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span>{c.category}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center
                          ${activity.category === 'Plastic' ? 'bg-blue-100 text-blue-600' : 
                            activity.category === 'Organic' ? 'bg-green-100 text-green-600' : 
                            'bg-red-100 text-red-600'}`}
                        >
                          <Recycle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors">{activity.itemName}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      <div className="font-bold text-sm text-green-600">+{activity.pointsEarned}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
