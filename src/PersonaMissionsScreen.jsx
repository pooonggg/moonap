import { useState, useEffect } from "react";

// ═══════════════════════════════════════
// DESIGN TOKENS (from moonap_v3)
// ═══════════════════════════════════════
const css = `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;600;700;800;900&family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:0;display:none;}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(144,202,249,.35)}50%{box-shadow:0 0 0 8px rgba(144,202,249,0)}}
@keyframes sparkle{0%,100%{filter:drop-shadow(0 0 4px rgba(255,213,79,.2))}50%{filter:drop-shadow(0 0 16px rgba(255,213,79,.7))}}
@keyframes breatheCircle{0%,100%{transform:scale(.65);opacity:.45}50%{transform:scale(1.2);opacity:1}}
.fadeUp{animation:fadeUp .35s ease-out forwards;}`;

// Night theme (primary view for missions)
const T = {
  bg: "linear-gradient(170deg,#0D1B2A,#1B2838)",
  primary: "#90CAF9", secondary: "#004D40",
  text: "#E0E0E0", sub: "#78909C",
  card: "rgba(255,255,255,0.06)", cardB: "rgba(144,202,249,0.15)",
  nav: "rgba(13,27,42,0.98)", accent: "#FFD54F",
};

// ═══════════════════════════════════════
// PET SVG (Moonie only — simplified from v3)
// ═══════════════════════════════════════
function MoonieSVG({ size = 80, state = "happy" }) {
  const isSick = state === "sick";
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`gm_${size}_${state}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="rgba(255,217,102,0.7)" />
          <stop offset="100%" stopColor="rgba(255,217,102,0)" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="58" rx="42" ry="38" fill={`url(#gm_${size}_${state})`} />
      <path d="M58,12 C88,12 106,32 106,58 C106,84 88,104 60,104 C42,104 28,94 28,78 C28,62 44,52 58,52 C72,52 82,60 82,68 C82,76 72,82 60,82" fill={isSick ? "#9E9E9E" : "#FFD966"} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      {isSick ? (
        <>
          <path d="M43,56 Q48,53 53,56" fill="none" stroke="#3D2B1F" strokeWidth="2" strokeLinecap="round" />
          <path d="M65,56 Q70,53 75,56" fill="none" stroke="#3D2B1F" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="48" cy="58" r="5.5" fill="#2D1B00" />
          <circle cx="70" cy="58" r="5.5" fill="#2D1B00" />
          <circle cx="49.5" cy="56" r="2.2" fill="white" />
          <circle cx="71.5" cy="56" r="2.2" fill="white" />
        </>
      )}
      <circle cx="38" cy="66" r="5.5" fill={isSick ? "#90A4AE" : "#FFB3BA"} opacity={isSick ? 0.3 : 0.5} />
      <circle cx="80" cy="66" r="5.5" fill={isSick ? "#90A4AE" : "#FFB3BA"} opacity={isSick ? 0.3 : 0.5} />
      {isSick ? (
        <path d="M52,72 Q60,68 68,72" fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M50,70 Q59,78 70,70" fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
      )}
      <ellipse cx="22" cy="66" rx="8" ry="5" fill={isSick ? "#9E9E9E" : "#FFD966"} transform="rotate(-20 22 66)" />
      <ellipse cx="96" cy="66" rx="8" ry="5" fill={isSick ? "#9E9E9E" : "#FFD966"} transform="rotate(20 96 66)" />
    </svg>
  );
}

