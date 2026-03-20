import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════
// THEMES
// ═══════════════════════════════════════
const TH={morning:{id:"morning",icon:"🌅",name:"เช้า",bg:"linear-gradient(170deg,#FFF8E7,#FFE0B2)",primary:"#FF9F43",secondary:"#FFD966",text:"#5D4037",sub:"#8D6E63",card:"rgba(255,255,255,0.82)",cardB:"rgba(255,159,67,0.25)",nav:"rgba(255,248,231,0.97)",accent:"#FF7675",greeting:"สวัสดีตอนเช้า! คืนนี้หลับยังไงบ้าง? 🌅",nudge:"คืนนี้คุณนอน 6.5 ชั่วโมง — ลองนอนเร็วขึ้น 30 นาทีคืนนี้?",petMsg:"เช้าแล้ว! พร้อมลุยวันใหม่ไหม? 💪"},
afternoon:{id:"afternoon",icon:"☀️",name:"กลางวัน",bg:"linear-gradient(170deg,#E3F2FD,#E8F5E9)",primary:"#1E88E5",secondary:"#43A047",text:"#1A237E",sub:"#455A64",card:"rgba(255,255,255,0.88)",cardB:"rgba(30,136,229,0.2)",nav:"rgba(227,242,253,0.97)",accent:"#00897B",greeting:"สวัสดีตอนบ่าย! อย่าลืมดูแลตัวเองนะ ☀️",nudge:"⚠️ ถ้าดื่มกาแฟตอนนี้ คาเฟอีนจะรบกวนการนอนตอน 4 ทุ่ม",petMsg:"อย่าลืมพักบ้างนะ! 🌿"},
evening:{id:"evening",icon:"🌇",name:"เย็น",bg:"linear-gradient(170deg,#4A148C,#7B1FA2)",primary:"#CE93D8",secondary:"#B39DDB",text:"#FFF3E0",sub:"#E1BEE7",card:"rgba(255,255,255,0.09)",cardB:"rgba(206,147,216,0.3)",nav:"rgba(74,20,140,0.96)",accent:"#FFB74D",greeting:"เย็นแล้ว เตรียมตัว wind-down กันเถอะ 🌇",nudge:"📱 อีก 1 ชม. ถึงเวลาวางหน้าจอแล้วนะ",petMsg:"เตรียมพักผ่อนกันเถอะ~ 🌙"},
night:{id:"night",icon:"🌙",name:"กลางคืน",bg:"linear-gradient(170deg,#0D1B2A,#1B2838)",primary:"#90CAF9",secondary:"#004D40",text:"#E0E0E0",sub:"#78909C",card:"rgba(255,255,255,0.06)",cardB:"rgba(144,202,249,0.15)",nav:"rgba(13,27,42,0.98)",accent:"#FFD54F",greeting:"ราตรีสวัสดิ์ เราอยู่ตรงนี้นะ 🌙",nudge:"🌙 เปิด Night Mode แล้ว — ลดแสงอัตโนมัติ",petMsg:"จะเฝ้าอยู่ตรงนี้นะ 🕯️"}};

const css=`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:0;display:none;}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes twinkle{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(144,202,249,.35)}50%{box-shadow:0 0 0 8px rgba(144,202,249,0)}}
@keyframes breatheCircle{0%,100%{transform:scale(.65);opacity:.45}50%{transform:scale(1.2);opacity:1}}
@keyframes talk{0%,100%{ry:2}30%{ry:5}60%{ry:3}}
@keyframes sparkle{0%,100%{filter:drop-shadow(0 0 4px rgba(255,213,79,.2))}50%{filter:drop-shadow(0 0 16px rgba(255,213,79,.7))}}
@keyframes sickBob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(3px) rotate(2deg)}}
.fadeUp{animation:fadeUp .35s ease-out forwards;}.floatY{animation:floatY 3.5s ease-in-out infinite;}`;

// ═══════════════════════════════════════
// 3 PET CHARACTERS
// ═══════════════════════════════════════
// state: happy | sick | sparkling
// age: baby | adult
const PETS = {
  moonie: {
    id:"moonie", name:"Moonie", thName:"มูนนี่",
    desc:"พระจันทร์เสี้ยวผู้ปกป้องยามค่ำคืน",
    color:"#FFD966", glow:"rgba(255,217,102,0.5)",
  },
  nappy: {
    id:"nappy", name:"Nappy", thName:"แน็ปปี้",
    desc:"ก้อนเมฆนุ่มๆ สื่อถึงการงีบที่สบายใจ",
    color:"#B3E5FC", glow:"rgba(179,229,252,0.5)",
  },
  dreamy: {
    id:"dreamy", name:"Dreamy", thName:"ดรีมมี่",
    desc:"สุนัขจิ้งจอกแห่งความฝัน ผู้นำทางสู่ REM",
    color:"#CE93D8", glow:"rgba(206,147,216,0.5)",
  },
};

