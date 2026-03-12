import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/", (_req, res) => {
  res.json([
    {
      id: "s1",
      wasteType: "Organic Waste",
      day: "Monday & Thursday",
      time: "7:00 AM – 9:00 AM",
      frequency: "Twice weekly",
      areas: ["Andheri", "Bandra", "Juhu", "Versova"],
      color: "#22c55e",
      icon: "🌿",
      notes: "Keep organic waste in green bin. Composting encouraged.",
    },
    {
      id: "s2",
      wasteType: "Dry Waste (Plastic, Paper, Metal)",
      day: "Tuesday & Friday",
      time: "8:00 AM – 10:00 AM",
      frequency: "Twice weekly",
      areas: ["Andheri", "Bandra", "Dharavi", "Kurla"],
      color: "#3b82f6",
      icon: "♻️",
      notes: "Rinse containers. Keep paper dry. Separate by type if possible.",
    },
    {
      id: "s3",
      wasteType: "Glass Waste",
      day: "Wednesday",
      time: "9:00 AM – 11:00 AM",
      frequency: "Weekly",
      areas: ["All Areas"],
      color: "#06b6d4",
      icon: "🍶",
      notes: "Wrap broken glass in newspaper before disposal.",
    },
    {
      id: "s4",
      wasteType: "E-Waste Collection Drive",
      day: "Last Saturday of Month",
      time: "10:00 AM – 4:00 PM",
      frequency: "Monthly",
      areas: ["Andheri East Collection Point", "Bandra Kurla Complex", "Powai Tech Hub"],
      color: "#ef4444",
      icon: "📱",
      notes: "Bring phones, batteries, cables, and other electronics. Data erasure service available.",
    },
    {
      id: "s5",
      wasteType: "Bulky Waste",
      day: "Saturday",
      time: "7:00 AM – 12:00 PM",
      frequency: "Weekly",
      areas: ["All Areas – call ahead"],
      color: "#8b5cf6",
      icon: "🛋️",
      notes: "For furniture, appliances, and large items. Pre-booking required: 1800-SWACHH.",
    },
  ]);
});

export default router;
