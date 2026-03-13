import { weddingConfig } from "@/config/wedding"

export default function Page() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(165deg, #f8f5f0 0%, #f2ede5 40%, #efe9df 70%, #f4efe7 100%)" }}
    >
      <div className="max-w-sm text-center">
        <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="mx-auto mb-6" aria-hidden="true">
          <path d="M0 10 Q10 0 20 10 Q30 20 40 10" stroke="rgba(200,169,110,0.5)" strokeWidth="1" fill="none" />
        </svg>

        <h1 className="font-script text-4xl" style={{ color: "#2a2a2a" }}>
          {weddingConfig.couple.coupleNames.en}
        </h1>

        <p className="font-serif text-sm tracking-[0.2em] uppercase mt-4" style={{ color: "#999" }}>
          {weddingConfig.date.display.en}
        </p>

        <div className="w-16 h-px mx-auto mt-6 mb-6" style={{ background: "rgba(200,169,110,0.4)" }} />

        <p className="font-serif text-base leading-relaxed" style={{ color: "#666" }}>
          Please use the personalized invitation link you received to view your invite.
        </p>

        <p className="font-arabic text-base leading-relaxed mt-3" style={{ color: "#666" }} dir="rtl">
          يرجى استخدام رابط الدعوة الشخصي الذي تلقيته لعرض دعوتك.
        </p>
      </div>
    </div>
  )
}