// ═══════════════════════════════════════
// SHARED UI COMPONENTS
// ═══════════════════════════════════════
function Logo({ color = "#fff", hiColor = "#CE93D8", size = 17, showMoon = false, moonBg = "#0D1B2A" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.35 }}>
      {showMoon && (
        <svg width={size * 1.4} height={size * 1.4} viewBox="0 0 110 110" style={{ flexShrink: 0, overflow: "visible" }}>
          <defs>
            <radialGradient id="lgm2" cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF4CC" />
              <stop offset="55%" stopColor="#F5C842" />
              <stop offset="100%" stopColor="#E29010" />
            </radialGradient>
          </defs>
          <circle cx="55" cy="55" r="46" fill="url(#lgm2)" />
          <circle cx="72" cy="47" r="37" fill={moonBg} />
          <path d="M32 52 Q37 47 42 52" stroke="#8B5E1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M43 48 Q48 43 53 48" stroke="#8B5E1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M33 63 Q42 70 51 63" stroke="#8B5E1A" strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="28" cy="61" rx="6" ry="3.5" fill="#F4845F" opacity="0.45" />
        </svg>
      )}
      <span style={{ fontSize: size, fontWeight: 900, fontFamily: "'Playfair Display',serif", color, letterSpacing: Math.max(size * 0.04, 1) }}>
        moo<span style={{ color: hiColor }}>nap</span>
      </span>
    </span>
  );
}

function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: T.card, backdropFilter: "blur(12px)", borderRadius: 18,
      border: `1px solid ${T.cardB}`, padding: "13px 15px",
      transition: "transform .15s", cursor: onClick ? "pointer" : "default", ...style,
    }}>{children}</div>
  );
}

function Ring({ v, max, col, icon, label }) {
  const r = 18, c = 2 * Math.PI * r, off = c - (v / max) * c;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div style={{ position: "relative", width: 42, height: 42 }}>
        <svg width="42" height="42" viewBox="0 0 42 42">
          <circle cx="21" cy="21" r={r} fill="none" stroke="rgba(128,128,128,0.12)" strokeWidth="4" />
          <circle cx="21" cy="21" r={r} fill="none" stroke={col} strokeWidth="4"
            strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
            transform="rotate(-90 21 21)" style={{ transition: "stroke-dashoffset 1s ease" }} />
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 12 }}>{icon}</div>
      </div>
      <span style={{ fontSize: 8, color: T.sub }}>{label}</span>
    </div>
  );
}

