import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGetLeaderboard, useGetBadges, useGetRewardPoints } from "@workspace/api-client-react";
import { Trophy, Star, Award, Zap, Leaf } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const levelColors: Record<string, string> = {
  "Eco Beginner": "bg-gray-100 text-gray-700",
  "Green Citizen": "bg-green-100 text-green-700",
  "Recycling Champion": "bg-blue-100 text-blue-700",
  "Sustainability Hero": "bg-purple-100 text-purple-700",
  "Zero Waste Warrior": "bg-amber-100 text-amber-700",
};

export default function Rewards() {
  const { user } = useAuth();
  const { data: rewardInfo } = useGetRewardPoints({});
  const { data: leaderboard } = useGetLeaderboard();
  const { data: badges } = useGetBadges({});

  const points = rewardInfo?.greenPoints ?? user?.greenPoints ?? 750;
  const level = rewardInfo?.level ?? user?.level ?? "Recycling Champion";
  const nextLevel = rewardInfo?.nextLevelPoints ?? 1000;
  const progress = Math.min((points / nextLevel) * 100, 100);
  const rank = rewardInfo?.rank ?? 4;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20 mb-4">
            <Trophy className="w-4 h-4" />
            <span>Rewards & Gamification</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Your Green Rewards</h1>
          <p className="text-muted-foreground text-lg">Every recyclable item earns you Green Points. Climb the leaderboard and unlock badges!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="md:col-span-1 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-muted-foreground font-medium">Green Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-bold text-primary">{points.toLocaleString()}</span>
                <Leaf className="w-6 h-6 text-primary mb-2" />
              </div>
              <Badge className={levelColors[level] ?? "bg-primary/10 text-primary"}>{level}</Badge>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progress to next level</span>
                  <span className="font-medium">{points}/{nextLevel}</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{nextLevel - points} points needed to level up</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-muted-foreground font-medium">City Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <div className="text-4xl font-bold">#{rank}</div>
                  <p className="text-muted-foreground text-sm">in {user?.city ?? "Mumbai"}</p>
                  <p className="text-xs text-muted-foreground">out of {(rewardInfo?.totalUsers ?? 12450).toLocaleString()} citizens</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-muted-foreground font-medium">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600">{rewardInfo?.weeklyPoints ?? 125}</div>
                  <p className="text-muted-foreground text-sm">weekly points</p>
                  <p className="text-xs text-muted-foreground">{rewardInfo?.monthlyPoints ?? 380} this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" /> Badges & Achievements
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(badges ?? [
              { id: "b1", name: "Eco Beginner", description: "Started your green journey", icon: "🌱", unlocked: true, earnedAt: "2025-01-15T00:00:00Z", requirement: "Earn 1 green point" },
              { id: "b2", name: "Green Citizen", description: "Making a difference daily", icon: "🌿", unlocked: true, earnedAt: "2025-02-01T00:00:00Z", requirement: "Earn 100 green points" },
              { id: "b3", name: "Recycling Champion", description: "Champion of waste segregation", icon: "♻️", unlocked: true, earnedAt: "2025-02-20T00:00:00Z", requirement: "Earn 500 green points" },
              { id: "b4", name: "Sustainability Hero", description: "Inspiring others through action", icon: "🏆", unlocked: false, earnedAt: null, requirement: "Earn 1000 green points" },
              { id: "b5", name: "Zero Waste Warrior", description: "Ultimate waste warrior", icon: "⚡", unlocked: false, earnedAt: null, requirement: "Earn 2000 green points" },
              { id: "b6", name: "Plastic Slayer", description: "Recycled 50 plastic items", icon: "🧴", unlocked: true, earnedAt: "2025-03-01T00:00:00Z", requirement: "Recycle 50 plastic items" },
              { id: "b7", name: "Nature Protector", description: "Saved 10kg CO₂ emissions", icon: "🌳", unlocked: false, earnedAt: null, requirement: "Reduce 10kg CO2" },
              { id: "b8", name: "Community Star", description: "Top 10 in leaderboard", icon: "⭐", unlocked: false, earnedAt: null, requirement: "Rank in top 10" },
            ]).map((badge) => (
              <Card
                key={badge.id}
                className={`text-center transition-all hover:shadow-md ${!badge.unlocked ? "opacity-50 grayscale" : "border-primary/20"}`}
              >
                <CardContent className="pt-6 pb-4">
                  <div className="text-4xl mb-3">{badge.icon}</div>
                  <div className="font-semibold text-sm mb-1">{badge.name}</div>
                  <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                  {badge.unlocked ? (
                    <Badge className="bg-green-100 text-green-700 text-xs">Unlocked ✓</Badge>
                  ) : (
                    <div className="text-xs text-muted-foreground border border-dashed rounded px-2 py-1">{badge.requirement}</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" /> Community Leaderboard
          </h2>
          <Card>
            <CardHeader>
              <CardDescription>Top recyclers in your city this month</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-sm text-muted-foreground">
                      <th className="text-left p-4">Rank</th>
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4 hidden sm:table-cell">City</th>
                      <th className="text-left p-4">Points</th>
                      <th className="text-left p-4 hidden md:table-cell">Level</th>
                      <th className="text-right p-4 hidden md:table-cell">Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(leaderboard ?? [
                      { rank: 1, userId: "u1", name: "Aditya Kumar", city: "Mumbai", greenPoints: 2840, level: "Zero Waste Warrior", itemsRecycled: 142 },
                      { rank: 2, userId: "u2", name: "Sneha Patel", city: "Pune", greenPoints: 2650, level: "Zero Waste Warrior", itemsRecycled: 133 },
                      { rank: 3, userId: "u3", name: "Rahul Nair", city: "Bengaluru", greenPoints: 2420, level: "Sustainability Hero", itemsRecycled: 121 },
                      { rank: 4, userId: "u4", name: "Priya Sharma", city: "Mumbai", greenPoints: 750, level: "Recycling Champion", itemsRecycled: 47 },
                    ]).map((entry) => (
                      <tr key={entry.userId} className={`border-b hover:bg-muted/30 transition-colors ${entry.name === (user?.name ?? "Priya Sharma") ? "bg-primary/5" : ""}`}>
                        <td className="p-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${entry.rank === 1 ? "bg-amber-100 text-amber-700" : entry.rank === 2 ? "bg-gray-100 text-gray-700" : entry.rank === 3 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"}`}>
                            {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : entry.rank}
                          </div>
                        </td>
                        <td className="p-4 font-medium">
                          {entry.name}
                          {entry.name === (user?.name ?? "Priya Sharma") && <Badge className="ml-2 text-xs bg-primary/10 text-primary">You</Badge>}
                        </td>
                        <td className="p-4 text-muted-foreground hidden sm:table-cell">{entry.city}</td>
                        <td className="p-4 font-bold text-primary">{entry.greenPoints.toLocaleString()}</td>
                        <td className="p-4 hidden md:table-cell">
                          <Badge className={levelColors[entry.level] ?? "bg-gray-100 text-gray-700"}>{entry.level}</Badge>
                        </td>
                        <td className="p-4 text-right hidden md:table-cell text-muted-foreground">{entry.itemsRecycled}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
