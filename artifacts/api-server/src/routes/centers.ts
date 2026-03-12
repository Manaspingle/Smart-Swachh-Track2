import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/", (_req, res) => {
  res.json([
    {
      id: "c1",
      name: "Andheri Recycling Hub",
      address: "Andheri Station Road, Opposite HDFC Bank, Andheri East",
      city: "Mumbai",
      latitude: 19.1136,
      longitude: 72.8697,
      acceptedTypes: ["plastic", "paper", "metal", "glass"],
      timings: "Mon–Sat: 8 AM – 6 PM",
      phone: "+91 22-2682-1234",
      distance: "1.2 km",
    },
    {
      id: "c2",
      name: "Bandra E-Waste Center",
      address: "Hill Road, Near St. Andrew's Church, Bandra West",
      city: "Mumbai",
      latitude: 19.0596,
      longitude: 72.8295,
      acceptedTypes: ["ewaste", "battery", "plastic"],
      timings: "Mon–Fri: 9 AM – 5 PM",
      phone: "+91 22-2640-5678",
      distance: "3.4 km",
    },
    {
      id: "c3",
      name: "Juhu Green Facility",
      address: "JVPD Scheme, Vile Parle West",
      city: "Mumbai",
      latitude: 19.1075,
      longitude: 72.8263,
      acceptedTypes: ["organic", "plastic", "paper", "glass", "metal"],
      timings: "Daily: 7 AM – 7 PM",
      phone: "+91 22-2613-9012",
      distance: "2.8 km",
    },
    {
      id: "c4",
      name: "Dharavi Composting Center",
      address: "90 Feet Road, Dharavi",
      city: "Mumbai",
      latitude: 19.043,
      longitude: 72.852,
      acceptedTypes: ["organic", "paper"],
      timings: "Mon–Sat: 6 AM – 4 PM",
      phone: "+91 22-2407-3456",
      distance: "8.1 km",
    },
    {
      id: "c5",
      name: "Powai High-Tech Recycling",
      address: "Hiranandani Gardens, Powai",
      city: "Mumbai",
      latitude: 19.1197,
      longitude: 72.9053,
      acceptedTypes: ["ewaste", "metal", "glass", "plastic"],
      timings: "Mon–Sat: 9 AM – 6 PM",
      phone: "+91 22-2577-7890",
      distance: "5.5 km",
    },
  ]);
});

export default router;
