"use client";

import { useEffect, useState } from "react";

import AnalyticsStatCard from "@/components/analytics/AnalyticsStatCard";
import ChartCard from "@/components/analytics/ChartCard";
import LineChartComponent from "@/components/analytics/charts/LineChartComponent";
import DonutChartComponent from "@/components/analytics/charts/DonutChartComponent";
import BarChartComponent from "@/components/analytics/charts/BarChartComponent";
import HorizontalBarChartComponent from "@/components/analytics/charts/HorizontalBarChartComponent";
import TopIssuesTable from "@/components/analytics/TopIssuesTable";
import HeatmapGrid from "@/components/analytics/HeatmapGrid";
import DateRangePicker from "@/components/analytics/DateRangePicker";

import type {
  VolumePoint,
  CategorySlice,
  SeverityBar,
  SentimentBar,
  HeatmapRow,
} from "@/components/analytics/analyticsData";

import {
  HEATMAP_DAYS,
  heatmapData as FALLBACK_HEATMAP,
  topIssuesData as FALLBACK_ISSUES,
  complaintVolumeData as FALLBACK_VOLUME,
} from "@/components/analytics/analyticsData";

import { api } from "@/lib/api";

// ─── Category colors — consistent with mock ───────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  billing: "#3c0089",
  technical: "#8a4cfc",
  delivery: "#bd9dff",
  product_quality: "#ff97b2",
  account: "#ff6e84",
  refund: "#10b981",
  general: "#242434",
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  // Row 1 stats
  const [slaCompliance, setSlaCompliance] = useState<number>(0);

  // Row 2 charts
  const [volumeData, setVolumeData] = useState<VolumePoint[]>(FALLBACK_VOLUME);
  const [categoryData, setCategoryData] = useState<CategorySlice[]>([]);
  const [categoryTotal, setCategoryTotal] = useState(0);

  // Row 3 charts
  const [severityData, setSeverityData] = useState<SeverityBar[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentBar[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await api.getAnalytics();

        // ── SLA compliance ──────────────────────────────────────────────────
        const total = data.total ?? 0;
        const breached = data.sla_breached ?? 0;
        const compliance = total > 0
          ? Math.round(((total - breached) / total) * 100)
          : 100;
        setSlaCompliance(compliance);

        // ── Category donut ──────────────────────────────────────────────────
        const catBreakdown: Record<string, number> = data.category_breakdown ?? {};
        const catTotal = Object.values(catBreakdown).reduce((a: number, b) => a + (b as number), 0);
        setCategoryTotal(catTotal);

        const catSlices: CategorySlice[] = Object.entries(catBreakdown).map(
          ([name, count]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1).replace("_", " "),
            value: catTotal > 0 ? Math.round(((count as number) / catTotal) * 100) : 0,
            color: CATEGORY_COLORS[name] ?? "#242434",
          })
        );
        setCategoryData(catSlices);

        // ── Severity bars ───────────────────────────────────────────────────
        const sev: Record<string, number> = data.severity_distribution ?? {};
        setSeverityData([
          { label: "Critical", value: sev.critical ?? 0, color: "#ff6e84" },
          { label: "High", value: sev.high ?? 0, color: "#ff97b2" },
          { label: "Medium", value: sev.medium ?? 0, color: "#bd9dff" },
          { label: "Low", value: sev.low ?? 0, color: "#10b981" },
        ]);

        // ── Sentiment bars ──────────────────────────────────────────────────
        const sent: Record<string, number> = data.sentiment_analysis ?? {};
        setSentimentData([
          { label: "Angry", emoji: "😡", value: sent.angry ?? 0, color: "#ff6e84" },
          { label: "Negative", emoji: "😟", value: sent.negative ?? 0, color: "#ff97b2" },
          { label: "Neutral", emoji: "😐", value: sent.neutral ?? 0, color: "#aba9b9" },
          { label: "Positive", emoji: "😊", value: sent.positive ?? 0, color: "#10b981" },
        ]);

      } catch (e) {
        console.error("Analytics fetch failed:", e);
        // All charts fall back to mock data shapes — page never breaks
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <main className="p-8 space-y-10 max-w-[1600px] mx-auto w-full">

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-[#e9e6f7] mb-1">
            Analytics &amp; Insights
          </h1>
          <p className="text-[#aba9b9] text-sm">
            Real-time performance metrics and trend analysis
          </p>
        </div>

        <div className="flex items-center gap-4">
          <DateRangePicker label="Last 30 Days" />
          <button
            id="export-report-btn"
            className="bg-gradient-to-br from-[#8a4cfc] to-[#bd9dff] text-[#3c0089] font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-[#bd9dff]/10 active:scale-95 transition-transform flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </div>
      </header>

      {/* ── Row 1: Summary Stats ─────────────────────────────────────────────── */}
      <section aria-label="Summary statistics" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsStatCard
          icon="schedule"
          iconColor="text-[#bd9dff]"
          glowColor="#bd9dff"
          label="Average Resolution Time"
          value="—"
          unit="h"
          trend={null}
          trendDir="down"
        />
        <AnalyticsStatCard
          icon="mood"
          iconColor="text-[#ff97b2]"
          glowColor="#ff97b2"
          label="CSAT Score"
          value="—"
          unit="/ 5.0"
          trend={null}
          trendDir="up"
        />
        <AnalyticsStatCard
          icon="verified"
          iconColor="text-[#bd9dff]"
          glowColor="#bd9dff"
          label="SLA Compliance"
          value={loading ? "—" : slaCompliance}
          unit="%"
          ringPercent={slaCompliance}
        />
      </section>

      {/* ── Row 2: Line + Donut ───────────────────────────────────────────────── */}
      <section aria-label="Key trends" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Complaint Volume Over Time" actionIcon="more_horiz" height="h-[400px]">
          <LineChartComponent data={volumeData} color="#8a4cfc" />
        </ChartCard>

        <ChartCard title="Complaints by Category" actionIcon="filter_list" height="h-[400px]">
          <div className="flex h-full items-center">
            <div className="w-1/2 h-full">
              <DonutChartComponent
                data={categoryData.length > 0 ? categoryData : [{ name: "No data", value: 100, color: "#242434" }]}
                centerValue={categoryTotal > 0 ? categoryTotal.toLocaleString() : "0"}
                centerLabel="Total"
                innerRadius={72}
                outerRadius={100}
              />
            </div>
            <div className="w-1/2 space-y-4 pl-6">
              {categoryData.map((slice) => (
                <div key={slice.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="text-[#e9e6f7]">{slice.name}</span>
                  </div>
                  <span className="font-bold text-[#e9e6f7]">{slice.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </section>

      {/* ── Row 3: Bar + Horizontal Bars ─────────────────────────────────────── */}
      <section aria-label="Distribution analysis" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Severity Distribution" height="h-[360px]">
          <BarChartComponent
            data={severityData.length > 0 ? severityData : [
              { label: "Critical", value: 0, color: "#ff6e84" },
              { label: "High", value: 0, color: "#ff97b2" },
              { label: "Medium", value: 0, color: "#bd9dff" },
              { label: "Low", value: 0, color: "#10b981" },
            ]}
          />
        </ChartCard>

        <ChartCard title="Sentiment Analysis" height="h-[360px]">
          <HorizontalBarChartComponent
            data={sentimentData.length > 0 ? sentimentData : [
              { label: "Angry", emoji: "😡", value: 0, color: "#ff6e84" },
              { label: "Negative", emoji: "😟", value: 0, color: "#ff97b2" },
              { label: "Neutral", emoji: "😐", value: 0, color: "#aba9b9" },
              { label: "Positive", emoji: "😊", value: 0, color: "#10b981" },
            ]}
          />
        </ChartCard>
      </section>

      {/* ── Row 4: Top Issues Table ───────────────────────────────────────────── */}
      <section aria-label="Top issues">
        <TopIssuesTable issues={FALLBACK_ISSUES} />
      </section>

      {/* ── Row 5: Heatmap ───────────────────────────────────────────────────── */}
      <section aria-label="Root cause heatmap">
        <HeatmapGrid rows={FALLBACK_HEATMAP} days={HEATMAP_DAYS} />
      </section>

    </main>
  );
}