function PetSVG({pet="moonie",size=100,state="happy",age="adult",animated=true,talking=false}) {
  const p = PETS[pet] || PETS.moonie;
  const isBaby = age==="baby";
  const isSick = state==="sick";
  const isSpark = state==="sparkling";
  const sc = isBaby ? 0.7 : 1;
  const bodyOp = isSick ? 0.55 : 1;
  const anim = animated ? (isSick ? "sickBob 3s ease-in-out infinite" : "floatY 3.5s ease-in-out infinite") : "none";
  const sparkAnim = isSpark ? "sparkle 2s ease-in-out infinite" : "none";

  // Mouth ry for talking
  const mouthRy = talking ? "talk 0.6s ease-in-out infinite" : "none";

  const eyeR = isBaby ? 4 : 5.5;
  const blushR = isBaby ? 4 : 5.5;

  if (pet === "moonie") {
    // Crescent moon - redesigned cuter: rounder, bigger face area
    return (
      <div style={{width:size,height:size,position:"relative",animation:anim,filter:sparkAnim!=="none"?undefined:undefined}}>
        <svg viewBox="0 0 120 120" width={size} height={size} style={{animation:sparkAnim,overflow:"visible"}}>
          <defs>
            <radialGradient id={`gm${size}${state}`} cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor={p.glow} stopOpacity="0.8"/>
              <stop offset="100%" stopColor={p.glow} stopOpacity="0"/>
            </radialGradient>
          </defs>
          {isSpark && <>
            <circle cx="20" cy="25" r="3" fill="#FFD54F" opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite"/></circle>
            <circle cx="100" cy="20" r="2.5" fill="#FFD54F" opacity="0.6"><animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite"/></circle>
            <circle cx="15" cy="90" r="2" fill="#FFD54F" opacity="0.7"><animate attributeName="opacity" values="0.7;0.15;0.7" dur="1.8s" repeatCount="indefinite"/></circle>
            <circle cx="105" cy="85" r="3" fill="#FFD54F" opacity="0.5"><animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.2s" repeatCount="indefinite"/></circle>
          </>}
          <ellipse cx="60" cy="58" rx={42*sc} ry={38*sc} fill={`url(#gm${size}${state})`}/>
          {/* Main body - rounder crescent */}
          <g opacity={bodyOp} transform={isBaby?"translate(10,12) scale(0.82)":""}>
            <path d="M58,12 C88,12 106,32 106,58 C106,84 88,104 60,104 C42,104 28,94 28,78 C28,62 44,52 58,52 C72,52 82,60 82,68 C82,76 72,82 60,82" fill={isSick?"#9E9E9E":p.color} stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            {/* Face - bigger, cuter */}
            <circle cx="48" cy="58" r={eyeR} fill="#2D1B00"/>
            <circle cx="70" cy="58" r={eyeR} fill="#2D1B00"/>
            {/* Eye highlights */}
            <circle cx={49.5} cy={56} r={eyeR*0.4} fill="white"/>
            <circle cx={71.5} cy={56} r={eyeR*0.4} fill="white"/>
            {!isSick && <circle cx={46} cy={54} r={eyeR*0.22} fill="white" opacity="0.6"/>}
            {/* Star in eye for sparkling */}
            {isSpark && <>
              <path d="M47,55 L48,53 L49,55 L51,56 L49,57 L48,59 L47,57 L45,56 Z" fill="white" opacity="0.8"/>
              <path d="M69,55 L70,53 L71,55 L73,56 L71,57 L70,59 L69,57 L67,56 Z" fill="white" opacity="0.8"/>
            </>}
            {/* Sick droopy eyes */}
            {isSick && <>
              <path d="M43,54 Q48,52 53,54" fill="none" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
              <path d="M65,54 Q70,52 75,54" fill="none" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
            </>}
            {/* Blush */}
            <circle cx="38" cy="66" r={blushR} fill={isSick?"#90A4AE":"#FFB3BA"} opacity={isSick?0.3:0.5}/>
            <circle cx="80" cy="66" r={blushR} fill={isSick?"#90A4AE":"#FFB3BA"} opacity={isSick?0.3:0.5}/>
            {/* Mouth */}
            {isSick ?
              <path d="M52,73 Q60,69 68,73" fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
            : talking ?
              <ellipse cx="59" cy="72" rx="6" ry="4" fill="#5D4037" opacity="0.7"><animate attributeName="ry" values="2;5;3;5;2" dur="0.6s" repeatCount="indefinite"/></ellipse>
            :
              <path d="M50,70 Q59,78 70,70" fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
            }
            {/* Arms */}
            <ellipse cx="22" cy="66" rx={isBaby?6:8} ry={isBaby?4:5} fill={isSick?"#9E9E9E":p.color} transform="rotate(-20 22 66)"/>
            <ellipse cx="96" cy="66" rx={isBaby?6:8} ry={isBaby?4:5} fill={isSick?"#9E9E9E":p.color} transform="rotate(20 96 66)"/>
            {/* Sick cloud */}
            {isSick && <g transform="translate(50,6)">
              <circle cx="0" cy="0" r="8" fill="#78909C" opacity="0.4"/>
              <circle cx="8" cy="-3" r="6" fill="#78909C" opacity="0.35"/>
              <circle cx="-7" cy="-2" r="5" fill="#78909C" opacity="0.3"/>
              <line x1="-4" y1="8" x2="-6" y2="18" stroke="#90CAF9" strokeWidth="1" opacity="0.3"/>
              <line x1="2" y1="8" x2="0" y2="16" stroke="#90CAF9" strokeWidth="1" opacity="0.25"/>
              <line x1="8" y1="6" x2="7" y2="15" stroke="#90CAF9" strokeWidth="1" opacity="0.2"/>
            </g>}
          </g>
          <text x="12" y="30" fontSize="10" fill="#FFD966" style={{animation:"twinkle 2s ease-in-out infinite"}}>✦</text>
          <text x="100" y="26" fontSize="8" fill="#FFD966" style={{animation:"twinkle 2.5s ease-in-out infinite"}}>✦</text>
        </svg>
      </div>
    );
  }

  if (pet === "nappy") {
    // Cloud creature - fluffy round cloud body
    return (
      <div style={{width:size,height:size,position:"relative",animation:anim}}>
        <svg viewBox="0 0 120 120" width={size} height={size} style={{animation:sparkAnim,overflow:"visible"}}>
          <defs><radialGradient id={`gn${size}${state}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={p.glow} stopOpacity="0.6"/><stop offset="100%" stopColor={p.glow} stopOpacity="0"/></radialGradient></defs>
          {isSpark && <>
            <circle cx="18" cy="28" r="3" fill="#81D4FA" opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite"/></circle>
            <circle cx="102" cy="22" r="2" fill="#81D4FA" opacity="0.6"><animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite"/></circle>
          </>}
          <ellipse cx="60" cy="62" rx={44*sc} ry={36*sc} fill={`url(#gn${size}${state})`}/>
          <g opacity={bodyOp} transform={isBaby?"translate(10,14) scale(0.8)":""}>
            {/* Cloud body - multiple overlapping circles */}
            <circle cx="60" cy="65" r="30" fill={isSick?"#B0BEC5":p.color}/>
            <circle cx="38" cy="62" r="22" fill={isSick?"#B0BEC5":p.color}/>
            <circle cx="82" cy="62" r="22" fill={isSick?"#B0BEC5":p.color}/>
            <circle cx="48" cy="50" r="18" fill={isSick?"#CFD8DC":isSpark?"#E1F5FE":"#E1F5FE"}/>
            <circle cx="72" cy="50" r="16" fill={isSick?"#CFD8DC":"#E1F5FE"}/>
            <circle cx="60" cy="45" r="14" fill={isSick?"#CFD8DC":"#E1F5FE"}/>
            {/* Face */}
            <circle cx="48" cy="62" r={eyeR} fill="#37474F"/>
            <circle cx="72" cy="62" r={eyeR} fill="#37474F"/>
            <circle cx={49.5} cy={60} r={eyeR*0.38} fill="white"/>
            <circle cx={73.5} cy={60} r={eyeR*0.38} fill="white"/>
            {isSpark && <>
              <path d="M47,59 L48,57 L49,59 L51,60 L49,61 L48,63 L47,61 L45,60 Z" fill="white" opacity="0.7"/>
            </>}
            {isSick && <>
              <path d="M43,58 Q48,56 53,58" fill="none" stroke="#37474F" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
              <path d="M67,58 Q72,56 77,58" fill="none" stroke="#37474F" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
            </>}
            <circle cx="38" cy="70" r={blushR} fill={isSick?"#90A4AE":"#F8BBD0"} opacity={isSick?0.25:0.45}/>
            <circle cx="82" cy="70" r={blushR} fill={isSick?"#90A4AE":"#F8BBD0"} opacity={isSick?0.25:0.45}/>
            {isSick ?
              <path d="M52,75 Q60,72 68,75" fill="none" stroke="#37474F" strokeWidth="2" strokeLinecap="round"/>
            : talking ?
              <ellipse cx="60" cy="74" rx="5" ry="3.5" fill="#37474F" opacity="0.6"><animate attributeName="ry" values="1.5;4;2.5;4;1.5" dur="0.6s" repeatCount="indefinite"/></ellipse>
            :
              <path d="M52,73 Q60,80 68,73" fill="none" stroke="#37474F" strokeWidth="2" strokeLinecap="round"/>
            }
            {/* Small cloud arms */}
            <circle cx="20" cy="68" r={isBaby?7:9} fill={isSick?"#B0BEC5":p.color}/>
            <circle cx="100" cy="68" r={isBaby?7:9} fill={isSick?"#B0BEC5":p.color}/>
            {/* Sleeping "Zzz" on baby */}
            {isBaby && <text x="85" y="40" fontSize="12" fill={p.color} opacity="0.5" fontWeight="700">z</text>}
            {isSick && <g transform="translate(50,8)"><circle cx="0" cy="0" r="7" fill="#546E7A" opacity="0.35"/><circle cx="7" cy="-2" r="5" fill="#546E7A" opacity="0.3"/><circle cx="-5" cy="-1" r="4" fill="#546E7A" opacity="0.25"/><line x1="0" y1="7" x2="-1" y2="14" stroke="#78909C" strokeWidth="1" opacity="0.2"/></g>}
          </g>
        </svg>
      </div>
    );
  }

  // dreamy - star fox
  return (
    <div style={{width:size,height:size,position:"relative",animation:anim}}>
      <svg viewBox="0 0 120 120" width={size} height={size} style={{animation:sparkAnim,overflow:"visible"}}>
        <defs><radialGradient id={`gd${size}${state}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={p.glow} stopOpacity="0.6"/><stop offset="100%" stopColor={p.glow} stopOpacity="0"/></radialGradient></defs>
        {isSpark && <>
          <circle cx="15" cy="20" r="3" fill="#E1BEE7" opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite"/></circle>
          <circle cx="105" cy="25" r="2" fill="#E1BEE7" opacity="0.6"><animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite"/></circle>
        </>}
        <ellipse cx="60" cy="60" rx={42*sc} ry={38*sc} fill={`url(#gd${size}${state})`}/>
        <g opacity={bodyOp} transform={isBaby?"translate(10,14) scale(0.8)":""}>
          {/* Fox body - rounded */}
          <ellipse cx="60" cy="68" rx="30" ry="26" fill={isSick?"#B0BEC5":p.color}/>
          {/* Fox ears - pointy */}
          <path d="M32,52 L26,24 L46,46 Z" fill={isSick?"#9E9E9E":p.color} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
          <path d="M32,52 L30,30 L42,48 Z" fill={isSick?"#BDBDBD":"#F3E5F5"}/>
          <path d="M88,52 L94,24 L74,46 Z" fill={isSick?"#9E9E9E":p.color} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
          <path d="M88,52 L90,30 L78,48 Z" fill={isSick?"#BDBDBD":"#F3E5F5"}/>
          {/* Face */}
          <circle cx="46" cy="62" r={eyeR} fill="#4A148C"/>
          <circle cx="74" cy="62" r={eyeR} fill="#4A148C"/>
          <circle cx={47.5} cy={60} r={eyeR*0.38} fill="white"/>
          <circle cx={75.5} cy={60} r={eyeR*0.38} fill="white"/>
          {isSpark && <><path d="M45,59 L46,57 L47,59 L49,60 L47,61 L46,63 L45,61 L43,60 Z" fill="white" opacity="0.7"/></>}
          {isSick && <><path d="M41,58 Q46,56 51,58" fill="none" stroke="#4A148C" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/><path d="M69,58 Q74,56 79,58" fill="none" stroke="#4A148C" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/></>}
          <circle cx="36" cy="70" r={blushR} fill={isSick?"#90A4AE":"#F8BBD0"} opacity={isSick?0.2:0.4}/>
          <circle cx="84" cy="70" r={blushR} fill={isSick?"#90A4AE":"#F8BBD0"} opacity={isSick?0.2:0.4}/>
          {/* Nose */}
          <ellipse cx="60" cy="68" rx="3" ry="2" fill="#4A148C"/>
          {/* Mouth */}
          {isSick ?
            <path d="M53,76 Q60,73 67,76" fill="none" stroke="#4A148C" strokeWidth="1.8" strokeLinecap="round"/>
          : talking ?
            <ellipse cx="60" cy="75" rx="5" ry="3" fill="#4A148C" opacity="0.6"><animate attributeName="ry" values="1;4;2;4;1" dur="0.6s" repeatCount="indefinite"/></ellipse>
          :
            <path d="M54,73 Q60,79 66,73" fill="none" stroke="#4A148C" strokeWidth="1.8" strokeLinecap="round"/>
          }
          {/* Constellation dots on body */}
          {!isSick && <>
            <circle cx="42" cy="80" r="1.5" fill="white" opacity="0.4"/>
            <circle cx="50" cy="85" r="1" fill="white" opacity="0.3"/>
            <circle cx="70" cy="82" r="1.5" fill="white" opacity="0.35"/>
            <circle cx="78" cy="78" r="1" fill="white" opacity="0.25"/>
            <line x1="42" y1="80" x2="50" y2="85" stroke="white" strokeWidth="0.5" opacity="0.2"/>
            <line x1="70" y1="82" x2="78" y2="78" stroke="white" strokeWidth="0.5" opacity="0.2"/>
          </>}
          {/* Fluffy tail */}
          <ellipse cx="95" cy="82" rx={isBaby?8:12} ry={isBaby?6:9} fill={isSick?"#B0BEC5":p.color} transform="rotate(-30 95 82)"/>
          {isSick && <g transform="translate(50,10)"><circle cx="0" cy="0" r="7" fill="#7E57C2" opacity="0.25"/><circle cx="7" cy="-2" r="5" fill="#7E57C2" opacity="0.2"/><line x1="0" y1="7" x2="-1" y2="14" stroke="#9575CD" strokeWidth="1" opacity="0.2"/></g>}
        </g>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════
function Logo({color="#fff",hiColor="#CE93D8",size=17,showMoon=false,moonBg="#0D1B2A"}) {
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:size*0.35}}>
      {showMoon && (
        <svg width={size*1.4} height={size*1.4} viewBox="0 0 110 110" style={{flexShrink:0,overflow:"visible"}}>
          <defs>
            <radialGradient id="lgm" cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF4CC"/>
              <stop offset="55%" stopColor="#F5C842"/>
              <stop offset="100%" stopColor="#E29010"/>
            </radialGradient>
          </defs>
          <circle cx="55" cy="55" r="46" fill="url(#lgm)"/>
          <circle cx="72" cy="47" r="37" fill={moonBg}/>
          <path d="M32 52 Q37 47 42 52" stroke="#8B5E1A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M43 48 Q48 43 53 48" stroke="#8B5E1A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M33 63 Q42 70 51 63" stroke="#8B5E1A" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <ellipse cx="28" cy="61" rx="6" ry="3.5" fill="#F4845F" opacity="0.45"/>
        </svg>
      )}
      <span style={{fontSize:size,fontWeight:900,fontFamily:"'Playfair Display',serif",color,letterSpacing:Math.max(size*0.04,1)}}>
        moo<span style={{color:hiColor}}>nap</span>
      </span>
    </span>
  );
}

function Ring({v,max,col,icon,label,subCol="#888"}) {
  const r=22,c=2*Math.PI*r,off=c-(v/max)*c;
  return (<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
    <div style={{position:"relative",width:52,height:52}}>
      <svg width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r={r} fill="none" stroke="rgba(128,128,128,0.12)" strokeWidth="5"/><circle cx="26" cy="26" r={r} fill="none" stroke={col} strokeWidth="5" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 26 26)" style={{transition:"stroke-dashoffset 1s ease"}}/></svg>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:14}}>{icon}</div>
    </div>
    <span style={{fontSize:9,color:subCol}}>{label}</span>
  </div>);
}

function Card({t,children,style={},onClick,className=""}) {
  return <div className={className} onClick={onClick} style={{background:t.card,backdropFilter:"blur(12px)",borderRadius:18,border:`1px solid ${t.cardB}`,padding:"13px 15px",transition:"transform .15s",...style,cursor:onClick?"pointer":"default"}}>{children}</div>;
}

// ═══════════════════════════════════════
// ONBOARDING (redesigned)
// ═══════════════════════════════════════
function Onboarding({onDone,setPetChoice,setGlobalPetName,setGlobalUserName}) {
  const [step,setStep]=useState(0);
  const [userName,setUserName]=useState("");
  const [selPet,setSelPet]=useState(null);
  const [petName,setPetName]=useState("");
  const [qIdx,setQIdx]=useState(0);
  const [answers,setAnswers]=useState({});
  const [talking,setTalking]=useState(false);

  const skip=()=>{setPetChoice("moonie");setGlobalPetName("Moonie");setGlobalUserName("พลอย");onDone();};

  const questions=[
    {q:"ปกติเข้านอนประมาณกี่โมงคะ?",opts:["ก่อน 22:00","22:00 – 00:00","หลังเที่ยงคืน","ไม่แน่นอน"]},
    {q:"ตื่นนอนกี่โมงคะ?",opts:["ก่อน 06:00","06:00 – 08:00","หลัง 08:00","ไม่แน่นอน"]},
    {q:"นอนหลับยากบ่อยแค่ไหนคะ?",opts:["แทบไม่เลย","1-2 วัน/สัปดาห์","3-4 วัน/สัปดาห์","แทบทุกคืน"]},
    {q:"ตื่นกลางดึกบ่อยไหมคะ?",opts:["ไม่ค่อย","บางครั้ง","ค่อนข้างบ่อย","ทุกคืน"]},
  ];

  const bg=["linear-gradient(170deg,#0D1B2A,#1B2838)","linear-gradient(170deg,#0D1B2A,#1B2838)","linear-gradient(170deg,#1a237e,#283593)","linear-gradient(170deg,#4A148C,#0D1B2A)"];

  const handleAnswer=(a)=>{
    setAnswers(p=>({...p,[qIdx]:a}));
    setTalking(true);
    setTimeout(()=>{
      setTalking(false);
      if(qIdx<questions.length-1) setQIdx(qi=>qi+1);
      else { setPetChoice(selPet); setGlobalPetName(petName); onDone(); }
    },1200);
  };

  // Step 0: Enter name
  if(step===0) return (
    <div style={{position:"absolute",inset:0,zIndex:200,background:bg[0],display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28}}>
      <div className="fadeUp" style={{textAlign:"center",width:"100%"}}>
        <Logo color="#fff" hiColor="#FFD966" size={36} showMoon={true} moonBg="#0D1B2A"/>
        <div style={{fontSize:13,color:"rgba(255,255,255,.4)",marginTop:8,fontStyle:"italic"}}>Rest Tonight. Shine Tomorrow.</div>
        <div style={{fontSize:18,fontWeight:700,color:"#fff",marginTop:32,fontFamily:"'Noto Sans Thai',sans-serif"}}>ชื่อของคุณคืออะไรคะ?</div>
        <input value={userName} onChange={e=>setUserName(e.target.value)} placeholder="พิมพ์ชื่อของคุณ..." style={{width:"100%",padding:"14px 16px",borderRadius:16,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.08)",color:"#fff",fontSize:16,outline:"none",marginTop:16,fontFamily:"'Noto Sans Thai',sans-serif",textAlign:"center"}}/>
        <div onClick={()=>{if(userName.trim()){setGlobalUserName(userName.trim());setStep(1);}}} style={{marginTop:24,background:userName.trim()?"linear-gradient(135deg,#FFD966,#FF9F43)":"rgba(255,255,255,.1)",borderRadius:16,padding:"13px 0",fontSize:15,fontWeight:700,color:userName.trim()?"#2D1B00":"rgba(255,255,255,.3)",cursor:userName.trim()?"pointer":"default",fontFamily:"'Noto Sans Thai',sans-serif"}}>ไปต่อ →</div>
        <div onClick={skip} style={{marginTop:12,fontSize:12,color:"rgba(255,255,255,.3)",cursor:"pointer",textAlign:"center"}}>⏩ ข้ามไปหน้าหลัก (ทดสอบ)</div>
      </div>
    </div>
  );

  // Step 1: Choose pet
  if(step===1) return (
    <div style={{position:"absolute",inset:0,zIndex:200,background:bg[1],display:"flex",flexDirection:"column",alignItems:"center",padding:"36px 20px 20px",overflowY:"auto"}}>
      <div className="fadeUp" style={{textAlign:"center",width:"100%"}}>
        <div style={{fontSize:18,fontWeight:700,color:"#fff",fontFamily:"'Noto Sans Thai',sans-serif"}}>เลือกเพื่อนคู่ใจของคุณ</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.45)",marginTop:6}}>เพื่อนที่จะเติบโตไปตามคุณภาพการนอน</div>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:22}}>
          {Object.values(PETS).map(p=>(
            <div key={p.id} onClick={()=>setSelPet(p.id)} style={{
              display:"flex",alignItems:"center",gap:14,padding:"14px 16px",
              borderRadius:20,cursor:"pointer",transition:"all .3s",
              background:selPet===p.id?"rgba(255,255,255,.12)":"rgba(255,255,255,.04)",
              border:selPet===p.id?`2px solid ${p.color}`:"2px solid rgba(255,255,255,.08)",
              boxShadow:selPet===p.id?`0 0 20px ${p.glow}`:"none",
            }}>
              <PetSVG pet={p.id} size={64} state="happy" age="baby" animated={false}/>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{p.name} <span style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>({p.thName})</span></div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginTop:2,fontFamily:"'Noto Sans Thai',sans-serif"}}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div onClick={()=>selPet&&setStep(2)} style={{marginTop:22,background:selPet?"linear-gradient(135deg,#CE93D8,#B39DDB)":"rgba(255,255,255,.08)",borderRadius:16,padding:"13px 0",fontSize:15,fontWeight:700,color:selPet?"#fff":"rgba(255,255,255,.3)",cursor:selPet?"pointer":"default"}}>เลือกเพื่อนตัวนี้! →</div>
      </div>
    </div>
  );

  // Step 2: Name pet
  if(step===2) return (
    <div style={{position:"absolute",inset:0,zIndex:200,background:bg[2],display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28}}>
      <div className="fadeUp" style={{textAlign:"center",width:"100%"}}>
        <PetSVG pet={selPet} size={100} state="happy" age="baby"/>
        <div style={{fontSize:16,fontWeight:700,color:"#fff",marginTop:14,fontFamily:"'Noto Sans Thai',sans-serif"}}>ตั้งชื่อให้เพื่อนของคุณ</div>
        <input value={petName} onChange={e=>setPetName(e.target.value)} placeholder={`เช่น น้อง${PETS[selPet]?.thName||"มูนนี่"}...`} style={{width:"100%",padding:"14px 16px",borderRadius:16,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.08)",color:"#fff",fontSize:16,outline:"none",marginTop:14,fontFamily:"'Noto Sans Thai',sans-serif",textAlign:"center"}}/>
        <div onClick={()=>petName.trim()&&setStep(3)} style={{marginTop:22,background:petName.trim()?"linear-gradient(135deg,#FFD966,#FF9F43)":"rgba(255,255,255,.08)",borderRadius:16,padding:"13px 0",fontSize:15,fontWeight:700,color:petName.trim()?"#2D1B00":"rgba(255,255,255,.3)",cursor:petName.trim()?"pointer":"default"}}>ไปต่อ →</div>
      </div>
    </div>
  );

  // Step 3: Questionnaire with talking pet
  const cq = questions[qIdx];
  return (
    <div style={{position:"absolute",inset:0,zIndex:200,background:bg[3],display:"flex",flexDirection:"column",alignItems:"center",padding:"30px 20px",overflowY:"auto"}}>
      {/* Progress */}
      <div style={{width:"100%",display:"flex",gap:6,marginBottom:20}}>
        {questions.map((_,i)=>(
          <div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=qIdx?"#CE93D8":"rgba(255,255,255,.1)",transition:"background .3s"}}/>
        ))}
      </div>
      <PetSVG pet={selPet} size={90} state="happy" talking={talking}/>
      <div style={{fontSize:14,fontWeight:700,color:"#CE93D8",marginTop:4}}>{petName}</div>
      {/* Question bubble */}
      <div className="fadeUp" key={qIdx} style={{background:"rgba(255,255,255,.08)",borderRadius:"6px 18px 18px 18px",padding:"12px 16px",marginTop:14,maxWidth:280,border:"1px solid rgba(255,255,255,.1)"}}>
        <div style={{fontSize:14,color:"#fff",fontFamily:"'Noto Sans Thai',sans-serif",lineHeight:1.5}}>{cq.q}</div>
      </div>
      {/* Options */}
      <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:16,width:"100%"}}>
        {cq.opts.map((o,i)=>(
          <div key={i} onClick={()=>!talking&&handleAnswer(o)} style={{
            padding:"12px 16px",borderRadius:14,background:answers[qIdx]===o?"rgba(206,147,216,.2)":"rgba(255,255,255,.05)",
            border:`1px solid ${answers[qIdx]===o?"#CE93D8":"rgba(255,255,255,.1)"}`,
            color:"#fff",fontSize:13,cursor:talking?"default":"pointer",transition:"all .2s",
            fontFamily:"'Noto Sans Thai',sans-serif",opacity:talking?.5:1,
          }}>{o}</div>
        ))}
      </div>
      <div style={{fontSize:11,color:"rgba(255,255,255,.25)",marginTop:16}}>คำถาม {qIdx+1}/{questions.length}</div>
    </div>
  );
}

