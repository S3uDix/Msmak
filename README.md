<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>جاهز</title>
  <style>
    :root{--bg:#0f1115;--card:#151821;--text:#e7e9ee;--muted:#9aa3b2;--accent:#46b3ff;}
    *{box-sizing:border-box} html,body{height:100%}
    body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,"Noto Kufi Arabic",Tahoma,Arial,Helvetica;
         background:linear-gradient(180deg,#0f1115,#0b0d12 40%,#0f1115);
         color:var(--text)}
    header{position:sticky;top:0;background:#0f1115cc;backdrop-filter:blur(6px);border-bottom:1px solid #202430;z-index:10}
    .wrap{max-width:900px;margin:0 auto;padding:20px;display:flex;align-items:center;gap:10px}
    .title h1{margin:10px 0;font-size:22px}
    .logo{height:40px}
    .card{background:var(--card);border:1px solid #232838;border-radius:12px;padding:16px;box-shadow:0 6px 24px #00000040}
    h2{font-size:18px;margin:0 0 12px}
    label{display:block;font-size:13px;color:var(--muted);margin-bottom:6px}
    select,input,button{width:100%;padding:10px 12px;border-radius:10px;border:1px solid #2a3040;background:#0f121a;color:var(--text)}
    select,input{height:42px}
    button{cursor:pointer;background:#182030;border-color:#2a364a}
    button.primary{background:#124e7a;border-color:#17659f}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
    .output{font-weight:600;padding:12px;border:1px dashed #334055;border-radius:10px;background:#0d1218;min-height:44px}
    .actions{display:flex;gap:10px;margin-top:10px}
    small{color:var(--muted)}
    footer{opacity:.8;padding:30px 0;text-align:center;color:#9aa3b2}
    .chk-row{display:flex;align-items:center;gap:8px}
    .chk-row input{width:auto;height:auto}
  </style>
</head>
<body>
  <header>
    <div class="wrap">
      <img src="logo.png" alt="جاهز" class="logo"/>
      <h1>جاهز</h1>
    </div>
  </header>

  <main class="wrap" style="flex-direction:column;align-items:stretch">
    <section class="card">
      <h2>المسميات</h2>
      <div class="row">
        <div>
          <label>توجيهك</label>
          <select id="rank"></select>
        </div>
        <div>
          <label>رقم توجيهك</label>
          <select id="directive"></select>
        </div>
      </div>
      <div class="row">
        <div>
          <label>رتب اللاعب المعتمد إن وجد</label>
          <select id="playerRank"></select>
        </div>
        <div>
          <label>كودك</label>
          <input id="code" placeholder="اكتب الكود هنا">
        </div>
      </div>
      <div class="row">
        <div class="chk-row">
          <input type="checkbox" id="ghafwa" />
          <label for="ghafwa" style="margin:0">(غفوة)</label>
          <input type="checkbox" id="sha" />
          <label for="sha" style="margin:0">(ش.ع)</label>
        </div>
      </div>
      <div class="actions">
        <button class="primary" id="makeName">إظهار الاسم</button>
        <button id="copyName">نسخ</button>
        <button id="clearName">مسح</button>
      </div>
      <div class="output" id="nameOut"></div>
      <small>💡 عدّل القوائم من داخل الكود (قسم <b>CONFIG</b>) لتضع مسمياتك الخاصة.</small>
    </section>
  </main>

  <footer>
    نسخة مخصصة – تعمل دون اتصال. لاستضافة: ارفع المجلد إلى GitHub Pages أو أي استضافة ثابتة.
  </footer>

  <script>
    // ================= CONFIG =================
    const SPECIAL_RANKS = [
      "قائد الامن العام",
      "نائب قائد الامن العام",
      "مساعد قائد الامن العام",
      "نائب مساعد القائد للامن العام",
      "قائد قوات أمن الطرق",
      "نائب قائد قوات أمن الطرق",
      "مساعد قائد قوات أمن الطرق"
    ];
    const OTHER_RANKS = [
      "سين","باء","لام","جيم","دال","جنوب","غرب","ساهر","رصد","ضبط",
      "سهم","درع","رعد","شهاب","خفر","تحكم","ميم","سري","نقل سجون","حماية",
      "جنائي","سير","الشرطة العسكرية","ضبط","م قيادة","م سين","م باء",
      "م جنوب","م غرب","م ساهر","م رعد","م شهاب"
    ];
    const RANKS = [...SPECIAL_RANKS, ...OTHER_RANKS];
    const DIRECTIVES = ["", ...Array.from({length:29},(_,i)=> (i+1).toString())];
    const PLAYER_RANKS = ["","CD","CC","CB","CA"];
    // ============================================

    const $ = (sel)=>document.querySelector(sel);
    const fill = (id, arr)=>{
      const el = $(id);
      el.innerHTML = "";
      arr.forEach(v=>{
        const opt = document.createElement("option");
        opt.value = v; opt.textContent = v;
        el.appendChild(opt);
      });
    };
    fill("#rank", RANKS);
    fill("#directive", DIRECTIVES);
    fill("#playerRank", PLAYER_RANKS);

    const nameOut = $("#nameOut");
    $("#makeName").onclick = ()=>{
      const t = $("#rank").value;
      if(SPECIAL_RANKS.includes(t)){
        nameOut.textContent = ""; 
        return;
      }
      const n = $("#directive").value;
      let result = t + (n ? (" " + n) : "");
      const addGhafwa = $("#ghafwa").checked;
      const addSha = $("#sha").checked;
      if(addGhafwa) result += " (غفوة)";
      if(addSha) result += " (ش.ع)";
      const pr = $("#playerRank").value;
      if(pr) result += " | " + pr;
      const code = $("#code").value.trim();
      if(code) result += " | " + code;
      nameOut.textContent = result;
    };
    $("#copyName").onclick = async ()=>{
      await navigator.clipboard.writeText(nameOut.textContent || "");
      $("#copyName").textContent = "تم النسخ ✓";
      setTimeout(()=>$("#copyName").textContent="نسخ",1200);
    };
    $("#clearName").onclick = ()=>{ nameOut.textContent=""; $("#code").value=""; $("#sha").checked=false; $("#ghafwa").checked=false; $("#playerRank").value=""; };
  </script>
</body>
</html>
