// ─── Analytics Mock Data ─────────────────────────────────────────────────────
// Replace each export with an API fetch when the backend is ready.

// Row 1 – Summary Stats
export const SUMMARY_STATS = {
  avgResolutionTime: { value: "4.2", unit: "h",    trend: -12, trendDir: "down" as const },
  csatScore:         { value: "4.8", unit: "/ 5.0", trend: 0.4, trendDir: "up"   as const },
  slaCompliance:     { value: 78,    unit: "%",     trend: null },
};

// Row 2 – Line Chart (Complaint Volume)
export interface VolumePoint { date: string; count: number }
export const complaintVolumeData: VolumePoint[] = [
  { date: "Oct 01", count: 180 },
  { date: "Oct 05", count: 160 },
  { date: "Oct 08", count: 210 },
  { date: "Oct 12", count: 175 },
  { date: "Oct 15", count: 220 },
  { date: "Oct 18", count: 195 },
  { date: "Oct 22", count: 140 },
  { date: "Oct 25", count: 130 },
  { date: "Oct 28", count: 100 },
  { date: "Oct 30", count:  60 },
];

// Row 2 – Donut Chart (Category)
export interface CategorySlice { name: string; value: number; color: string }
export const categoryData: CategorySlice[] = [
  { name: "Billing",   value: 42, color: "#3c0089" },
  { name: "Technical", value: 28, color: "#8a4cfc" },
  { name: "Delivery",  value: 15, color: "#bd9dff" },
  { name: "Others",    value: 15, color: "#242434" },
];
export const CATEGORY_TOTAL = 1420;

// Row 3 – Bar Chart (Severity)
export interface SeverityBar { label: string; value: number; color: string }
export const severityData: SeverityBar[] = [
  { label: "Critical", value: 40, color: "#ff6e84" },
  { label: "High",     value: 70, color: "#ff97b2" },
  { label: "Medium",   value: 55, color: "#bd9dff" },
  { label: "Low",      value: 25, color: "#10b981" },
];

// Row 3 – Horizontal Bars (Sentiment)
export interface SentimentBar { label: string; emoji: string; value: number; color: string }
export const sentimentData: SentimentBar[] = [
  { label: "Angry",      emoji: "😡", value: 18, color: "#ff6e84" },
  { label: "Frustrated", emoji: "😟", value: 32, color: "#ff97b2" },
  { label: "Neutral",    emoji: "😐", value: 40, color: "#aba9b9" },
  { label: "Satisfied",  emoji: "😊", value: 10, color: "#10b981" },
];

// Row 4 – Top Issues Table
export type IssueSeverity = "Critical" | "High" | "Medium" | "Low";
export interface TopIssue {
  name:       string;
  count:      number;
  severity:   IssueSeverity;
  trendPct:   number;
  trendDir:   "up" | "down";
}
export const topIssuesData: TopIssue[] = [
  { name: "Payment Gateway Timeout",  count: 284, severity: "Critical", trendPct: 24, trendDir: "up"   },
  { name: "Slow Tracking Updates",    count: 192, severity: "Medium",   trendPct:  8, trendDir: "down" },
  { name: "Promo Code Redemption",    count: 145, severity: "High",     trendPct: 14, trendDir: "up"   },
  { name: "Subscription Sync Error",  count:  98, severity: "High",     trendPct:  5, trendDir: "down" },
  { name: "API Rate Limit Exceeded",  count:  74, severity: "Medium",   trendPct: 31, trendDir: "up"   },
];

// Row 5 – Heatmap
export const HEATMAP_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export interface HeatmapRow { category: string; values: number[] }
/** Values are 0–100 representing relative volume intensity */
export const heatmapData: HeatmapRow[] = [
  { category: "Billing",         values: [60, 40, 90, 30, 100, 10, 20] },
  { category: "Technical",       values: [30, 90, 10, 40,  60, 10, 10] },
  { category: "Delivery",        values: [10, 20, 30, 10,  40, 90, 60] },
  { category: "Product Quality", values: [20, 10, 10, 10,  30, 20, 10] },
];
