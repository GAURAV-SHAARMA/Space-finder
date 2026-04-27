export const accessibilityDistribution = [
  { range: "90-100", count: 12, label: "Excellent" },
  { range: "75-89", count: 28, label: "Good" },
  { range: "60-74", count: 19, label: "Moderate" },
  { range: "45-59", count: 11, label: "Poor" },
  { range: "0-44", count: 5, label: "Critical" },
];

export const detectionAccuracy = [
  { month: "Oct", accuracy: 78 },
  { month: "Nov", accuracy: 82 },
  { month: "Dec", accuracy: 85 },
  { month: "Jan", accuracy: 87 },
  { month: "Feb", accuracy: 90 },
  { month: "Mar", accuracy: 92 },
  { month: "Apr", accuracy: 94 },
];

export const userSatisfaction = [
  { category: "Navigation", score: 88 },
  { category: "Accuracy", score: 91 },
  { category: "UI/UX", score: 85 },
  { category: "Speed", score: 79 },
  { category: "Accessibility", score: 93 },
];

export const routeComfortIndex = [
  { zone: "Zone A", index: 87 },
  { zone: "Zone B", index: 74 },
  { zone: "Zone C", index: 91 },
  { zone: "Zone D", index: 68 },
  { zone: "Zone E", index: 82 },
  { zone: "Zone F", index: 95 },
];

export const researchDatasets = [
  { id: 1, location: "Central Delhi", totalSpaces: 47, accessible: 38, avgScore: 84.2, coverage: "92%" },
  { id: 2, location: "South Delhi", totalSpaces: 63, accessible: 51, avgScore: 81.7, coverage: "88%" },
  { id: 3, location: "North Delhi", totalSpaces: 35, accessible: 24, avgScore: 72.4, coverage: "79%" },
  { id: 4, location: "East Delhi", totalSpaces: 29, accessible: 18, avgScore: 68.9, coverage: "71%" },
  { id: 5, location: "West Delhi", totalSpaces: 41, accessible: 33, avgScore: 79.3, coverage: "85%" },
  { id: 6, location: "Gurugram", totalSpaces: 52, accessible: 46, avgScore: 88.6, coverage: "94%" },
  { id: 7, location: "Noida", totalSpaces: 38, accessible: 30, avgScore: 78.1, coverage: "82%" },
];

export const statsCards = [
  { label: "Total Rest Spaces Mapped", value: "305", icon: "📍", change: "+12 this month" },
  { label: "Average Accessibility Score", value: "79.6", icon: "♿", change: "+2.3 pts" },
  { label: "AI Detection Accuracy", value: "94%", icon: "🤖", change: "+6% vs baseline" },
  { label: "Active Users", value: "1,247", icon: "👥", change: "+89 this week" },
];