function ScoreBadge({ label, value, color, sub }) {
  return (
    <div style={{
      background: color + "12", border: `1px solid ${color}33`, borderRadius: 12,
      padding: "8px 12px", textAlign: "center", flex: 1,
    }}>
      <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 9, color: T.sub, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 8, color: color + "AA", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ═══════════════════════════════════════
// PERSONA DATA
// ═══════════════════════════════════════
const PERSONAS = {
  min: {
    name: "มิน",
    nameEn: "Min",
    age: 21,
    job: "นักศึกษา ปี 3",
    avatar: "🧑‍🎓",
    petName: "น้องมูน",
    petState: "happy",
    lifestyle: [
      "เรียนหนัก ติวสอบถึงตี 2",
      "ดื่มกาแฟเย็นทุกบ่าย",
      "เล่นมือถือบนเตียงจนหลับ",
      "นอน 5-6 ชม./คืน",
    ],
    sleepProblem: "นอนไม่หลับเพราะคิดเยอะ สมองไม่ยอมหยุดคิดเรื่องงาน/สอบ",
    // Questionnaire scores
    isi: { score: 10, label: "Subthreshold Insomnia", color: "#FFA726" },
    psqi: { score: 7, label: "คุณภาพการนอนต่ำ", color: "#FFA726" },
    hyperarousal: { type: "Cognitive Arousal", label: "สมองตื่นตัวด้านความคิดสูง", color: "#CE93D8" },
    // Pet stats
    stats: { g: 55, h: 62, m: 70, lv: 12 },
    // Daily missions — based on ISI 8-14, PSQI 5-7, Cognitive Arousal
    missions: [
      { text: "บันทึก Sleep Log ตอนเช้า", exp: 15, done: true, icon: "📝", source: "CBT-I", desc: "บันทึกเวลานอน/ตื่น เพื่อวิเคราะห์ Sleep Efficiency" },
      { text: "หลีกเลี่ยงคาเฟอีนหลัง 14:00", exp: 10, done: true, icon: "☕", source: "PSQI", desc: "คำนวณจาก half-life คาเฟอีน ~5 ชม." },
      { text: "เขียนสิ่งที่กังวล/ระบายก่อนนอน 10 นาที", exp: 20, done: false, icon: "✏️", source: "Hyperarousal", desc: "ลด Cognitive Arousal — ย้ายความคิดออกจากหัวลงกระดาษ", action: "journal" },
      { text: "ฝึก Breathing Exercise 3 นาที", exp: 10, done: false, icon: "🫁", source: "CBT-I", desc: "4-7-8 Breathing ช่วยลดการตื่นตัวของสมอง", action: "breath" },
      { text: "วางมือถือก่อนนอน 30 นาที", exp: 15, done: false, icon: "📱", source: "PSQI", desc: "ลด blue light + stimulus ที่ทำให้สมองตื่น" },
    ],
    challenge: { text: "ตั้งเวลานอนและเวลาตื่นให้คงที่ 5 วันติด", progress: [true, true, true, false, false, false, false], source: "ISI / CBT-I" },
    hiddenMissions: [
      { text: "ไม่เปิดแอป Social Media หลัง 22:00 ทั้งสัปดาห์", progress: "4/7", done: false },
      { text: "ฝึกหายใจก่อนนอน 3 คืนติดกัน", progress: "2/3", done: false },
    ],
    // CBT-I week
    cbtiWeek: 2,
    cbtiDesc: "Sleep Hygiene + Stimulus Control",
    // Summary insight
    insight: "มินนอนไม่หลับเพราะ Cognitive Arousal — สมองยังคิดเรื่องเรียน/สอบ ระบบจึงเน้นให้ 'ระบาย' ความคิดก่อนนอน และตั้งเวลานอนให้คงที่",
  },
  gun: {
    name: "กัน",
    nameEn: "Gun",
    age: 29,
    job: "Marketing Manager",
    avatar: "👨‍💼",
    petName: "มูนนี่",
    petState: "sick",
    lifestyle: [
      "ทำงานหนัก เครียดสูง ประชุมถึง 2 ทุ่ม",
      "ดื่มกาแฟ 3-4 แก้ว/วัน",
      "ตื่นกลางดึกแทบทุกคืน ใจสั่น",
      "นอน 3-4 ชม./คืน แต่อยู่บนเตียง 8+ ชม.",
    ],
    sleepProblem: "นอนหลับยาก + ตื่นกลางดึกทุกคืน ทั้งร่างกายและจิตใจตื่นตัว",
    isi: { score: 19, label: "Clinical Insomnia (Moderate)", color: "#EF5350" },
    psqi: { score: 13, label: "คุณภาพการนอนแย่มาก", color: "#EF5350" },
    hyperarousal: { type: "Mixed Hyperarousal", label: "หลายระบบตื่นตัวพร้อมกัน", color: "#FF7043" },
    stats: { g: 28, h: 32, m: 25, lv: 8 },
    missions: [
      { text: "บันทึก Sleep Log ทุกเช้า", exp: 15, done: true, icon: "📝", source: "CBT-I", desc: "ติดตาม Sleep Efficiency เพื่อคำนวณ Sleep Window" },
      { text: "จำกัดเวลาอยู่บนเตียง (Sleep Restriction)", exp: 25, done: false, icon: "🛏️", source: "CBT-I", desc: "Sleep Window: 01:00-06:00 เท่านั้น — เพิ่ม Sleep Drive", important: true },
      { text: "เริ่ม Wind-down Routine ก่อนนอน 60 นาที", exp: 20, done: false, icon: "🌙", source: "Hyperarousal", desc: "ลดทุกระบบตื่นตัว: ปิดจอ → เขียนระบาย → Meditation" },
      { text: "ฝึก Breathing + Meditation 10 นาที", exp: 15, done: false, icon: "🧘", source: "Hyperarousal", desc: "Progressive Muscle Relaxation + 4-6 Breathing", action: "breath" },
      { text: "ใช้ Relaxation Audio ก่อนนอน", exp: 10, done: false, icon: "🎧", source: "Hyperarousal", desc: "เสียงธรรมชาติช่วยลด Physiological Arousal" },
      { text: "ถ้าตื่นกลางดึก → เปิด Night Support", exp: 20, done: false, icon: "🕯️", source: "CBT-I", desc: "ถ้านอนไม่หลับ >15 นาที ให้ลุกจากเตียง (Stimulus Control)", action: "night" },
    ],
    challenge: { text: "ไม่อยู่บนเตียงนอกเวลา Sleep Window 5 วัน", progress: [true, true, false, false, false, false, false], source: "CBT-I Sleep Restriction" },
    hiddenMissions: [
      { text: "ลดคาเฟอีนเหลือ 1 แก้ว/วัน ทั้งสัปดาห์", progress: "2/7", done: false },
      { text: "ใช้ Night Support จนนอนหลับ 3 คืน", progress: "1/3", done: false },
    ],
    cbtiWeek: 4,
    cbtiDesc: "Sleep Restriction + Stimulus Control + Cognitive Therapy",
    insight: "กันมี Mixed Hyperarousal — ทั้งสมอง อารมณ์ ร่างกายตื่นตัว ISI สูง ระบบจึงเน้น Sleep Restriction เพื่อเพิ่ม Sleep Drive และ Night Support เมื่อตื่นกลางดึก",
  },
};

// ═══════════════════════════════════════
// PERSONA CARD (top section)
// ═══════════════════════════════════════
function PersonaCard({ p }) {
  return (
    <Card style={{ marginBottom: 11, padding: "16px 15px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 32 }}>{p.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: T.text }}>{p.name} <span style={{ fontSize: 11, color: T.sub, fontWeight: 400 }}>({p.nameEn}, {p.age} ปี)</span></div>
          <div style={{ fontSize: 11, color: T.sub }}>{p.job}</div>
        </div>
        <MoonieSVG size={44} state={p.petState} />
      </div>
      {/* Lifestyle tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
        {p.lifestyle.map((l, i) => (
          <span key={i} style={{
            fontSize: 9, padding: "4px 8px", borderRadius: 8,
            background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)",
            color: T.sub,
          }}>{l}</span>
        ))}
      </div>
      <div style={{ fontSize: 11, color: T.accent, fontWeight: 600, fontFamily: "'Noto Sans Thai',sans-serif", lineHeight: 1.5, padding: "8px 10px", background: "rgba(255,213,79,.04)", borderRadius: 10, border: "1px solid rgba(255,213,79,.1)" }}>
        💡 {p.sleepProblem}
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════
// QUESTIONNAIRE SCORES
// ═══════════════════════════════════════
function ScoresCard({ p }) {
  return (
    <Card style={{ marginBottom: 11 }}>
      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, fontFamily: "'Noto Sans Thai',sans-serif" }}>📊 ผลแบบสอบถาม</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <ScoreBadge label="ISI" value={p.isi.score} color={p.isi.color} sub={p.isi.label} />
        <ScoreBadge label="PSQI" value={p.psqi.score} color={p.psqi.color} sub={p.psqi.label} />
      </div>
      <div style={{
        background: p.hyperarousal.color + "10", border: `1px solid ${p.hyperarousal.color}30`,
        borderRadius: 10, padding: "8px 12px",
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: p.hyperarousal.color }}>{p.hyperarousal.type}</div>
        <div style={{ fontSize: 9, color: T.sub, marginTop: 2 }}>{p.hyperarousal.label}</div>
      </div>
      {/* Pet health rings */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.cardB}` }}>
        <Ring v={p.stats.g} max={100} col="#66BB6A" icon="🌱" label="Growth" />
        <Ring v={p.stats.h} max={100} col="#EF5350" icon="❤️" label="Health" />
        <Ring v={p.stats.m} max={100} col="#FFD700" icon="😊" label="Mood" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>Lv.{p.stats.lv}</div>
          <div style={{ fontSize: 8, color: T.sub }}>{p.petName}</div>
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════
// MISSIONS SCREEN (per persona)
// ═══════════════════════════════════════
function MissionsView({ p }) {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const doneCnt = p.missions.filter(m => m.done).length;
  const totalExp = p.missions.reduce((s, m) => s + m.exp, 0);
  const doneExp = p.missions.filter(m => m.done).reduce((s, m) => s + m.exp, 0);
  const days = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];

  return (
    <div style={{ color: T.text }}>
      {/* Daily missions */}
      <Card style={{ marginBottom: 11 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}>
          <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Noto Sans Thai',sans-serif" }}>ภารกิจวันนี้ 📋</div>
          <div style={{ fontSize: 11, color: T.primary, fontWeight: 700 }}>{doneCnt}/{p.missions.length}</div>
        </div>

        {p.missions.map((m, i) => (
          <div key={i}>
            <div
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 0",
                borderBottom: i < p.missions.length - 1 ? `1px solid ${T.cardB}` : "none",
                cursor: "pointer",
              }}>
              <div style={{
                width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                background: m.done ? "#66BB6A" : m.important ? "#EF535033" : T.cardB,
                border: m.important && !m.done ? "1.5px solid #EF5350" : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: "white",
              }}>{m.done ? "✓" : m.icon}</div>
              <div style={{ flex: 1, fontSize: 11, fontFamily: "'Noto Sans Thai',sans-serif", textDecoration: m.done ? "line-through" : "none", opacity: m.done ? .5 : 1, lineHeight: 1.4 }}>
                {m.text}
                {m.important && !m.done && <span style={{ marginLeft: 4, fontSize: 8, color: "#EF5350", fontWeight: 700, background: "#EF535015", padding: "1px 5px", borderRadius: 4 }}>สำคัญ</span>}
              </div>
              <div style={{ fontSize: 10, color: "#66BB6A", fontWeight: 700, flexShrink: 0 }}>+{m.exp}</div>
              {m.action && !m.done && <div style={{ background: T.primary, color: "#0D1B2A", borderRadius: 10, padding: "3px 8px", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>เริ่ม →</div>}
              <span style={{ fontSize: 10, color: T.sub, flexShrink: 0 }}>{expandedIdx === i ? "▾" : "›"}</span>
            </div>
            {/* Expanded detail */}
            {expandedIdx === i && (
              <div className="fadeUp" style={{
                padding: "8px 10px", marginBottom: 4, marginLeft: 32,
                background: "rgba(255,255,255,.02)", borderRadius: 10,
                border: `1px solid ${T.cardB}`, fontSize: 10, lineHeight: 1.6,
              }}>
                <div style={{ color: T.text, fontFamily: "'Noto Sans Thai',sans-serif" }}>{m.desc}</div>
                <div style={{ marginTop: 4, display: "flex", gap: 6 }}>
                  <span style={{
                    fontSize: 8, padding: "2px 6px", borderRadius: 6,
                    background: m.source === "CBT-I" ? "#CE93D815" : m.source === "Hyperarousal" ? "#FF704315" : "#FFA72615",
                    color: m.source === "CBT-I" ? "#CE93D8" : m.source === "Hyperarousal" ? "#FF7043" : "#FFA726",
                    fontWeight: 700,
                  }}>จาก: {m.source}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* EXP bar */}
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 10, color: T.sub, marginBottom: 4 }}>{doneExp} / {totalExp} EXP วันนี้</div>
          <div style={{ background: T.cardB, borderRadius: 10, height: 7, overflow: "hidden" }}>
            <div style={{ width: `${(doneExp / totalExp) * 100}%`, height: "100%", background: T.primary, borderRadius: 10, transition: "width .5s ease" }} />
          </div>
        </div>
      </Card>

      {/* Weekly challenge */}
      <Card style={{ marginBottom: 11, borderColor: "#FFD70055" }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 5, fontFamily: "'Noto Sans Thai',sans-serif" }}>🏆 Challenge สัปดาห์นี้</div>
        <div style={{ fontSize: 11, marginBottom: 4, fontFamily: "'Noto Sans Thai',sans-serif" }}>{p.challenge.text}</div>
        <div style={{ fontSize: 8, color: T.sub, marginBottom: 8 }}>หลักการ: {p.challenge.source}</div>
        <div style={{ display: "flex", gap: 5 }}>
          {days.map((d, i) => (
            <div key={i} style={{
              flex: 1, textAlign: "center", fontSize: 9, padding: "5px 1px", borderRadius: 7,
              background: p.challenge.progress[i] ? "#4CAF5044" : T.cardB,
              fontWeight: p.challenge.progress[i] ? 700 : 400,
              color: p.challenge.progress[i] ? "#66BB6A" : T.sub,
            }}>{d}{p.challenge.progress[i] ? "✓" : ""}</div>
          ))}
        </div>
      </Card>

      {/* Hidden missions */}
      <Card style={{ marginBottom: 11 }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, fontFamily: "'Noto Sans Thai',sans-serif" }}>🔮 ภารกิจซ่อน — {p.hiddenMissions.filter(h => h.done).length}/{p.hiddenMissions.length + 3}</div>
        {p.hiddenMissions.map((h, i) => (
          <div key={i} style={{
            padding: "6px 0", fontSize: 11, fontFamily: "'Noto Sans Thai',sans-serif",
            display: "flex", justifyContent: "space-between",
            borderTop: i > 0 ? `1px solid ${T.cardB}` : "none",
          }}>
            <span>⭐ {h.text}</span>
            <span style={{ color: "#FFB74D", fontWeight: 700, fontSize: 10 }}>{h.progress}</span>
          </div>
        ))}
        {[1, 2, 3].map(i => <div key={i} style={{ padding: "6px 0", fontSize: 11, color: T.sub, opacity: .35, borderTop: `1px solid ${T.cardB}` }}>🔒 ???</div>)}
      </Card>

      {/* CBT-I progress */}
      <Card style={{ marginBottom: 11 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🧠</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Noto Sans Thai',sans-serif" }}>โปรแกรม CBT-I 6 สัปดาห์</div>
            <div style={{ fontSize: 10, color: T.sub }}>สัปดาห์ {p.cbtiWeek}/6 — {p.cbtiDesc}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          {[1, 2, 3, 4, 5, 6].map(w => (
            <div key={w} style={{
              flex: 1, height: 6, borderRadius: 3,
              background: w <= p.cbtiWeek ? "#CE93D8" : T.cardB,
              transition: "background .3s",
            }} />
          ))}
        </div>
      </Card>

      {/* AI Insight */}
      <div style={{
        background: "linear-gradient(135deg, rgba(144,202,249,.06), rgba(206,147,216,.06))",
        borderRadius: 14, padding: "12px 14px", border: `1px solid ${T.primary}22`,
        marginBottom: 11,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.primary, marginBottom: 4 }}>🤖 AI Insight — ทำไม {p.name} ได้ภารกิจเหล่านี้</div>
        <div style={{ fontSize: 10, color: T.sub, lineHeight: 1.6, fontFamily: "'Noto Sans Thai',sans-serif" }}>{p.insight}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// PHONE FRAME
// ═══════════════════════════════════════
function PhoneFrame({ persona, label }) {
  const p = PERSONAS[persona];
  const [view, setView] = useState("missions"); // "persona" | "missions"
  const now = "22:47";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Label */}
      <div style={{ marginBottom: 8, textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{p.avatar} {p.name} ({p.nameEn})</div>
        <div style={{ fontSize: 10, color: T.sub }}>{p.job} · {p.age} ปี</div>
        <div style={{
          marginTop: 4, fontSize: 9, display: "inline-flex", gap: 6,
        }}>
          <span style={{ padding: "2px 7px", borderRadius: 6, background: p.isi.color + "20", color: p.isi.color, fontWeight: 700 }}>ISI: {p.isi.score}</span>
          <span style={{ padding: "2px 7px", borderRadius: 6, background: p.psqi.color + "20", color: p.psqi.color, fontWeight: 700 }}>PSQI: {p.psqi.score}</span>
          <span style={{ padding: "2px 7px", borderRadius: 6, background: p.hyperarousal.color + "20", color: p.hyperarousal.color, fontWeight: 700 }}>{p.hyperarousal.type}</span>
        </div>
      </div>
      {/* Phone */}
      <div style={{
        width: 370, maxWidth: "100%", height: 780,
        borderRadius: 44, border: "9px solid #232337",
        overflow: "hidden", position: "relative",
        background: T.bg, display: "flex", flexDirection: "column",
        boxShadow: "0 28px 70px rgba(0,0,0,.7)",
      }}>
        {/* Notch */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 110, height: 30, background: "#1a1a2e", borderRadius: "0 0 18px 18px", zIndex: 20 }} />
        {/* Status bar */}
        <div style={{ padding: "34px 18px 4px", display: "flex", justifyContent: "space-between", alignItems: "center", color: T.text }}>
          <div style={{ fontSize: 11, fontWeight: 700 }}>{now}</div>
          <div style={{ fontSize: 10, display: "flex", gap: 5, alignItems: "center" }}><span>▪▪▪</span><span>WiFi</span><span>▮</span></div>
        </div>
        {/* App header */}
        <div style={{ padding: "4px 18px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo color={T.text} hiColor={T.primary} size={17} showMoon={true} moonBg="#0D1B2A" />
          <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: T.sub }}>🌙 {now}</span>
            <span style={{ fontSize: 17 }}>🔔</span>
          </div>
        </div>
        {/* View Toggle */}
        <div style={{ padding: "0 18px 6px", display: "flex", gap: 6 }}>
          {[{ id: "persona", l: "👤 Persona" }, { id: "missions", l: "🎯 Missions" }].map(v => (
            <div key={v.id} onClick={() => setView(v.id)} style={{
              flex: 1, padding: "6px 0", borderRadius: 10, textAlign: "center",
              fontSize: 11, fontWeight: view === v.id ? 700 : 400, cursor: "pointer",
              background: view === v.id ? T.primary + "22" : "transparent",
              color: view === v.id ? T.primary : T.sub,
              border: `1px solid ${view === v.id ? T.primary + "44" : "transparent"}`,
              transition: "all .2s",
            }}>{v.l}</div>
          ))}
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "4px 15px 14px" }}>
          {view === "persona" ? (
            <>
              <PersonaCard p={p} />
              <ScoresCard p={p} />
            </>
          ) : (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, fontFamily: "'Noto Sans Thai',sans-serif", color: T.text }}>ภารกิจประจำวัน 🎯</div>
              <div style={{ fontSize: 11, color: T.sub, marginBottom: 12, fontFamily: "'Noto Sans Thai',sans-serif" }}>ปรับตามผลแบบสอบถาม ISI / PSQI / Hyperarousal</div>
              <MissionsView p={p} />
            </>
          )}
        </div>
        {/* Nav bar */}
        <div style={{
          display: "flex", background: T.nav, backdropFilter: "blur(18px)",
          borderTop: `1px solid ${T.cardB}`, paddingBottom: 6,
        }}>
          {[{ icon: "🏠", label: "Home" }, { icon: "📊", label: "Dashboard" }, { icon: "🛠", label: "Tools" }, { icon: "🎯", label: "Missions", active: true }, { icon: "👤", label: "Profile" }].map((tb, i) => (
            <div key={i} style={{
              flex: 1, padding: "7px 3px 3px", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 2, position: "relative",
            }}>
              {tb.active && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 26, height: 3, background: T.primary, borderRadius: 3 }} />}
              <span style={{ fontSize: 19, opacity: tb.active ? 1 : .35 }}>{tb.icon}</span>
              <span style={{ fontSize: 9, color: tb.active ? T.primary : T.sub, fontWeight: tb.active ? 700 : 400 }}>{tb.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// COMPARISON TABLE
// ═══════════════════════════════════════
function ComparisonSection() {
  const rows = [
    { label: "ISI Score", min: "10 (Subthreshold)", gun: "19 (Moderate Clinical)", icon: "📋" },
    { label: "PSQI Score", min: "7 (คุณภาพต่ำ)", gun: "13 (คุณภาพแย่มาก)", icon: "📊" },
    { label: "Hyperarousal", min: "Cognitive", gun: "Mixed", icon: "🧠" },
    { label: "CBT-I สัปดาห์", min: "2/6", gun: "4/6", icon: "🔬" },
    { label: "Sleep Restriction", min: "ยังไม่ใช้", gun: "ใช้ (01:00-06:00)", icon: "🛏️" },
    { label: "Night Support", min: "ไม่จำเป็น", gun: "จำเป็นมาก", icon: "🕯️" },
    { label: "เป้าหมายหลัก", min: "ลด Cognitive Arousal\nตั้งเวลานอนให้คงที่", gun: "เพิ่ม Sleep Drive\nลด Mixed Arousal\nจำกัดเวลาบนเตียง", icon: "🎯" },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto 20px", padding: "0 12px" }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 12 }}>
        📊 เปรียบเทียบ Persona
      </div>
      <div style={{ background: "rgba(255,255,255,.04)", borderRadius: 18, border: "1px solid rgba(255,255,255,.08)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", background: "rgba(255,255,255,.06)", padding: "10px 14px" }}>
          <div style={{ flex: 2, fontSize: 10, color: T.sub, fontWeight: 700 }}>หัวข้อ</div>
          <div style={{ flex: 3, fontSize: 10, color: "#FFA726", fontWeight: 700, textAlign: "center" }}>🧑‍🎓 มิน (Mild)</div>
          <div style={{ flex: 3, fontSize: 10, color: "#EF5350", fontWeight: 700, textAlign: "center" }}>👨‍💼 กัน (Severe)</div>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: "flex", padding: "8px 14px", alignItems: "center",
            borderTop: `1px solid ${T.cardB}`,
          }}>
            <div style={{ flex: 2, fontSize: 10, color: T.text, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              <span>{r.icon}</span> {r.label}
            </div>
            <div style={{ flex: 3, fontSize: 10, color: T.sub, textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.5 }}>{r.min}</div>
            <div style={{ flex: 3, fontSize: 10, color: T.sub, textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.5 }}>{r.gun}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════
export default function PersonaMissionsScreen() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg,#0D1B2A,#1B2838)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "20px 12px 40px",
      fontFamily: "'DM Sans','Noto Sans Thai',sans-serif",
    }}>
      <style>{css}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Logo color="#fff" hiColor="#CE93D8" size={28} showMoon={true} moonBg="#0D1B2A" />
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 4, fontStyle: "italic" }}>Rest Tonight. Shine Tomorrow.</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginTop: 16 }}>
          🧑‍🎓 × 👨‍💼 Persona & Missions Comparison
        </div>
        <div style={{ fontSize: 11, color: T.sub, marginTop: 6, maxWidth: 600, lineHeight: 1.6 }}>
          2 ผู้ใช้ที่มีปัญหาการนอนและชีวิตต่างกัน → แอปสร้างภารกิจประจำวันที่แตกต่างกัน
          <br />ปรับตาม CBT-I + ISI + PSQI + Hyperarousal Model
        </div>
      </div>

      {/* Comparison Table */}
      <ComparisonSection />

      {/* Two phones side by side */}
      <div style={{
        display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center",
        alignItems: "flex-start",
      }}>
        <PhoneFrame persona="min" />
        <PhoneFrame persona="gun" />
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 16, fontSize: 10, color: "rgba(255,255,255,.2)", textAlign: "center", maxWidth: 700, lineHeight: 1.6 }}>
        MOONAP Persona Demo · ภารกิจสร้างจาก CBT-I (Sleep Restriction, Stimulus Control, Sleep Hygiene, Cognitive Therapy)
        + ISI (Insomnia Severity Index) + PSQI (Pittsburgh Sleep Quality Index) + Hyperarousal Model Scoring
        <br />แตะภารกิจเพื่อดูรายละเอียดและที่มาของหลักการ
      </div>
    </div>
  );
}
