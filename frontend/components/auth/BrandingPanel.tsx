// ─── BrandingPanel ────────────────────────────────────────────────────────────
// Left half of the login split-screen.

const FEATURES = [
  {
    icon: "psychology",
    title: "AI-Powered Analysis",
    desc: "Deep linguistic processing to identify root causes and sentiment shifts instantly.",
  },
  {
    icon: "alarm",
    title: "Real-time SLA Tracking",
    desc: "Live monitoring of response times with predictive escalation alerts.",
  },
  {
    icon: "group",
    title: "360° Customer View",
    desc: "Synchronized history across all channels for a frictionless resolution journey.",
  },
] as const;

export default function BrandingPanel() {
  return (
    <section className="relative w-full md:w-1/2 flex flex-col justify-center items-center p-12 overflow-hidden bg-[#0d0d18]">
      {/* Abstract dot-grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #3c0089 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Purple glow blob */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#8a4cfc] opacity-10 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-md w-full space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tighter text-[#e9e6f7]">ClairDash</h1>
          <p className="text-xl text-[#aba9b9] font-medium tracking-tight">
            Unified Customer Complaint Intelligence
          </p>
        </div>

        <div className="space-y-8">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="bg-[#1e1e2d] p-3 rounded-xl shrink-0">
                <span className="material-symbols-outlined text-[#b28cff]">{icon}</span>
              </div>
              <div>
                <h3 className="text-[#e9e6f7] font-semibold text-lg">{title}</h3>
                <p className="text-[#aba9b9] text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