// ═══════════════════════════════════════
// AI CHAT SCREEN
// ═══════════════════════════════════════
function AIChatScreen({t,petId,petNameStr,close,userName}) {
  const [msgs,setMsgs]=useState([{from:"pet",text:`สวัสดีค่ะ คุณ${userName||""}! 🌅 วันนี้รู้สึกยังไงบ้าง? อยากคุยอะไรก็บอกได้นะคะ`}]);
  const [inp,setInp]=useState("");
  const [showVoice,setShowVoice]=useState(false);
  const replies=["เข้าใจเลยค่ะ 😊 บอกเพิ่มเติมได้นะ","ขอบคุณที่เล่าให้ฟังนะคะ! จะจดไว้ให้เลย 📝","วันนี้ลองพักผ่อนเยอะๆ นะคะ ดูแลตัวเองด้วย 💛"];
  const send=()=>{
    if(!inp.trim())return;
    const ui=msgs.filter(m=>m.from==="u").length;
    setMsgs(p=>[...p,{from:"u",text:inp}]);setInp("");
    setTimeout(()=>setMsgs(p=>[...p,{from:"pet",text:replies[Math.min(ui,2)]}]),800);
  };

  if(showVoice) return (
    <div style={{position:"absolute",inset:0,zIndex:110,background:"linear-gradient(170deg,#0D1B2A,#1B2A44)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div onClick={()=>setShowVoice(false)} style={{position:"absolute",top:14,left:16,cursor:"pointer",color:"rgba(255,255,255,.5)",fontSize:16}}>← กลับ</div>
      <PetSVG pet={petId} size={140} state="happy" talking={true}/>
      <div style={{fontSize:16,fontWeight:700,color:"#fff",marginTop:16}}>{petNameStr}</div>
      <div style={{fontSize:12,color:"rgba(255,255,255,.45)",marginTop:6}}>กำลังฟังอยู่ค่ะ...</div>
      <div style={{width:80,height:80,borderRadius:"50%",border:"3px solid rgba(144,202,249,.3)",marginTop:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,animation:"pulse 2s ease infinite",cursor:"pointer"}}>🎤</div>
      <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginTop:16}}>แตะเพื่อพูด — แตะอีกครั้งเพื่อหยุด</div>
    </div>
  );

  const chatBg=t.id==="morning"?"#FFF8E7":t.id==="afternoon"?"#EFF7FF":t.id==="evening"?"#2D0A50":"#0A141E";
  return (
    <div style={{position:"absolute",inset:0,zIndex:100,background:chatBg,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"14px 15px 11px",display:"flex",alignItems:"center",gap:11,borderBottom:`1px solid ${t.cardB}`}}>
        <div onClick={close} style={{cursor:"pointer",fontSize:20,color:t.text}}>←</div>
        <PetSVG pet={petId} size={32} state="happy" animated={false}/>
        <div><div style={{fontSize:13,fontWeight:700,color:t.text}}>{petNameStr}</div><div style={{fontSize:9,color:"#66BB6A"}}>ออนไลน์</div></div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i)=>(
          <div key={i} className="fadeUp" style={{display:"flex",gap:7,flexDirection:m.from==="pet"?"row":"row-reverse",alignItems:"flex-end"}}>
            {m.from==="pet"&&<div style={{flexShrink:0}}><PetSVG pet={petId} size={30} state="happy" animated={false}/></div>}
            <div style={{maxWidth:"74%",background:m.from==="pet"?t.card:t.primary,borderRadius:m.from==="pet"?"4px 14px 14px 14px":"14px 4px 14px 14px",padding:"9px 12px",border:`1px solid ${t.cardB}`}}>
              <div style={{fontSize:12,color:m.from==="pet"?t.text:"white",lineHeight:1.55,fontFamily:"'Noto Sans Thai',sans-serif"}}>{m.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:"11px 14px",borderTop:`1px solid ${t.cardB}`,display:"flex",gap:8,alignItems:"center"}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="พิมพ์ข้อความ..." style={{flex:1,padding:"10px 14px",borderRadius:20,background:t.card,border:`1px solid ${t.cardB}`,color:t.text,fontSize:12,outline:"none",fontFamily:"'Noto Sans Thai',sans-serif"}}/>
        <div onClick={send} style={{width:38,height:38,borderRadius:"50%",background:t.primary,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15,color:"white",flexShrink:0}}>➤</div>
        <div onClick={()=>setShowVoice(true)} style={{width:38,height:38,borderRadius:"50%",background:"rgba(128,128,128,.15)",border:`1px solid ${t.cardB}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,flexShrink:0}}>🎤</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// SCREENS (Home, Dashboard, Tools, Missions, Profile)
// Kept concise — same structure as V2 with pet/logo fixes
// ═══════════════════════════════════════
function HomeScreen({t,setModal,setTab,petId,petNameStr,petState,petAge,userName}) {
  const [bubble,setBubble]=useState(false);
  const tap=()=>{setBubble(true);setTimeout(()=>setBubble(false),2500);};
  // Stats change with petState
  const stats = petState==="sick" ? {g:28,h:32,m:25,lv:8,stage:"Baby"} : petState==="sparkling" ? {g:92,h:95,m:98,lv:45,stage:"Adult"} : {g:68,h:73,m:85,lv:23,stage:"Teen"};
  const actions=[
    {icon:"📝",label:"บันทึกเช้า",onClick:()=>setModal("log")},
    {icon:"🎧",label:"เสียงกล่อมนอน",onClick:()=>setTab("tools")},
    {icon:"🫁",label:"ฝึกหายใจ",onClick:()=>setModal("breath")},
    {icon:"📖",label:"นิทานก่อนนอน",onClick:()=>setModal("premium")},
    {icon:"🧘",label:"Body Scan",onClick:()=>setModal("breath")},
  ];
  const sched=[{time:"07:00",text:"บันทึกเช้าเสร็จแล้ว",ico:"✅",done:true},{time:"14:00",text:"หยุดคาเฟอีน",ico:"⏰"},{time:"20:00",text:"เริ่ม Wind-down Routine",ico:"🔜"},{time:"22:30",text:"เวลานอน (Sleep Window)",ico:"🌙"}];

  return (
    <div style={{padding:"4px 15px 14px",overflowY:"auto",height:"100%",color:t.text}}>
      <div style={{marginBottom:10}}>
        <div style={{fontSize:12,color:t.sub}}>สวัสดี, คุณ{userName}</div>
        <div style={{fontSize:14,fontWeight:700,lineHeight:1.4,fontFamily:"'Noto Sans Thai',sans-serif"}}>{t.greeting}</div>
      </div>
      <Card t={t} style={{marginBottom:11,textAlign:"center",padding:"16px 14px",position:"relative"}}>
        <div style={{display:"flex",justifyContent:"center",cursor:"pointer",marginBottom:8}} onClick={tap}>
          <PetSVG pet={petId} size={96} state={petState} age={petAge}/>
        </div>
        {bubble&&<div className="fadeUp" style={{position:"absolute",top:8,right:14,maxWidth:160,background:t.id==="night"?"rgba(255,224,178,0.12)":"rgba(0,0,0,0.06)",borderRadius:"14px 14px 14px 4px",padding:"7px 11px",fontSize:11,color:t.text,fontFamily:"'Noto Sans Thai',sans-serif"}}>{t.petMsg}</div>}
        <div style={{display:"flex",justifyContent:"center",gap:18,marginBottom:8}}>
          <Ring v={stats.g} max={100} col="#66BB6A" icon="🌱" label="Growth" subCol={t.sub}/>
          <Ring v={stats.h} max={100} col="#EF5350" icon="❤️" label="Health" subCol={t.sub}/>
          <Ring v={stats.m} max={100} col="#FFD700" icon="😊" label="Mood" subCol={t.sub}/>
        </div>
        <div style={{fontSize:12,fontWeight:700}}>Lv. {stats.lv} — {petNameStr} {petState==="sparkling"?"✨":petState==="sick"?"💤":"⭐"}</div>
        <div style={{fontSize:10,color:t.sub,marginTop:3}}>{petState==="sick"?`${petNameStr} ไม่สบาย... ช่วยดูแลหน่อยนะ 🥺`:petState==="sparkling"?`${petNameStr} สดใสเป็นพิเศษวันนี้! ✨`:"(แตะเพื่อน เพื่อดู reaction)"}</div>
      </Card>
      {/* AI Chat shortcut */}
      <Card t={t} style={{marginBottom:11,display:"flex",alignItems:"center",gap:10}} onClick={()=>setModal("aiChat")}>
        <PetSVG pet={petId} size={36} state="happy" animated={false}/>
        <div style={{flex:1}}>
          <div style={{fontSize:12,fontWeight:700,fontFamily:"'Noto Sans Thai',sans-serif"}}>คุยกับ {petNameStr}</div>
          <div style={{fontSize:10,color:t.sub}}>AI Chat — บันทึกการนอน, ขอคำแนะนำ</div>
        </div>
        <span style={{color:t.sub,fontSize:18}}>💬</span>
      </Card>
      {/* Quick Actions */}
      <div style={{marginBottom:11}}>
        <div style={{display:"flex",gap:9,overflowX:"auto",paddingBottom:3}}>
          {actions.map((a,i)=>(<div key={i} onClick={a.onClick} style={{background:t.card,backdropFilter:"blur(10px)",borderRadius:14,border:`1px solid ${t.cardB}`,padding:"11px 10px",minWidth:74,cursor:"pointer",textAlign:"center",flexShrink:0,transition:"transform .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}><div style={{fontSize:22,marginBottom:4}}>{a.icon}</div><div style={{fontSize:10,fontFamily:"'Noto Sans Thai',sans-serif"}}>{a.label}</div></div>))}
        </div>
      </div>
      <Card t={t} style={{marginBottom:11}}>
        <div style={{fontSize:12,fontWeight:700,marginBottom:8,fontFamily:"'Noto Sans Thai',sans-serif"}}>แผนวันนี้ 📋</div>
        {sched.map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:i<3?`1px solid ${t.cardB}`:"none",opacity:s.done?.6:1}}><span style={{fontSize:14}}>{s.ico}</span><span style={{fontSize:10,color:t.sub,minWidth:34}}>{s.time}</span><span style={{fontSize:11,flex:1,fontFamily:"'Noto Sans Thai',sans-serif"}}>{s.text}</span><span style={{color:t.sub,fontSize:13}}>›</span></div>))}
      </Card>
      <div style={{background:`linear-gradient(135deg,${t.primary}25,${t.accent||t.secondary}20)`,borderRadius:14,padding:"11px 13px",border:`1px solid ${t.primary}33`,fontSize:12,fontFamily:"'Noto Sans Thai',sans-serif",marginBottom:11}}>{t.nudge}</div>
      {t.id==="night"&&<div onClick={()=>setModal("nightSupport")} style={{background:"rgba(255,224,178,0.06)",border:"1px solid rgba(255,213,79,0.15)",borderRadius:16,padding:"14px 15px",cursor:"pointer",textAlign:"center"}}><div style={{fontSize:14,color:"#FFD54F",fontWeight:600}}>🕯️ เปิด Night Support</div><div style={{fontSize:11,color:"#78909C",marginTop:4,fontFamily:"'Noto Sans Thai',sans-serif"}}>นอนไม่หลับ? {petNameStr} อยู่ตรงนี้</div></div>}
    </div>
  );
}

function DashboardScreen({t}) {
  const days=["จ.","อ.","พ.","พฤ.","ศ.","ส.","อา."],vals=[78,85,65,90,72,88,82];
  return (
    <div style={{padding:"4px 15px 14px",overflowY:"auto",height:"100%",color:t.text}}>
      <div style={{fontSize:15,fontWeight:700,marginBottom:12,fontFamily:"'Noto Sans Thai',sans-serif"}}>ภาพรวมการนอน 📊</div>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        {[{v:"82%",l:"Sleep Efficiency",c:"#66BB6A"},{v:"6.8 ชม.",l:"เฉลี่ยต่อคืน",c:"#42A5F5"},{v:"12🔥",l:"Day Streak",c:"#FF7043"}].map((c,i)=>(<Card key={i} t={t} style={{flex:1,padding:"10px 8px",textAlign:"center"}}><div style={{fontSize:16,fontWeight:800,color:c.c}}>{c.v}</div><div style={{fontSize:9,color:t.sub,marginTop:2,fontFamily:"'Noto Sans Thai',sans-serif"}}>{c.l}</div></Card>))}
      </div>
      <Card t={t} style={{marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:700,marginBottom:8,fontFamily:"'Noto Sans Thai',sans-serif"}}>Sleep Efficiency รายสัปดาห์</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:5,height:80}}>
          {days.map((d,i)=>{const h=(vals[i]/100)*68,col=vals[i]>=85?"#66BB6A":vals[i]>=70?"#FFA726":"#EF5350",today=i===6;return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div style={{fontSize:8,color:col,fontWeight:700}}>{vals[i]}%</div><div style={{width:"100%",height:h,background:col,borderRadius:"4px 4px 0 0",opacity:today?1:.65,boxShadow:today?`0 0 8px ${col}`:"",transition:"height .8s ease"}}/><div style={{fontSize:9,color:t.sub}}>{d}</div></div>);})}
        </div>
      </Card>
      <Card t={t} style={{marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:700,marginBottom:8,fontFamily:"'Noto Sans Thai',sans-serif"}}>Sleep Breakdown คืนล่าสุด</div>
        <div style={{height:20,borderRadius:10,overflow:"hidden",display:"flex",marginBottom:6}}><div style={{width:"15%",background:"#FF9800"}}/><div style={{width:"72%",background:"#66BB6A"}}/><div style={{width:"13%",background:"#EF5350"}}/></div>
        <div style={{display:"flex",gap:10,fontSize:9}}>{[["#FF9800","ก่อนหลับ 15%"],["#66BB6A","นอนจริง 72%"],["#EF5350","ตื่นกลางดึก 13%"]].map(([c,l])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,borderRadius:3,background:c}}/><span style={{color:t.sub}}>{l}</span></div>))}</div>
      </Card>
      <Card t={t}>
        <div style={{fontSize:11,fontWeight:700,marginBottom:8,fontFamily:"'Noto Sans Thai',sans-serif"}}>Streak Calendar — มีนาคม 2026</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
          {["อา","จ","อ","พ","พฤ","ศ","ส"].map(d=><div key={d} style={{fontSize:9,textAlign:"center",color:t.sub,paddingBottom:2}}>{d}</div>)}
          {Array.from({length:31},(_,i)=>{const day=i+1,done=[1,2,3,5,6,7,8,9,10,12,13,14,15,16,17,19,20].includes(day),today=day===20;return (<div key={i} style={{aspectRatio:"1",borderRadius:"50%",background:today?t.primary:done?"#4CAF5055":"transparent",border:today?`2px solid ${t.primary}`:done?"none":`1px solid ${t.cardB}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:today?700:400,boxShadow:today?`0 0 8px ${t.primary}88`:""}}>{day}</div>);})}
        </div>
      </Card>
    </div>
  );
}

