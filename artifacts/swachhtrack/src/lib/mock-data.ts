import { 
  CitizenDashboard, 
  MunicipalAnalytics, 
  WasteEntry, 
  EcoChallenge, 
  PickupSchedule, 
  RecyclingCenter,
  LeaderboardEntry,
  WasteReport,
  EnvironmentalImpact
} from '@workspace/api-client-react';

export const MOCK_CITIZEN_DASHBOARD: CitizenDashboard = {
  totalPoints: 850,
  itemsSegregated: 124,
  ecoScore: 92,
  rank: 45,
  weeklyActivity: [
    { date: 'Mon', points: 20, items: 3 },
    { date: 'Tue', points: 45, items: 6 },
    { date: 'Wed', points: 15, items: 2 },
    { date: 'Thu', points: 60, items: 8 },
    { date: 'Fri', points: 30, items: 4 },
    { date: 'Sat', points: 80, items: 10 },
    { date: 'Sun', points: 50, items: 7 },
  ],
  categoryBreakdown: [
    { category: 'Plastic', count: 45, color: 'var(--chart-2)' },
    { category: 'Organic', count: 35, color: 'var(--chart-1)' },
    { category: 'Metal', count: 15, color: 'var(--chart-3)' },
    { category: 'Glass', count: 10, color: 'var(--chart-4)' },
    { category: 'E-waste', count: 5, color: 'var(--chart-5)' },
  ],
  recentActivity: [
    { id: '1', userId: 'user', category: 'Plastic', itemName: 'Water Bottle', pointsEarned: 10, verifiedAt: new Date().toISOString(), date: 'Today' },
    { id: '2', userId: 'user', category: 'Organic', itemName: 'Vegetable Peels', pointsEarned: 5, verifiedAt: new Date(Date.now() - 86400000).toISOString(), date: 'Yesterday' },
    { id: '3', userId: 'user', category: 'E-waste', itemName: 'Old Batteries', pointsEarned: 50, verifiedAt: new Date(Date.now() - 172800000).toISOString(), date: '2 days ago' },
  ]
};

export const MOCK_CHALLENGES: EcoChallenge[] = [
  { id: 'c1', title: 'Plastic Free Day', description: 'Segregate at least 3 plastic items today.', points: 50, category: 'plastic', difficulty: 'easy', completed: false, deadline: 'Tonight, 11:59 PM' },
  { id: 'c2', title: 'E-Waste Drive', description: 'Drop off 1 electronic item at a verified center.', points: 200, category: 'ewaste', difficulty: 'hard', completed: false, deadline: 'Sunday, 5:00 PM' },
  { id: 'c3', title: 'Composting Starter', description: 'Log your first organic waste of the week.', points: 30, category: 'organic', difficulty: 'easy', completed: true, deadline: 'Tomorrow' },
];

export const MOCK_MUNICIPAL: MunicipalAnalytics = {
  totalWasteCollected: 14500,
  segregationRate: 68.5,
  activeUsers: 45200,
  totalReports: 124,
  areaWiseData: [
    { area: 'Andheri West', segregationRate: 75, totalWaste: 2100, compliance: 'high' },
    { area: 'Bandra', segregationRate: 82, totalWaste: 1800, compliance: 'high' },
    { area: 'Dharavi', segregationRate: 45, totalWaste: 3500, compliance: 'low' },
    { area: 'Juhu', segregationRate: 88, totalWaste: 1200, compliance: 'high' },
    { area: 'Kurla', segregationRate: 52, totalWaste: 2800, compliance: 'medium' },
    { area: 'Powai', segregationRate: 71, totalWaste: 1900, compliance: 'high' },
    { area: 'Colaba', segregationRate: 65, totalWaste: 1200, compliance: 'medium' },
  ],
  wasteTypeDistribution: [
    { category: 'Organic', percentage: 45, amount: 6525 },
    { category: 'Plastic', percentage: 25, amount: 3625 },
    { category: 'Paper', percentage: 15, amount: 2175 },
    { category: 'Metal & Glass', percentage: 10, amount: 1450 },
    { category: 'E-Waste', percentage: 5, amount: 725 },
  ],
  weeklyTrend: [
    { day: 'Mon', organic: 120, plastic: 80, metal: 30, glass: 20, ewaste: 5 },
    { day: 'Tue', organic: 130, plastic: 75, metal: 25, glass: 15, ewaste: 8 },
    { day: 'Wed', organic: 110, plastic: 85, metal: 35, glass: 25, ewaste: 10 },
    { day: 'Thu', organic: 140, plastic: 90, metal: 40, glass: 30, ewaste: 12 },
    { day: 'Fri', organic: 150, plastic: 95, metal: 45, glass: 35, ewaste: 15 },
    { day: 'Sat', organic: 160, plastic: 100, metal: 50, glass: 40, ewaste: 20 },
    { day: 'Sun', organic: 170, plastic: 110, metal: 55, glass: 45, ewaste: 25 },
  ],
  topCommunities: [
    { name: 'Green View Apts', area: 'Bandra', score: 98, members: 450, rank: 1 },
    { name: 'Eco Heights', area: 'Andheri', score: 95, members: 320, rank: 2 },
    { name: 'Sunset Towers', area: 'Juhu', score: 92, members: 280, rank: 3 },
    { name: 'Lakeview Enclave', area: 'Powai', score: 89, members: 510, rank: 4 },
  ]
};

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'u1', name: 'Rohan D.', city: 'Mumbai', greenPoints: 3450, level: 'Zero Waste Warrior', itemsRecycled: 512 },
  { rank: 2, userId: 'u2', name: 'Aisha K.', city: 'Mumbai', greenPoints: 3120, level: 'Zero Waste Warrior', itemsRecycled: 480 },
  { rank: 3, userId: 'u3', name: 'Vikram M.', city: 'Mumbai', greenPoints: 2890, level: 'Sustainability Hero', itemsRecycled: 410 },
  { rank: 4, userId: 'u4', name: 'Neha S.', city: 'Mumbai', greenPoints: 2500, level: 'Sustainability Hero', itemsRecycled: 380 },
  { rank: 5, userId: 'u5', name: 'Priya Sharma (You)', city: 'Mumbai', greenPoints: 850, level: 'Recycling Champion', itemsRecycled: 124 },
];

