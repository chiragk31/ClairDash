import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ThreadMessage {
  id: string;
  role: "customer" | "agent";
  text: string;
  timestamp: string;
  /** Only for agent messages */
  agentName?: string;
  /** Only for agent messages */
  agentAvatarUrl?: string;
}

export interface CommunicationThreadProps {
  messages: ThreadMessage[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CustomerBubble({ message }: { message: ThreadMessage }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] bg-[#181826] p-4 rounded-2xl rounded-tl-none border border-[#474754]/5">
        <p className="text-sm text-[#e9e6f7] leading-relaxed">{message.text}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-[10px] text-[#aba9b9]">{message.timestamp}</span>
          <span
            className="material-symbols-outlined text-xs text-[#bd9dff]/60"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            done_all
          </span>
        </div>
      </div>
    </div>
  );
}

function AgentBubble({ message }: { message: ThreadMessage }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] bg-[#8a4cfc]/10 p-4 rounded-2xl rounded-tr-none border border-[#bd9dff]/20">
        <p className="text-sm text-[#e9e6f7] leading-relaxed">{message.text}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-[10px] text-[#aba9b9]">{message.timestamp}</span>
          <div className="flex items-center space-x-1">
            {message.agentAvatarUrl && (
              <Image
                src={message.agentAvatarUrl}
                alt={message.agentName ?? "Agent"}
                width={12}
                height={12}
                className="w-3 h-3 rounded-full"
              />
            )}
            <span className="text-[10px] text-[#bd9dff]">{message.agentName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CommunicationThread({
  messages,
}: CommunicationThreadProps) {
  return (
    <section className="space-y-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#aba9b9]">
        Communication History
      </h3>
      <div className="space-y-6">
        {messages.map((msg) =>
          msg.role === "customer" ? (
            <CustomerBubble key={msg.id} message={msg} />
          ) : (
            <AgentBubble key={msg.id} message={msg} />
          )
        )}
      </div>
    </section>
  );
}