function ToolsScreen({t,setModal}) {
  const [cat,setCat]=useState("ทั้งหมด");
  const cats=["ทั้งหมด","เสียง","หายใจ","สมาธิ","นิทาน"];
  const allTools=[{icon:"🫁",name:"หายใจ 4-7-8",desc:"คลายเครียด 3 นาที",btn:"เริ่ม",cat:"หายใจ",onClick:()=>setModal("breath")},{icon:"📦",name:"Box Breathing",desc:"สงบจิตใจ 5 นาที",btn:"เริ่ม",cat:"หายใจ",onClick:()=>setModal("breath")},{icon:"🧘",name:"Body Scan",desc:"AI นำทาง 15 นาที",btn:"เริ่ม",cat:"สมาธิ"},{icon:"🌊",name:"เสียงคลื่นทะเล",desc:"ธรรมชาติ 30 นาที",btn:"เล่น",cat:"เสียง"},{icon:"🦗",name:"เสียงจิ้งหรีด",desc:"ป่ายามค่ำ",btn:"เล่น",cat:"เสียง"},{icon:"🔥",name:"เสียงเตาผิง",desc:"อบอุ่น ผ่อนคลาย",btn:"เล่น",cat:"เสียง"},{icon:"📖",name:"นิทานก่อนนอน",desc:"8 เรื่อง AI ไทย",btn:"เล่น",cat:"นิทาน",plus:true,onClick:()=>setModal("premium")},{icon:"🎵",name:"โลฟายกล่อมนอน",desc:"60 นาที",btn:"เล่น",cat:"เสียง"}];
  const tools=cat==="ทั้งหมด"?allTools:allTools.filter(x=>x.cat===cat);
  return (
    <div style={{padding:"4px 15px 14px",overflowY:"auto",height:"100%",color:t.text}}>
      <div style={{fontSize:15,fontWeight:700,marginBottom:11,fontFamily:"'Noto Sans Thai',sans-serif"}}>เครื่องมือช่วยนอน 🛠</div>
      <div style={{display:"flex",gap:7,marginBottom:12,overflowX:"auto",paddingBottom:2}}>{cats.map(c=><div key={c} onClick={()=>setCat(c)} style={{padding:"6px 13px",borderRadius:20,cursor:"pointer",fontSize:11,flexShrink:0,background:cat===c?t.primary:t.card,color:cat===c?"white":t.text,border:`1px solid ${cat===c?t.primary:t.cardB}`,fontWeight:cat===c?600:400,fontFamily:"'Noto Sans Thai',sans-serif"}}>{c}</div>)}</div>
      <div style={{borderRadius:18,overflow:"hidden",marginBottom:12,background:"linear-gradient(135deg,#1a3a5c,#0d2137)",position:"relative"}}><div style={{padding:"18px 15px"}}><div style={{fontSize:26,marginBottom:5}}>🌧</div><div style={{fontSize:14,fontWeight:700,color:"white",marginBottom:3}}>เสียงฝนตกยามค่ำคืน</div><div style={{fontSize:11,color:"#90CAF9",marginBottom:11}}>45 นาที • แนะนำสำหรับคืนนี้</div><div style={{display:"inline-block",background:t.primary,borderRadius:14,padding:"8px 18px",fontSize:12,color:"white",cursor:"pointer",fontWeight:600}}>▶ เล่น</div></div><div style={{position:"absolute",top:10,right:10,background:"#FFB74D",color:"white",fontSize:9,padding:"3px 8px",borderRadius:10,fontWeight:700}}>แนะนำ</div></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>{tools.map((tool,i)=>(<div key={i} onClick={tool.onClick} style={{background:t.card,backdropFilter:"blur(10px)",borderRadius:16,border:`1px solid ${t.cardB}`,padding:"12px 11px",cursor:tool.onClick?"pointer":"default",position:"relative",transition:"transform .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.025)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>{tool.plus&&<div style={{position:"absolute",top:8,right:8,background:"linear-gradient(135deg,#FFD700,#FFA000)",color:"#333",fontSize:8,padding:"2px 6px",borderRadius:8,fontWeight:700}}>🔒 PLUS</div>}<div style={{fontSize:22,marginBottom:5}}>{tool.icon}</div><div style={{fontSize:11,fontWeight:700,fontFamily:"'Noto Sans Thai',sans-serif"}}>{tool.name}</div><div style={{fontSize:9,color:t.sub,marginBottom:8,fontFamily:"'Noto Sans Thai',sans-serif"}}>{tool.desc}</div><div style={{background:t.primary,color:"white",borderRadius:10,padding:"4px 11px",fontSize:10,display:"inline-block",fontWeight:600}}>{tool.btn}</div></div>))}</div>
    </div>
  );
}

function MissionsScreen({t,setModal}) {
  const missions=[{text:"บันทึกการนอนตอนเช้า",exp:15,done:true},{text:"ไม่ดื่มคาเฟอีนหลัง 14:00",exp:10,done:true},{text:"เปิดเสียงธรรมชาติก่อนนอน",exp:10,done:true},{text:"นอนก่อน 23:00",exp:20,done:false},{text:"ทำ Breathing Exercise",exp:10,done:false,action:true}];
  return (
    <div style={{padding:"4px 15px 14px",overflowY:"auto",height:"100%",color:t.text}}>
      <div style={{fontSize:15,fontWeight:700,marginBottom:3,fontFamily:"'Noto Sans Thai',sans-serif"}}>ภารกิจประจำวัน 🎯</div>
      <div style={{fontSize:11,color:t.sub,marginBottom:12,fontFamily:"'Noto Sans Thai',sans-serif"}}>ทำภารกิจ → ได้ EXP → เพื่อนเติบโต!</div>
      <Card t={t} style={{marginBottom:11}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}><div style={{fontSize:12,fontWeight:700,fontFamily:"'Noto Sans Thai',sans-serif"}}>ภารกิจวันนี้ 📋</div><div style={{fontSize:11,color:t.primary,fontWeight:700}}>3/5</div></div>
        {missions.map((m,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:i<4?`1px solid ${t.cardB}`:"none"}}><div style={{width:22,height:22,borderRadius:6,flexShrink:0,background:m.done?"#66BB6A":t.cardB,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"white"}}>{m.done?"✓":""}</div><div style={{flex:1,fontSize:11,fontFamily:"'Noto Sans Thai',sans-serif",textDecoration:m.done?"line-through":"none",opacity:m.done?.55:1}}>{m.text}</div><div style={{fontSize:10,color:"#66BB6A",fontWeight:700,flexShrink:0}}>+{m.exp}</div>{m.action&&!m.done&&<div onClick={()=>setModal("breath")} style={{background:t.primary,color:"white",borderRadius:10,padding:"3px 8px",fontSize:10,cursor:"pointer",flexShrink:0}}>เริ่ม →</div>}</div>))}
        <div style={{marginTop:10}}><div style={{fontSize:10,color:t.sub,marginBottom:4}}>35 / 65 EXP วันนี้</div><div style={{background:t.cardB,borderRadius:10,height:7,overflow:"hidden"}}><div style={{width:"54%",height:"100%",background:t.primary,borderRadius:10}}/></div></div>
      </Card>
      <Card t={t} style={{marginBottom:11,borderColor:"#FFD70055"}}>
        <div style={{fontSize:12,fontWeight:700,marginBottom:5,fontFamily:"'Noto Sans Thai',sans-serif"}}>🏆 Challenge สัปดาห์นี้</div>
        <div style={{fontSize:11,marginBottom:8,fontFamily:"'Noto Sans Thai',sans-serif"}}>นอนก่อนเที่ยงคืน 5 คืนติดกัน</div>
        <div style={{display:"flex",gap:5,marginBottom:7}}>{["จ.✓","อ.✓","พ.✓","พฤ.✓","ศ.?","ส.","อา."].map((d,i)=>(<div key={i} style={{flex:1,textAlign:"center",fontSize:9,padding:"5px 1px",borderRadius:7,background:d.includes("✓")?"#4CAF5044":d.includes("?")?(t.primary+"33"):t.cardB,fontWeight:d.includes("✓")?700:400}}>{d}</div>))}</div>
      </Card>
      <Card t={t} style={{marginBottom:11}}>
        <div style={{fontSize:12,fontWeight:700,marginBottom:8,fontFamily:"'Noto Sans Thai',sans-serif"}}>🔮 ภารกิจซ่อน — 2/5</div>
        <div style={{padding:"6px 0",fontSize:11,fontFamily:"'Noto Sans Thai',sans-serif",display:"flex",justifyContent:"space-between"}}>
          <span>⭐ ไม่ดื่มคาเฟอีนหลังบ่าย 3 ทั้งสัปดาห์</span><span style={{color:"#66BB6A",fontWeight:700,fontSize:10}}>5/7</span>
        </div>
        <div style={{padding:"6px 0",fontSize:11,fontFamily:"'Noto Sans Thai',sans-serif",display:"flex",justifyContent:"space-between",borderTop:`1px solid ${t.cardB}`}}>
          <span>⭐ ใช้ Body Scan 3 คืนติดกัน</span><span style={{color:"#FFB74D",fontWeight:700,fontSize:10}}>2/3</span>
        </div>
        {[1,2,3].map(i=><div key={i} style={{padding:"6px 0",fontSize:11,color:t.sub,opacity:.35,borderTop:`1px solid ${t.cardB}`}}>🔒 ???</div>)}
      </Card>
    </div>
  );
}

function ProfileScreen({t,setModal,petId,petNameStr,petState,petAge,userName}) {
  return (
    <div style={{padding:"4px 15px 14px",overflowY:"auto",height:"100%",color:t.text}}>
      <Card t={t} style={{textAlign:"center",marginBottom:11,padding:"18px 14px"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:6}}>
          <PetSVG pet={petId} size={56} state={petState} age={petAge} animated={false}/>
        </div>
        <div style={{fontSize:15,fontWeight:700}}>คุณ{userName}</div>
        <div style={{fontSize:11,color:t.sub,marginTop:2}}>ใช้งานมา 45 วัน</div>
        <div style={{display:"inline-block",marginTop:6,background:t.primary+"33",borderRadius:12,padding:"4px 11px",fontSize:11,color:t.primary,fontWeight:700}}>😴 นักนอนมือโปร</div>
      </Card>
      <Card t={t} style={{marginBottom:11,background:`linear-gradient(135deg,${t.primary}15,${t.secondary}10)`,borderColor:t.primary+"44"}} onClick={()=>setModal("premium")}>
        <div style={{fontSize:12,fontWeight:700,marginBottom:3}}>Moonap Free</div>
        <div style={{fontSize:10,color:t.sub,marginBottom:10,fontFamily:"'Noto Sans Thai',sans-serif"}}>ปลดล็อก Night Support, CBT-I เต็ม, นิทานทั้งหมด</div>
        <div style={{background:t.primary,color:"white",borderRadius:12,padding:"9px 16px",fontSize:12,fontWeight:600,textAlign:"center",fontFamily:"'Noto Sans Thai',sans-serif"}}>อัพเกรดเป็น Plus ✨</div>
      </Card>
      <Card t={t} style={{marginBottom:11}} onClick={()=>setModal("cbti")}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>🧠</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,fontFamily:"'Noto Sans Thai',sans-serif"}}>โปรแกรม CBT-I 6 สัปดาห์</div><div style={{fontSize:10,color:t.sub}}>สัปดาห์ 3/6</div></div><span style={{color:t.sub}}>›</span></div></Card>
      <Card t={t} style={{marginBottom:11}}>
        <div style={{fontSize:12,fontWeight:700,marginBottom:8,fontFamily:"'Noto Sans Thai',sans-serif"}}>Sleep Profile</div>
        {[["Chronotype","🦉 นกฮูก (นอนดึก)"],["เวลานอนแนะนำ","23:00 – 06:30"],["หยุดคาเฟอีน","14:00"],["หยุดหน้าจอ","21:30"]].map(([k,v],i,a)=>(<div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<a.length-1?`1px solid ${t.cardB}`:"none"}}><span style={{fontSize:11,color:t.sub,fontFamily:"'Noto Sans Thai',sans-serif"}}>{k}</span><span style={{fontSize:11,fontWeight:600}}>{v}</span></div>))}
      </Card>
      <Card t={t}>{["🔔 การแจ้งเตือน","🎨 ธีม","🔊 เสียง","🌍 ภาษา","🔒 ความเป็นส่วนตัว","❓ ช่วยเหลือ","📧 ติดต่อเรา"].map((s,i,a)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<a.length-1?`1px solid ${t.cardB}`:"none",cursor:"pointer"}}><span style={{fontSize:12,fontFamily:"'Noto Sans Thai',sans-serif"}}>{s}</span><span style={{color:t.sub}}>›</span></div>))}</Card>
    </div>
  );
}

