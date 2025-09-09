
const $ = (s)=>document.querySelector(s);
const save=(k,v)=>localStorage.setItem(k, JSON.stringify(v));
const load=(k,def=null)=>{ try{ return JSON.parse(localStorage.getItem(k)) ?? def }catch{ return def } };

// IDs in the form
const fields = ["rank","college","dir_people","dir_officers","courses","milpol","shared","code","guideno","female"];
fields.forEach(id=>{
  const el = $("#"+id);
  const v = load("field_"+id);
  if(v) el.value = v;
  el.addEventListener("change", ()=> save("field_"+id, el.value));
});

function partIf(val){
  return (val && val !== "لا يوجد") ? val : null;
}

function build(){
  const parts = [];
  const add = (val)=>{ const v = partIf(val); if(v) parts.push(v); };

  add($("#rank").value);
  add($("#college").value);
  add($("#dir_people").value);
  add($("#dir_officers").value);
  add($("#courses").value);
  add($("#milpol").value);
  add($("#shared").value);
  const code = $("#code").value;
  if (code && code !== "لا يوجد") parts.push("كود " + code);

  const guide = $("#guideno").value;
  if (guide && guide !== "لا يوجد") parts.push("توجيه " + guide);

  add($("#female").value);

  const checks = [];
  if($("#branch").checked) checks.push("الفرع");
  if($("#vehicle").checked) checks.push("أداء مركبة");
  if($("#rankUp").checked) checks.push("استلام رتبة");
  if($("#modify").checked) checks.push("تعديل وتزويد");
  if($("#punish").checked) checks.push("عقوبة");

  let out = parts.join(" – ");
  if(checks.length) out += (out? " | " : "") + checks.join(" • ");
  $("#out").textContent = out;
  save("out_text", out);
  return out;
}

$("#build").addEventListener("click", build);
$("#copy").addEventListener("click", ()=> navigator.clipboard.writeText(build()||""));
$("#clear").addEventListener("click", ()=>{
  fields.forEach(id=>{ $("#"+id).selectedIndex = 0; save("field_"+id, $("#"+id).value); });
  ["branch","vehicle","rankUp","modify","punish"].forEach(id=> $("#"+id).checked=false);
  $("#out").textContent = ""; save("out_text","");
});

$("#out").textContent = load("out_text","");
