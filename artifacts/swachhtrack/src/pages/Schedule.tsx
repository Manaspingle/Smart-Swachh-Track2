import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetPickupSchedule } from "@workspace/api-client-react";
import { Calendar, Clock, MapPin, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Schedule() {
  const { data: schedule = [] } = useGetPickupSchedule({});
  const { toast } = useToast();

  const fallback = [
    { id: "s1", wasteType: "Organic Waste", day: "Monday & Thursday", time: "7:00 AM – 9:00 AM", frequency: "Twice weekly", areas: ["Andheri", "Bandra", "Juhu", "Versova"], color: "#22c55e", icon: "🌿", notes: "Keep organic waste in green bin. Composting encouraged." },
    { id: "s2", wasteType: "Dry Waste (Plastic, Paper, Metal)", day: "Tuesday & Friday", time: "8:00 AM – 10:00 AM", frequency: "Twice weekly", areas: ["Andheri", "Bandra", "Dharavi", "Kurla"], color: "#3b82f6", icon: "♻️", notes: "Rinse containers. Keep paper dry. Separate by type if possible." },
    { id: "s3", wasteType: "Glass Waste", day: "Wednesday", time: "9:00 AM – 11:00 AM", frequency: "Weekly", areas: ["All Areas"], color: "#06b6d4", icon: "🍶", notes: "Wrap broken glass in newspaper before disposal." },
    { id: "s4", wasteType: "E-Waste Collection Drive", day: "Last Saturday of Month", time: "10:00 AM – 4:00 PM", frequency: "Monthly", areas: ["Andheri East Collection Point", "Bandra Kurla Complex", "Powai Tech Hub"], color: "#ef4444", icon: "📱", notes: "Bring phones, batteries, cables. Data erasure service available." },
    { id: "s5", wasteType: "Bulky Waste", day: "Saturday", time: "7:00 AM – 12:00 PM", frequency: "Weekly", areas: ["All Areas – call ahead"], color: "#8b5cf6", icon: "🛋️", notes: "For furniture, appliances, large items. Pre-booking required: 1800-SWACHH." },
  ];

  const items = schedule.length > 0 ? schedule : fallback;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20 mb-4">
            <Calendar className="w-4 h-4" />
            <span>Pickup Schedule</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Waste Pickup Schedule</h1>
          <p className="text-muted-foreground text-lg">Know when to put out your waste for collection. Never miss a pickup day!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {items.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-all border-2" style={{ borderLeftColor: item.color, borderLeftWidth: 4 }}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{item.wasteType}</CardTitle>
                    <Badge
                      className="mt-1 text-xs"
                      style={{ backgroundColor: item.color + "20", color: item.color, border: `1px solid ${item.color}40` }}
                    >
                      {item.frequency}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />
                  <span className="font-medium">{item.day}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{item.areas.join(", ")}</span>
                </div>
                {item.notes && (
                  <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground border">
                    💡 {item.notes}
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => toast({
                    title: "Reminder Set!",
                    description: `You'll be notified before ${item.wasteType} pickup.`,
                  })}
                >
                  <Bell className="w-3.5 h-3.5 mr-1.5" /> Set Reminder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" /> Upcoming This Week
            </CardTitle>
            <CardDescription>Your next scheduled pickups based on today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { day: "Today", type: "Organic Waste", time: "7–9 AM", icon: "🌿", color: "#22c55e" },
                { day: "Tomorrow", type: "Dry Waste", time: "8–10 AM", icon: "♻️", color: "#3b82f6" },
                { day: "Wednesday", type: "Glass Waste", time: "9–11 AM", icon: "🍶", color: "#06b6d4" },
              ].map((upcoming) => (
                <div key={upcoming.day} className="flex items-center gap-3 p-3 bg-card rounded-xl border">
                  <span className="text-2xl">{upcoming.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{upcoming.type}</div>
                    <div className="text-xs text-muted-foreground">{upcoming.time}</div>
                  </div>
                  <Badge className="text-xs" style={{ backgroundColor: upcoming.color + "20", color: upcoming.color }}>
                    {upcoming.day}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