// ═══════════════════════════════════════
// MODALS (Breathing, Night Support, CBTI, Premium)
// ═══════════════════════════════════════
function BreathingModal({t,close,petId}) {
  const phases=[{label:"หายใจเข้า...",sub:"4 วินาที",dur:4000,scale:1.3},{label:"กลั้น...",sub:"7 วินาที",dur:7000,scale:1.3},{label:"หายใจออก...",sub:"8 วินาที",dur:4000,scale:.7}];
  const [pi,setPi]=useState(0);const [cycle,setCycle]=useState(1);const ref=useRef(null);
  useEffect(()=>{ref.current=setTimeout(()=>setPi(p=>{const n=(p+1)%3;if(n===0)setCycle(c=>c+1);return n;}),phases[pi].dur);return()=>clearTimeout(ref.current);},[pi]);
  const ph=phases[pi];
  return (<div style={{position:"absolute",inset:0,zIndex:100,background:"linear-gradient(170deg,#0D1B2A,#1B2A44)",display:"flex",flexDirection:"column",alignItems:"center"}}>
    <div style={{width:"100%",padding:"14px 16px",display:"flex",justifyContent:"space-between"}}><div onClick={close} style={{cursor:"pointer",fontSize:18,color:"rgba(255,255,255,.65)"}}>✕</div><div style={{fontSize:13,fontWeight:700,color:"white",fontFamily:"'Noto Sans Thai',sans-serif"}}>🫁 หายใจ 4-7-8</div><div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>รอบ {cycle}</div></div>
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:28}}>
      <div style={{position:"relative",width:190,height:190,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{position:"absolute",borderRadius:"50%",border:"1px solid rgba(144,202,249,.15)",width:180,height:180,animation:"pulse 3s ease-in-out infinite"}}/><div style={{borderRadius:"50%",background:"radial-gradient(circle,rgba(100,181,246,.28),rgba(66,165,245,.08))",transition:`all ${ph.dur}ms ease`,width:ph.scale*140,height:ph.scale*140,position:"absolute"}}/><div style={{borderRadius:"50%",background:"radial-gradient(circle,rgba(144,202,249,.75),rgba(100,181,246,.35))",transition:`all ${ph.dur}ms ease`,width:ph.scale*100,height:ph.scale*100,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 25px rgba(100,181,246,.4)"}}><PetSVG pet={petId} size={50} state={pi===2?"happy":"happy"}/></div></div>
      <div style={{textAlign:"center"}}><div style={{fontSize:18,color:"white",fontWeight:700,fontFamily:"'Noto Sans Thai',sans-serif"}}>{ph.label}</div><div style={{fontSize:13,color:"rgba(255,255,255,.55)"}}>{ph.sub}</div></div>
      <div onClick={close} style={{background:"rgba(255,255,255,.08)",borderRadius:20,padding:"10px 28px",color:"rgba(255,255,255,.75)",fontSize:12,cursor:"pointer",border:"1px solid rgba(255,255,255,.15)",fontFamily:"'Noto Sans Thai',sans-serif"}}>หยุด</div>
    </div>
  </div>);
}

function NightSupportModal({t,close,petId,petNameStr}) {
  const [sel,setSel]=useState(null);const [timer,setTimer]=useState(0);
  useEffect(()=>{const iv=setInterval(()=>setTimer(s=>s+1),1000);return()=>clearInterval(iv);},[]);
  return (<div style={{position:"absolute",inset:0,zIndex:100,background:"#0A0E1A",display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 20px 20px"}}>
    <div onClick={close} style={{position:"absolute",top:14,left:16,cursor:"pointer",color:"rgba(255,224,178,0.4)",fontSize:14}}>← กลับ</div>
    <PetSVG pet={petId} size={100} state="happy" age="adult"/>
    <div style={{background:"rgba(255,224,178,0.08)",borderRadius:16,padding:"8px 16px",marginTop:12,fontSize:13,color:"rgba(255,224,178,0.7)",fontFamily:"'Noto Sans Thai',sans-serif"}}>ไม่เป็นไรนะ เราอยู่ตรงนี้ 🕯️</div>
    <div style={{fontSize:14,color:"rgba(255,224,178,0.5)",marginTop:24,marginBottom:12,fontFamily:"'Noto Sans Thai',sans-serif"}}>ตื่นมานานแค่ไหนแล้ว?</div>
    <div style={{display:"flex",gap:8,marginBottom:20}}>{["< 15 นาที","15-20 นาที","> 20 นาที"].map((o,i)=>(<div key={i} onClick={()=>setSel(i)} style={{padding:"10px 14px",borderRadius:14,background:sel===i?"rgba(255,224,178,0.15)":"rgba(255,224,178,0.05)",border:`1px solid ${sel===i?"rgba(255,224,178,0.3)":"rgba(255,224,178,0.08)"}`,color:"rgba(255,224,178,0.7)",fontSize:12,cursor:"pointer",fontFamily:"'Noto Sans Thai',sans-serif"}}>{o}</div>))}</div>
    {sel!==null&&<div className="fadeUp" style={{background:"rgba(255,224,178,0.05)",borderRadius:16,padding:16,width:"100%"}}><div style={{fontSize:13,color:"rgba(255,224,178,0.7)",textAlign:"center",lineHeight:1.6,fontFamily:"'Noto Sans Thai',sans-serif"}}>{sel===0?"ลองหายใจตาม Moonie นะ...":sel===1?"ลองลุกจากเตียงทำกิจกรรมเบาๆ สัก 10 นาที":"ไม่ต้องกังวลนะ มาทำ Body Scan ด้วยกัน 🧘"}</div>{sel===0&&<div style={{width:70,height:70,borderRadius:"50%",margin:"16px auto",background:"rgba(255,224,178,0.06)",border:"2px solid rgba(255,224,178,0.12)",animation:"breatheCircle 4s ease-in-out infinite"}}/>}</div>}
    <div style={{position:"absolute",bottom:30,fontSize:11,color:"rgba(255,224,178,0.25)",fontFamily:"'Noto Sans Thai',sans-serif"}}>ตื่นมาแล้ว {Math.floor(timer/60)}:{String(timer%60).padStart(2,"0")} นาที</div>
  </div>);
}

function CBTIModal({t,close}) {
  const weeks=[{n:1,title:"📚 เข้าใจการนอนของคุณ",s:"✅",done:true},{n:2,title:"⏰ Sleep Restriction",s:"✅",done:true},{n:3,title:"🛏️ Stimulus Control",s:"🔄",current:true},{n:4,title:"🧘 Relaxation Training",s:"🔒"},{n:5,title:"💭 Cognitive Restructuring",s:"🔒"},{n:6,title:"🎯 รวมทุกอย่าง",s:"🔒"}];
  return (<div style={{position:"absolute",inset:0,zIndex:100,background:t.id==="night"?"#0D1B2A":"#fff",overflowY:"auto",padding:16,color:t.text}}>
    <div onClick={close} style={{cursor:"pointer",fontSize:18,marginBottom:12}}>← กลับ</div>
    <div style={{fontSize:16,fontWeight:700,marginBottom:4,fontFamily:"'Noto Sans Thai',sans-serif"}}>โปรแกรม CBT-I 6 สัปดาห์ 🧠</div>
    <div style={{height:6,background:t.cardB,borderRadius:3,marginBottom:14,overflow:"hidden"}}><div style={{width:"50%",height:"100%",background:t.primary,borderRadius:3}}/></div>
    {weeks.map((w,i)=>(<Card key={i} t={t} style={{marginBottom:8,opacity:w.done||w.current?1:.45,borderColor:w.current?t.primary:t.cardB}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{w.s}</span><div><div style={{fontSize:10,color:t.sub}}>สัปดาห์ {w.n}</div><div style={{fontSize:12,fontWeight:700,fontFamily:"'Noto Sans Thai',sans-serif"}}>{w.title}</div></div></div>{w.current&&<div style={{marginTop:8,padding:"8px 10px",background:"rgba(128,128,128,.06)",borderRadius:10,fontSize:11,color:t.sub,fontFamily:"'Noto Sans Thai',sans-serif"}}>เรียนรู้เทคนิค Stimulus Control: ใช้เตียงเฉพาะการนอน</div>}</Card>))}
  </div>);
}

function PremiumModal({t,close}) {
  return (<div style={{position:"absolute",inset:0,zIndex:100,background:"rgba(0,0,0,.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end"}} onClick={e=>{if(e.target===e.currentTarget)close();}}>
    <div style={{width:"100%",background:"linear-gradient(170deg,#1a0533,#0d0a1a)",borderRadius:"22px 22px 0 0",padding:"22px 18px 30px",position:"relative"}}>
      <div onClick={close} style={{position:"absolute",top:14,right:16,cursor:"pointer",color:"rgba(255,255,255,.4)",fontSize:20}}>✕</div>
      <div style={{textAlign:"center",marginBottom:17}}><div style={{fontSize:26,marginBottom:4}}>✨</div><div style={{fontSize:17,fontWeight:700,color:"white"}}>Moonap Plus</div><div style={{fontSize:11,color:"rgba(255,255,255,.5)",fontFamily:"'Noto Sans Thai',sans-serif"}}>ปลดล็อกทุกฟีเจอร์</div></div>
      {["Night Support 24 ชม.","CBT-I 6 สัปดาห์","Dashboard เชิงลึก","นิทานก่อนนอนทั้งหมด","Hidden Missions","AI Chat ไม่จำกัด"].map((f,i)=>(<div key={i} style={{display:"flex",gap:9,padding:"7px 0",borderBottom:i<5?"1px solid rgba(255,255,255,.06)":"none"}}><span style={{color:"#66BB6A",fontSize:13}}>✅</span><span style={{fontSize:12,color:"rgba(255,255,255,.82)",fontFamily:"'Noto Sans Thai',sans-serif"}}>{f}</span></div>))}
      <div style={{textAlign:"center",margin:"16px 0 14px"}}><span style={{fontSize:18,fontWeight:700,color:"#FFD700"}}>฿129/เดือน</span><span style={{fontSize:11,color:"#66BB6A",marginLeft:8}}>หรือ ฿990/ปี</span></div>
      <div style={{background:"linear-gradient(135deg,#7B1FA2,#CE93D8)",borderRadius:14,padding:13,textAlign:"center",fontSize:14,color:"white",fontWeight:700,cursor:"pointer",marginBottom:11,fontFamily:"'Noto Sans Thai',sans-serif"}}>ลองฟรี 7 วัน</div>
      <div onClick={close} style={{textAlign:"center",fontSize:12,color:"rgba(255,255,255,.35)",cursor:"pointer",fontFamily:"'Noto Sans Thai',sans-serif"}}>ไว้ทีหลัง</div>
    </div>
  </div>);
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function App() {
  const [theme,setTheme]=useState("night");
  const [tab,setTab]=useState("home");
  const [modal,setModal]=useState(null);
  const [showOB,setShowOB]=useState(true);
  const [petId,setPetId]=useState("moonie");
  const [petNameStr,setPetNameStr]=useState("Moonie");
  const [petState,setPetState]=useState("happy"); // happy|sick|sparkling
  const [petAge,setPetAge]=useState("baby"); // baby|adult
  const [userName,setUserName]=useState("พลอย");
  const t=TH[theme];
  const now=new Date().toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit"});
  const tabs=[{id:"home",icon:"🏠",label:"Home"},{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"tools",icon:"🛠",label:"Tools"},{id:"missions",icon:"🎯",label:"Missions"},{id:"profile",icon:"👤",label:"Profile"}];
  const handleTab=id=>{setTab(id);setModal(null);};
  const close=()=>setModal(null);

  const petStates=["happy","sick","sparkling"];
  const petStateLabels={"happy":"😊 สดใส","sick":"🤒 ป่วย","sparkling":"✨ ออร่า"};

  return (
    <div style={{minHeight:"100vh",background:"#0f0f1a",display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 12px 20px",fontFamily:"'DM Sans','Noto Sans Thai',sans-serif"}}>
      <style>{css}</style>

      {/* Theme Switcher */}
      <div style={{display:"flex",gap:6,marginBottom:8,background:"rgba(255,255,255,.06)",borderRadius:22,padding:"5px 7px"}}>
        {Object.values(TH).map(th=>(<div key={th.id} onClick={()=>setTheme(th.id)} style={{padding:"6px 13px",borderRadius:16,cursor:"pointer",background:theme===th.id?th.primary:"transparent",color:theme===th.id?"white":"rgba(255,255,255,.45)",fontSize:12,fontWeight:theme===th.id?700:400,transition:"all .3s",display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:14}}>{th.icon}</span><span>{th.name}</span></div>))}
      </div>

      {/* Pet State + Age Switcher */}
      <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap",justifyContent:"center"}}>
        <div style={{display:"flex",gap:4,background:"rgba(255,255,255,.06)",borderRadius:16,padding:"3px 5px"}}>
          {petStates.map(s=>(<div key={s} onClick={()=>setPetState(s)} style={{padding:"4px 10px",borderRadius:12,cursor:"pointer",fontSize:11,background:petState===s?"rgba(255,255,255,.15)":"transparent",color:petState===s?"#fff":"rgba(255,255,255,.35)",transition:"all .2s"}}>{petStateLabels[s]}</div>))}
        </div>
        <div style={{display:"flex",gap:4,background:"rgba(255,255,255,.06)",borderRadius:16,padding:"3px 5px"}}>
          {[{id:"baby",l:"🐣 เด็ก"},{id:"adult",l:"🌟 โต"}].map(a=>(<div key={a.id} onClick={()=>setPetAge(a.id)} style={{padding:"4px 10px",borderRadius:12,cursor:"pointer",fontSize:11,background:petAge===a.id?"rgba(255,255,255,.15)":"transparent",color:petAge===a.id?"#fff":"rgba(255,255,255,.35)",transition:"all .2s"}}>{a.l}</div>))}
        </div>
      </div>

      {/* Phone Frame */}
      <div style={{width:370,maxWidth:"100%",height:780,borderRadius:44,border:"9px solid #232337",overflow:"hidden",position:"relative",background:t.bg,transition:"background .55s ease",display:"flex",flexDirection:"column",boxShadow:"0 28px 70px rgba(0,0,0,.7)"}}>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:110,height:30,background:"#1a1a2e",borderRadius:"0 0 18px 18px",zIndex:20}}/>
        <div style={{padding:"34px 18px 4px",display:"flex",justifyContent:"space-between",alignItems:"center",color:t.text}}>
          <div style={{fontSize:11,fontWeight:700}}>{now}</div>
          <div style={{fontSize:10,display:"flex",gap:5,alignItems:"center"}}><span>▪▪▪</span><span>WiFi</span><span>▮</span></div>
        </div>
        <div style={{padding:"4px 18px 6px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <Logo color={t.text} hiColor={t.primary} size={17} showMoon={true} moonBg={t.nav}/>
          <div style={{display:"flex",gap:11,alignItems:"center"}}>
            <span style={{fontSize:11,color:t.sub}}>{t.icon} {now}</span>
            <div style={{position:"relative"}}><span style={{fontSize:17,cursor:"pointer"}}>🔔</span><div style={{position:"absolute",top:-2,right:-2,width:7,height:7,borderRadius:"50%",background:"#EF5350"}}/></div>
            <span style={{fontSize:17,cursor:"pointer"}}>⚙️</span>
          </div>
        </div>
        <div style={{flex:1,overflow:"hidden",position:"relative"}}>
          {tab==="home"&&<HomeScreen t={t} setModal={setModal} setTab={setTab} petId={petId} petNameStr={petNameStr} petState={petState} petAge={petAge} userName={userName}/>}
          {tab==="dashboard"&&<DashboardScreen t={t}/>}
          {tab==="tools"&&<ToolsScreen t={t} setModal={setModal}/>}
          {tab==="missions"&&<MissionsScreen t={t} setModal={setModal}/>}
          {tab==="profile"&&<ProfileScreen t={t} setModal={setModal} petId={petId} petNameStr={petNameStr} petState={petState} petAge={petAge} userName={userName}/>}
          {modal==="aiChat"&&<AIChatScreen t={t} petId={petId} petNameStr={petNameStr} close={close} userName={userName}/>}
          {modal==="log"&&<AIChatScreen t={t} petId={petId} petNameStr={petNameStr} close={close} userName={userName}/>}
          {modal==="breath"&&<BreathingModal t={t} close={close} petId={petId}/>}
          {modal==="nightSupport"&&<NightSupportModal t={t} close={close} petId={petId} petNameStr={petNameStr}/>}
          {modal==="cbti"&&<CBTIModal t={t} close={close}/>}
          {modal==="premium"&&<PremiumModal t={t} close={close}/>}
          {showOB&&<Onboarding onDone={()=>setShowOB(false)} setPetChoice={setPetId} setGlobalPetName={setPetNameStr} setGlobalUserName={setUserName}/>}
        </div>
        <div style={{display:"flex",background:t.nav,backdropFilter:"blur(18px)",borderTop:`1px solid ${t.cardB}`,paddingBottom:6,transition:"background .55s ease"}}>
          {tabs.map(tb=>(<div key={tb.id} onClick={()=>handleTab(tb.id)} style={{flex:1,padding:"7px 3px 3px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",position:"relative"}}>{tab===tb.id&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:26,height:3,background:t.primary,borderRadius:3}}/>}<span style={{fontSize:19,opacity:tab===tb.id?1:.35,transition:"opacity .2s"}}>{tb.icon}</span><span style={{fontSize:9,color:tab===tb.id?t.primary:t.sub,fontWeight:tab===tb.id?700:400}}>{tb.label}</span></div>))}
        </div>
      </div>
      <div style={{marginTop:8,fontSize:11,color:"rgba(255,255,255,.25)",textAlign:"center",fontFamily:"'Noto Sans Thai',sans-serif"}}>MOONAP V3 · เลือกเพื่อน 3 ตัว · สลับ Baby/Adult + สดใส/ป่วย/ออร่า · AI Chat พิมพ์ได้</div>
    </div>
  );
}
