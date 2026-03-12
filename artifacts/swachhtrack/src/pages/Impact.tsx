import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetEnvironmentalImpact, useGetCitizenDashboard } from "@workspace/api-client-react";
import { Leaf, Droplets, Zap, Trees, Wind, Package } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Impact() {
  const { data: impact } = useGetEnvironmentalImpact({});
  const { data: dashboard } = useGetCitizenDashboard({});

  const stats = impact ?? {
    wasteDiverted: 23.4,
    plasticRecycled: 8.7,
    co2Reduced: 15.2,
    treesEquivalent: 3,
    waterSaved: 4200,
    energySaved: 87,
  };

  const impactCards = [
    { label: "Waste Diverted from Landfill", value: `${stats.wasteDiverted} kg`, icon: Package, color: "text-green-600", bg: "bg-green-50", desc: "Kept out of Mumbai's overflowing landfills" },
    { label: "Plastic Recycled", value: `${stats.plasticRecycled} kg`, icon: Leaf, color: "text-blue-600", bg: "bg-blue-50", desc: "Plastic saved from polluting our oceans" },
    { label: "CO₂ Emissions Reduced", value: `${stats.co2Reduced} kg`, icon: Wind, color: "text-teal-600", bg: "bg-teal-50", desc: "Carbon footprint you've saved" },
    { label: "Trees Equivalent", value: `${stats.treesEquivalent} trees`, icon: Trees, color: "text-emerald-600", bg: "bg-emerald-50", desc: "Equivalent CO₂ absorbed by trees in a year" },
    { label: "Water Saved", value: `${stats.waterSaved.toLocaleString()} L`, icon: Droplets, color: "text-sky-600", bg: "bg-sky-50", desc: "Water saved through recycling processes" },
    { label: "Energy Saved", value: `${stats.energySaved} kWh`, icon: Zap, color: "text-amber-600", bg: "bg-amber-50", desc: "Energy recovered through proper recycling" },
  ];

  const monthlyData = [
    { month: "Sep", waste: 2.1, co2: 1.4, plastic: 0.8 },
    { month: "Oct", waste: 3.5, co2: 2.3, plastic: 1.2 },
    { month: "Nov", waste: 4.2, co2: 2.8, plastic: 1.5 },
    { month: "Dec", waste: 5.8, co2: 3.9, plastic: 2.1 },
    { month: "Jan", waste: 3.9, co2: 2.6, plastic: 1.4 },
    { month: "Feb", waste: 4.8, co2: 3.2, plastic: 1.7 },
    { month: "Mar", waste: 6.2, co2: 4.1, plastic: 2.3 },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20 mb-4">
            <Leaf className="w-4 h-4" />
            <span>Environmental Impact</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Your Environmental Impact</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every item you recycle makes a real difference. Here's the positive impact your recycling has made on our planet.
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 mb-10 border border-primary/20 text-center">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold mb-2">You're making a difference!</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Your {stats.wasteDiverted} kg of waste diverted is equivalent to planting <strong className="text-primary">{stats.treesEquivalent} trees</strong> and saving <strong className="text-blue-600">{stats.waterSaved.toLocaleString()} litres</strong> of water.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-semibold">
            <Leaf className="w-4 h-4" /> Keep Segregating – Every Gram Counts!
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {impactCards.map((card) => (
            <Card key={card.label} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center mb-4`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className={`text-3xl font-bold ${card.color} mb-1`}>{card.value}</div>
                <div className="font-semibold text-sm mb-1">{card.label}</div>
                <p className="text-xs text-muted-foreground">{card.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Impact Trend</CardTitle>
            <CardDescription>Your environmental contribution over the last 7 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData} margin={{ left: -10 }}>
                <defs>
                  <linearGradient id="waste" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="co2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="plastic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val, name) => [`${val} kg`, name === "waste" ? "Waste Diverted" : name === "co2" ? "CO₂ Reduced" : "Plastic Recycled"]} />
                <Area type="monotone" dataKey="waste" stroke="#22c55e" fill="url(#waste)" strokeWidth={2} />
                <Area type="monotone" dataKey="co2" stroke="#06b6d4" fill="url(#co2)" strokeWidth={2} />
                <Area type="monotone" dataKey="plastic" stroke="#3b82f6" fill="url(#plastic)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-3 text-sm">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500" /> Waste Diverted (kg)</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-cyan-500" /> CO₂ Reduced (kg)</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500" /> Plastic Recycled (kg)</div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { emoji: "🇮🇳", title: "India's Challenge", fact: "India generates 62 million tonnes of waste per year, but only 22% is scientifically treated." },
            { emoji: "♻️", title: "Recycling Power", fact: "Recycling 1 tonne of plastic saves 7.4 cubic yards of landfill space and 5,774 kWh of energy." },
            { emoji: "🌊", title: "Ocean Impact", fact: "8 million metric tonnes of plastic enter our oceans annually. Proper segregation stops this." },
          ].map((fact) => (
            <Card key={fact.title} className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">{fact.emoji}</div>
                <div className="font-bold mb-2">{fact.title}</div>
                <p className="text-sm text-muted-foreground">{fact.fact}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

