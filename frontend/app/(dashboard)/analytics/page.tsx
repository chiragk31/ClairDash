"use client";

// ─── Analytics page ───────────────────────────────────────────────────────────
// Layout: Sidebar + Topbar are provided by the (dashboard) layout — not included here.

import AnalyticsStatCard           from "@/components/analytics/AnalyticsStatCard";
import ChartCard                   from "@/components/analytics/ChartCard";
import LineChartComponent          from "@/components/analytics/charts/LineChartComponent";
import DonutChartComponent         from "@/components/analytics/charts/DonutChartComponent";
import BarChartComponent           from "@/components/analytics/charts/BarChartComponent";
import HorizontalBarChartComponent from "@/components/analytics/charts/HorizontalBarChartComponent";
import TopIssuesTable              from "@/components/analytics/TopIssuesTable";
import HeatmapGrid                 from "@/components/analytics/HeatmapGrid";
import DateRangePicker             from "@/components/analytics/DateRangePicker";

import {
  SUMMARY_STATS,
  complaintVolumeData,
  categoryData,
  CATEGORY_TOTAL,
  severityData,
  sentimentData,
  topIssuesData,
  heatmapData,
  HEATMAP_DAYS,
} from "@/components/analytics/analyticsData";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
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
          value={SUMMARY_STATS.avgResolutionTime.value}
          unit={SUMMARY_STATS.avgResolutionTime.unit}
          trend={SUMMARY_STATS.avgResolutionTime.trend}
          trendDir={SUMMARY_STATS.avgResolutionTime.trendDir}
        />
        <AnalyticsStatCard
          icon="mood"
          iconColor="text-[#ff97b2]"
          glowColor="#ff97b2"
          label="CSAT Score"
          value={SUMMARY_STATS.csatScore.value}
          unit={SUMMARY_STATS.csatScore.unit}
          trend={SUMMARY_STATS.csatScore.trend}
          trendDir={SUMMARY_STATS.csatScore.trendDir}
        />
        <AnalyticsStatCard
          icon="verified"
          iconColor="text-[#bd9dff]"
          glowColor="#bd9dff"
          label="SLA Compliance"
          value={SUMMARY_STATS.slaCompliance.value}
          unit={SUMMARY_STATS.slaCompliance.unit}
          ringPercent={SUMMARY_STATS.slaCompliance.value as number}
        />
      </section>

      {/* ── Row 2: Line + Donut ───────────────────────────────────────────────── */}
      <section aria-label="Key trends" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Complaint Volume Over Time" actionIcon="more_horiz" height="h-[400px]">
          <LineChartComponent data={complaintVolumeData} color="#8a4cfc" />
        </ChartCard>

        <ChartCard title="Complaints by Category" actionIcon="filter_list" height="h-[400px]">
          <div className="flex h-full items-center">
            {/* Donut — left half */}
            <div className="w-1/2 h-full">
              <DonutChartComponent
                data={categoryData}
                centerValue={CATEGORY_TOTAL.toLocaleString()}
                centerLabel="Total"
                innerRadius={72}
                outerRadius={100}
              />
            </div>

            {/* Legend — right half */}
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
          <BarChartComponent data={severityData} />
        </ChartCard>

        <ChartCard title="Sentiment Analysis" height="h-[360px]">
          <HorizontalBarChartComponent data={sentimentData} />
        </ChartCard>
      </section>

      {/* ── Row 4: Top Issues Table ───────────────────────────────────────────── */}
      <section aria-label="Top issues">
        <TopIssuesTable issues={topIssuesData} />
      </section>

      {/* ── Row 5: Heatmap ───────────────────────────────────────────────────── */}
      <section aria-label="Root cause heatmap">
        <HeatmapGrid rows={heatmapData} days={HEATMAP_DAYS} />
      </section>

    </main>
  );
}