export const MOCK_SCHEDULE: PickupSchedule[] = [
  { id: '1', wasteType: 'Organic Waste', day: 'Daily', time: '07:00 AM - 09:00 AM', frequency: 'Everyday', areas: ['All Areas'], color: 'bg-green-100 border-green-500 text-green-700', icon: 'Leaf' },
  { id: '2', wasteType: 'Dry/Recyclable', day: 'Mon, Wed, Fri', time: '10:00 AM - 12:00 PM', frequency: '3 times/week', areas: ['Andheri', 'Bandra', 'Juhu'], color: 'bg-blue-100 border-blue-500 text-blue-700', icon: 'Recycle' },
  { id: '3', wasteType: 'E-Waste Drive', day: '1st Sunday of Month', time: '09:00 AM - 02:00 PM', frequency: 'Monthly', areas: ['Collection Centers'], color: 'bg-red-100 border-red-500 text-red-700', icon: 'Battery' },
  { id: '4', wasteType: 'Hazardous Waste', day: 'Sat', time: '11:00 AM - 01:00 PM', frequency: 'Weekly', areas: ['All Areas'], color: 'bg-orange-100 border-orange-500 text-orange-700', icon: 'AlertTriangle' },
];

export const MOCK_CENTERS: RecyclingCenter[] = [
  { id: '1', name: 'Green Earth Recycling', address: 'Plot 45, MIDC, Andheri East', city: 'Mumbai', latitude: 19.11, longitude: 72.88, acceptedTypes: ['Plastic', 'Paper', 'Glass'], timings: '09:00 AM - 06:00 PM', phone: '+91 22 1234 5678', distance: '2.4 km' },
  { id: '2', name: 'EcoSolve E-Waste', address: 'Shop 12, Link Road, Malad', city: 'Mumbai', latitude: 19.18, longitude: 72.83, acceptedTypes: ['E-waste', 'Batteries'], timings: '10:00 AM - 05:00 PM (Closed Sun)', phone: '+91 22 8765 4321', distance: '5.1 km' },
  { id: '3', name: 'Metal Scrap Yard', address: 'Dharavi Main Road', city: 'Mumbai', latitude: 19.04, longitude: 72.85, acceptedTypes: ['Metal', 'Aluminium'], timings: '08:00 AM - 08:00 PM', phone: '+91 98 7654 3210', distance: '8.7 km' },
];

export const MOCK_REPORTS: WasteReport[] = [
  { id: 'r1', location: 'Juhu Beach Entrance', description: 'Overflowing dustbin, plastic scattered around.', status: 'pending', submittedAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'r2', location: 'Andheri West Market', description: 'Garbage dump not cleared for 2 days.', status: 'in_progress', submittedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'r3', location: 'Linking Road', description: 'Broken bin near bus stop.', status: 'resolved', submittedAt: new Date(Date.now() - 259200000).toISOString(), resolvedAt: new Date(Date.now() - 86400000).toISOString() },
];

export const MOCK_IMPACT: EnvironmentalImpact = {
  wasteDiverted: 124.5,
  plasticRecycled: 32.8,
  co2Reduced: 156.2,
  treesEquivalent: 7,
  waterSaved: 1250,
  energySaved: 450
};
