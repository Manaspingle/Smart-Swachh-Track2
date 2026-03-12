import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetRecyclingCenters } from "@workspace/api-client-react";
import { MapPin, Phone, Clock, Filter } from "lucide-react";

const categoryColors: Record<string, string> = {
  plastic: "bg-blue-100 text-blue-700",
  organic: "bg-green-100 text-green-700",
  metal: "bg-gray-100 text-gray-700",
  glass: "bg-cyan-100 text-cyan-700",
  ewaste: "bg-red-100 text-red-700",
  paper: "bg-yellow-100 text-yellow-700",
  battery: "bg-orange-100 text-orange-700",
};

export default function Centers() {
  const { data: centers = [] } = useGetRecyclingCenters({});
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = centers.filter((c) => {
    const matchesSearch = !filter || c.name.toLowerCase().includes(filter.toLowerCase()) || c.address.toLowerCase().includes(filter.toLowerCase());
    const matchesType = !typeFilter || c.acceptedTypes.includes(typeFilter);
    return matchesSearch && matchesType;
  });

  return (
    <AppLayout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20 mb-4">
            <MapPin className="w-4 h-4" />
            <span>Find Centers</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Recycling Center Locator</h1>
          <p className="text-muted-foreground text-lg">Find nearby recycling and waste collection centers in your area.</p>
        </div>

        <div className="rounded-2xl overflow-hidden border mb-8 bg-gradient-to-br from-primary/5 to-secondary/5 relative" style={{ height: 300 }}>
          <img
            src={`${import.meta.env.BASE_URL}images/map-placeholder.png`}
            alt="Map showing recycling centers"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur rounded-2xl p-6 text-center shadow-lg">
              <MapPin className="w-10 h-10 text-primary mx-auto mb-2" />
              <h3 className="font-bold text-lg">Interactive Map</h3>
              <p className="text-muted-foreground text-sm mt-1">Centers marked below — use filters to find by waste type</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {(centers.length > 0 ? centers : [
                  { id: "c1", name: "Andheri Hub", address: "", city: "", latitude: 0, longitude: 0, acceptedTypes: [], timings: "", phone: "", distance: "1.2 km" },
                  { id: "c2", name: "Bandra E-Waste", address: "", city: "", latitude: 0, longitude: 0, acceptedTypes: [], timings: "", phone: "", distance: "3.4 km" },
                ]).slice(0, 5).map((c, i) => (
                  <div key={c.id} className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    <MapPin className="w-3 h-3" />
                    {c.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name or area..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["", "plastic", "organic", "ewaste", "metal", "glass"].map((type) => (
              <Button
                key={type}
                size="sm"
                variant={typeFilter === type ? "default" : "outline"}
                onClick={() => setTypeFilter(type)}
                className="capitalize"
              >
                {type || "All Types"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(filtered.length > 0 ? filtered : [
            { id: "c1", name: "Andheri Recycling Hub", address: "Andheri Station Road, Opposite HDFC Bank, Andheri East", city: "Mumbai", latitude: 19.1136, longitude: 72.8697, acceptedTypes: ["plastic", "paper", "metal", "glass"], timings: "Mon–Sat: 8 AM – 6 PM", phone: "+91 22-2682-1234", distance: "1.2 km" },
            { id: "c2", name: "Bandra E-Waste Center", address: "Hill Road, Near St. Andrew's Church, Bandra West", city: "Mumbai", latitude: 19.0596, longitude: 72.8295, acceptedTypes: ["ewaste", "battery", "plastic"], timings: "Mon–Fri: 9 AM – 5 PM", phone: "+91 22-2640-5678", distance: "3.4 km" },
            { id: "c3", name: "Juhu Green Facility", address: "JVPD Scheme, Vile Parle West", city: "Mumbai", latitude: 19.1075, longitude: 72.8263, acceptedTypes: ["organic", "plastic", "paper", "glass", "metal"], timings: "Daily: 7 AM – 7 PM", phone: "+91 22-2613-9012", distance: "2.8 km" },
            { id: "c4", name: "Dharavi Composting Center", address: "90 Feet Road, Dharavi", city: "Mumbai", latitude: 19.043, longitude: 72.852, acceptedTypes: ["organic", "paper"], timings: "Mon–Sat: 6 AM – 4 PM", phone: "+91 22-2407-3456", distance: "8.1 km" },
            { id: "c5", name: "Powai High-Tech Recycling", address: "Hiranandani Gardens, Powai", city: "Mumbai", latitude: 19.1197, longitude: 72.9053, acceptedTypes: ["ewaste", "metal", "glass", "plastic"], timings: "Mon–Sat: 9 AM – 6 PM", phone: "+91 22-2577-7890", distance: "5.5 km" },
          ]).map((center) => (
            <Card key={center.id} className="hover:shadow-lg transition-all hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-tight">{center.name}</CardTitle>
                  {center.distance && (
                    <Badge variant="outline" className="flex-shrink-0 text-xs">{center.distance}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>{center.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 flex-shrink-0 text-primary" />
                  <span>{center.timings}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                  <a href={`tel:${center.phone}`} className="hover:text-primary">{center.phone}</a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Accepts:</p>
                  <div className="flex flex-wrap gap-1">
                    {center.acceptedTypes.map((type) => (
                      <Badge key={type} className={`${categoryColors[type] ?? "bg-gray-100 text-gray-700"} text-xs capitalize`}>
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-2">
                  <MapPin className="w-3.5 h-3.5 mr-1" /> Get Directions
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
