import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetMunicipalAnalytics } from "@workspace/api-client-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { BarChart3, Users, Recycle, AlertTriangle, TrendingUp, MapPin, Trophy } from "lucide-react";

const PIE_COLORS = ["#22c55e", "#3b82f6", "#eab308", "#6b7280", "#06b6d4", "#ef4444"];

const complianceColors: Record<string, string> = {
  high: "bg-green-100 text-green-700 border-green-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-red-100 text-red-700 border-red-200",
};

export default function Municipal() {
  const { data: analytics } = useGetMunicipalAnalytics();

  const stats = analytics ?? {
    totalWasteCollected: 2847.5,
    segregationRate: 68.4,
    activeUsers: 12450,
    totalReports: 342,
    areaWiseData: [
      { area: "Andheri", segregationRate: 78, totalWaste: 420, compliance: "high" },
      { area: "Bandra", segregationRate: 82, totalWaste: 380, compliance: "high" },
      { area: "Dharavi", segregationRate: 45, totalWaste: 520, compliance: "low" },
      { area: "Juhu", segregationRate: 71, totalWaste: 290, compliance: "high" },
      { area: "Kurla", segregationRate: 55, totalWaste: 460, compliance: "medium" },
      { area: "Malad", segregationRate: 63, totalWaste: 350, compliance: "medium" },
      { area: "Thane", segregationRate: 58, totalWaste: 427, compliance: "medium" },
    ],
    wasteTypeDistribution: [
      { category: "Organic", percentage: 42, amount: 1195.9 },
      { category: "Plastic", percentage: 28, amount: 797.3 },
      { category: "Paper", percentage: 14, amount: 398.7 },
      { category: "Metal", percentage: 8, amount: 227.8 },
      { category: "Glass", percentage: 5, amount: 142.4 },
      { category: "E-waste", percentage: 3, amount: 85.4 },
    ],
    weeklyTrend: [
      { day: "Mon", organic: 180, plastic: 120, metal: 45, glass: 30, ewaste: 15 },
      { day: "Tue", organic: 165, plastic: 135, metal: 50, glass: 28, ewaste: 12 },
      { day: "Wed", organic: 195, plastic: 110, metal: 42, glass: 35, ewaste: 18 },
      { day: "Thu", organic: 210, plastic: 145, metal: 55, glass: 25, ewaste: 20 },
      { day: "Fri", organic: 185, plastic: 125, metal: 48, glass: 32, ewaste: 14 },
      { day: "Sat", organic: 240, plastic: 160, metal: 60, glass: 40, ewaste: 22 },
      { day: "Sun", organic: 200, plastic: 130, metal: 38, glass: 22, ewaste: 10 },
    ],
    topCommunities: [
      { name: "Green Bandra RWA", area: "Bandra West", score: 94, members: 450, rank: 1 },
      { name: "Eco Andheri Heights", area: "Andheri East", score: 91, members: 380, rank: 2 },
      { name: "Juhu Clean Society", area: "Juhu", score: 88, members: 320, rank: 3 },
      { name: "Versova Eco Club", area: "Versova", score: 85, members: 290, rank: 4 },
      { name: "Powai Green Warriors", area: "Powai", score: 82, members: 410, rank: 5 },
    ],
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 font-medium text-sm border border-blue-200 mb-3">
              <BarChart3 className="w-4 h-4" />
              <span>Admin View</span>
            </div>
            <h1 className="text-3xl font-bold">Municipal Officer Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of waste management performance across Mumbai</p>
          </div>
          <Badge className="bg-green-100 text-green-700 border-green-200 hidden sm:flex">Live Data</Badge>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Waste Collected", value: `${stats.totalWasteCollected.toLocaleString()} T`, icon: Recycle, color: "text-green-600", bg: "bg-green-50" },
            { label: "Segregation Rate", value: `${stats.segregationRate}%`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active Citizens", value: stats.activeUsers.toLocaleString(), icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Pending Reports", value: stats.totalReports, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="pt-6">
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center mb-3`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Area-wise Segregation Rate (%)</CardTitle>
              <CardDescription>Recycling performance by neighbourhood</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stats.areaWiseData} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="area" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip formatter={(val) => [`${val}%`, "Segregation Rate"]} />
                  <Bar dataKey="segregationRate" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Waste Type Distribution</CardTitle>
              <CardDescription>Breakdown by waste category</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={240}>
                <PieChart>
                  <Pie data={stats.wasteTypeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="percentage">
                    {stats.wasteTypeDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {stats.wasteTypeDistribution.map((item, i) => (
                  <div key={item.category} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-muted-foreground flex-1">{item.category}</span>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Weekly Collection Trend (Tonnes)</CardTitle>
            <CardDescription>Daily breakdown by waste category this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={stats.weeklyTrend} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="organic" stroke="#22c55e" strokeWidth={2} dot={false} name="Organic" />
                <Line type="monotone" dataKey="plastic" stroke="#3b82f6" strokeWidth={2} dot={false} name="Plastic" />
                <Line type="monotone" dataKey="metal" stroke="#6b7280" strokeWidth={2} dot={false} name="Metal" />
                <Line type="monotone" dataKey="glass" stroke="#06b6d4" strokeWidth={2} dot={false} name="Glass" />
                <Line type="monotone" dataKey="ewaste" stroke="#ef4444" strokeWidth={2} dot={false} name="E-waste" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> Top Communities</CardTitle>
              <CardDescription>Best performing residential communities</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm text-muted-foreground">
                    <th className="text-left p-4">Rank</th>
                    <th className="text-left p-4">Community</th>
                    <th className="text-left p-4">Score</th>
                    <th className="text-right p-4">Members</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topCommunities.map((c) => (
                    <tr key={c.name} className="border-b hover:bg-muted/30">
                      <td className="p-4">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${c.rank === 1 ? "bg-amber-100 text-amber-700" : c.rank === 2 ? "bg-gray-100" : c.rank === 3 ? "bg-orange-100 text-orange-700" : "bg-muted"}`}>
                          {c.rank}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-sm">{c.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{c.area}</div>
                      </td>
                      <td className="p-4"><span className="font-bold text-green-600">{c.score}</span>/100</td>
                      <td className="p-4 text-right text-muted-foreground text-sm">{c.members}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Area Compliance Heatmap</CardTitle>
              <CardDescription>Segregation compliance status by zone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {stats.areaWiseData.map((area) => (
                  <div
                    key={area.area}
                    className={`rounded-xl p-4 border ${complianceColors[area.compliance as string] ?? "bg-gray-100 text-gray-700"}`}
                  >
                    <div className="font-semibold text-sm">{area.area}</div>
                    <div className="text-2xl font-bold mt-1">{area.segregationRate}%</div>
                    <div className="text-xs capitalize mt-1 opacity-80">{area.compliance} compliance</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-3 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-400" /> High (&gt;70%)</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-yellow-400" /> Medium (50–70%)</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400" /> Low (&lt;50%)</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

