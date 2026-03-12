import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Leaf, Package, Cpu, GlassWater, Newspaper, Recycle } from "lucide-react";

const categories = [
  {
    name: "Organic Waste",
    icon: "🌿",
    binColor: "Green Bin",
    binHex: "#22c55e",
    examples: ["Vegetable peels", "Fruit scraps", "Cooked food leftovers", "Tea/coffee grounds", "Eggshells", "Garden waste", "Coconut shells"],
    tips: ["Start home composting", "Use a lidded container to avoid smell", "Keep separate from plastic", "Add dry leaves to balance moisture"],
    description: "Food scraps and garden waste that can be composted.",
    keywords: ["food", "vegetable", "fruit", "cooked", "tea", "coffee", "garden", "leaf", "coconut", "egg"],
  },
  {
    name: "Plastic Waste",
    icon: "🧴",
    binColor: "Blue Bin",
    binHex: "#3b82f6",
    examples: ["Water bottles (PET)", "Plastic bags", "Shampoo bottles", "Food containers", "Straws", "Plastic cups", "Packaging films"],
    tips: ["Rinse containers before recycling", "Crush bottles to save space", "Remove caps and labels", "Check recycling number on bottom"],
    description: "Plastic items that can be recycled into new products.",
    keywords: ["plastic", "bottle", "bag", "container", "straw", "cup", "packaging", "polythene", "wrapper"],
  },
  {
    name: "Metal Waste",
    icon: "🥫",
    binColor: "Grey Bin",
    binHex: "#6b7280",
    examples: ["Aluminum cans", "Steel containers", "Metal bottle caps", "Copper wire", "Iron scraps", "Tin cans", "Aluminum foil"],
    tips: ["Clean before disposing", "Crush cans to save space", "Separate aluminum from steel", "Check for sharp edges"],
    description: "Metal items that are 100% recyclable indefinitely.",
    keywords: ["metal", "aluminum", "steel", "copper", "iron", "tin", "can", "foil", "wire"],
  },
  {
    name: "Glass Waste",
    icon: "🍶",
    binColor: "White Bin",
    binHex: "#e5e7eb",
    examples: ["Glass bottles", "Glass jars", "Broken glass", "Mirrors", "Drinking glasses", "Medicine bottles", "Glass cups"],
    tips: ["Wrap broken glass safely in newspaper", "Remove caps and lids", "Rinse containers", "Handle with care"],
    description: "Glass is infinitely recyclable without quality loss.",
    keywords: ["glass", "bottle", "jar", "mirror", "window", "drinking", "medicine"],
  },
  {
    name: "E-Waste",
    icon: "📱",
    binColor: "Red Bin / Collection Center",
    binHex: "#ef4444",
    examples: ["Mobile phones", "Laptop/computers", "Batteries (all types)", "Chargers & cables", "Printers", "TVs & monitors", "Earphones"],
    tips: ["Never put in regular trash", "Find authorized e-waste collectors", "Wipe data before disposal", "Check manufacturer take-back programs"],
    description: "Electronic waste containing hazardous materials — needs special handling.",
    keywords: ["phone", "laptop", "computer", "battery", "charger", "cable", "printer", "tv", "electronic"],
  },
  {
    name: "Paper Waste",
    icon: "📰",
    binColor: "Yellow Bin",
    binHex: "#eab308",
    examples: ["Newspapers", "Cardboard boxes", "Paper bags", "Office paper", "Magazines", "Books (old)", "Cardboard packaging"],
    tips: ["Keep paper dry — wet paper can't be recycled", "Remove staples and metal clips", "Flatten cardboard boxes", "Avoid shredded paper"],
    description: "Paper and cardboard that can be pulped and recycled.",
    keywords: ["paper", "newspaper", "cardboard", "magazine", "book", "office", "packaging", "bag"],
  },
];

export default function Guide() {
  const [search, setSearch] = useState("");

  const filtered = search
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.keywords.some((k) => k.includes(search.toLowerCase())) ||
          c.examples.some((e) => e.toLowerCase().includes(search.toLowerCase()))
      )
    : categories;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20 mb-4">
            <Recycle className="w-4 h-4" />
            <span>Waste Education</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Waste Segregation Guide</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn how to properly sort your waste. Correct segregation is the first step toward a cleaner India.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search for an item (e.g. plastic bottle, battery...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No results found for "{search}"</p>
            <p className="text-sm mt-2">Try searching for: plastic bottle, battery, newspaper</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cat) => (
              <Card key={cat.name} className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{cat.icon}</span>
                    <div>
                      <CardTitle className="text-xl">{cat.name}</CardTitle>
                      <Badge
                        className="mt-1 font-medium"
                        style={{ backgroundColor: cat.binHex + "20", color: cat.binHex, borderColor: cat.binHex + "40" }}
                      >
                        {cat.binColor}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" /> Examples
                    </h4>
                    <ul className="space-y-1">
                      {cat.examples.slice(0, 5).map((ex) => (
                        <li key={ex} className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block flex-shrink-0" />
                          {ex}
                        </li>
                      ))}
                      {cat.examples.length > 5 && (
                        <li className="text-xs text-muted-foreground/70">+{cat.examples.length - 5} more...</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-primary" /> Recycling Tips
                    </h4>
                    <ul className="space-y-1">
                      {cat.tips.map((tip) => (
                        <li key={tip} className="text-sm text-muted-foreground flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block mt-1.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-16 rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Quick Reference: Bin Colors</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categories.map((c) => (
              <div key={c.name} className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-card">
                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.binHex }} />
                <span className="text-sm font-medium">{c.name.split(" ")[0]}</span>
                <span className="text-xs text-muted-foreground">→ {c.binColor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
