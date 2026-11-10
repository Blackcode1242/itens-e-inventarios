export const BASE = new URL("./", import.meta.url).href;
export const K_LISTA = "com.inventario.mestre/lista";
export const CH_ANUNCIO = "com.inventario.mestre/anuncio";
export const MODAL_ANUNCIO = "com.inventario.mestre/anuncio-modal";
export const K_PERS = "com.inventario.mestre/pers";
export const CH_USO = "com.inventario.mestre/uso";
export const K_TEMA = "com.inventario.mestre/tema";

/* Modelos prontos: o mestre pode aplicar e depois editar tudo na aba ⚙ */
export const PRESETS = {
  "Fantasia": { tipos: ["Arma", "Armadura", "Poção", "Pergaminho", "Ferramenta", "Tesouro", "Item Mágico", "Variado"],
    raridades: [["Comum", "#9aa0b8"], ["Incomum", "#4caf70"], ["Raro", "#4a8fe0"], ["Muito raro", "#a259e6"], ["Lendário", "#e8a23a"]] },
  "Ficção científica": { tipos: ["Arma", "Armadura", "Implante", "Gadget", "Munição", "Dados", "Variado"],
    raridades: [["Padrão", "#9aa0b8"], ["Militar", "#4caf70"], ["Experimental", "#3fc8e0"], ["Protótipo", "#e0569a"], ["Relíquia", "#e8a23a"]] },
  "Terror / Investigação": { tipos: ["Arma", "Acessório", "Explosivo", "Item Operacional", "Item Amaldiçoado", "Documento", "Variado"],
    raridades: [["Cat. 0", "#9aa0b8"], ["Cat. I", "#4caf70"], ["Cat. II", "#4a8fe0"], ["Cat. III", "#a259e6"], ["Cat. IV", "#e05050"]] }
};

/* ---------- temas do anúncio ---------- */
export const FONTES = {
  "Clássica": "Georgia,'Times New Roman',serif",
  "Manuscrita": "'Segoe Script','Brush Script MT','Comic Sans MS',cursive",
  "Gótica": "'Old English Text MT','Palatino Linotype',Georgia,serif",
  "Tecnológica": "'Lucida Console',Consolas,monospace",
  "Máquina de escrever": "'Courier New',Courier,monospace",
  "Moderna": "system-ui,sans-serif"
};
export const TEMAS = {
  "Padrão": { bg: "#161824", bg2: "#04050a", txt: "#ffffff", acc: "#ffffff", fonteT: "Clássica", fonteD: "Clássica", moldura: "nenhuma", vinheta: 0, brilho: false, tremor: false, scan: false, fundoImg: "" },
  "Pergaminho": { bg: "#d9c49a", bg2: "#a8895a", txt: "#3b2614", acc: "#7a4a1d", fonteT: "Gótica", fonteD: "Clássica", moldura: "dupla", vinheta: 45, brilho: false, tremor: false, scan: false, fundoImg: "" },
  "Neon": { bg: "#0a0620", bg2: "#000000", txt: "#e6fbff", acc: "#00e5ff", fonteT: "Tecnológica", fonteD: "Tecnológica", moldura: "linha", vinheta: 20, brilho: true, tremor: false, scan: true, fundoImg: "" },
  "Terror": { bg: "#2a0a0a", bg2: "#000000", txt: "#e8dcd0", acc: "#b01818", fonteT: "Máquina de escrever", fonteD: "Máquina de escrever", moldura: "linha", vinheta: 80, brilho: false, tremor: true, scan: false, fundoImg: "" }
};
export function limparTema(t) {
  const b = TEMAS["Padrão"], o = {}; t = t || {};
  for (const k of ["bg", "bg2", "txt", "acc"]) o[k] = /^#[0-9a-f]{6}$/i.test(t[k]) ? t[k] : b[k];
  for (const k of ["fonteT", "fonteD"]) o[k] = FONTES[t[k]] ? t[k] : b[k];
  o.moldura = ["nenhuma", "linha", "dupla"].includes(t.moldura) ? t.moldura : "nenhuma";
  o.vinheta = Math.min(100, Math.max(0, +t.vinheta || 0));
  for (const k of ["brilho", "tremor", "scan"]) o[k] = !!t[k];
  o.fundoImg = /^https:\/\//.test(t.fundoImg) ? t.fundoImg : "";
  return o;
}
export function aplicarTema(t) {
  t = limparTema(t);
  const set = (k, v) => document.documentElement.style.setProperty(k, v);
  const img = t.fundoImg ? `url("${t.fundoImg.replace(/["()\\]/g, "")}")` : "none";
  set("--t-bg", t.bg); set("--t-bg2", t.bg2); set("--t-txt", t.txt); set("--t-acc", t.acc);
  set("--t-ft", FONTES[t.fonteT]); set("--t-fd", FONTES[t.fonteD]);
  set("--fundoImg", img); set("--ov-a", t.fundoImg ? "55%" : "94%");
  set("--t-borda", t.moldura === "linha" ? `2px solid ${t.acc}` : t.moldura === "dupla" ? `5px double ${t.acc}` : "0");
  set("--t-vig", String(t.vinheta / 100));
  set("--t-scan", t.scan ? "repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 1px, transparent 1px 3px)" : "none");
  set("--t-sombra", t.brilho ? `0 0 10px ${t.acc}, 0 0 30px ${t.acc}` : "0 2px 18px rgba(0,0,0,.6)");
  document.documentElement.classList.toggle("tremor", t.tremor);
}
export const CFG_PADRAO = { ...PRESETS["Fantasia"], duracao: 8, tema: TEMAS["Padrão"], temas: {} };
export const corDe = (cfg, nome) => (cfg.raridades.find(r => r[0] === nome) || [0, "#9aa0b8"])[1];
export const parseProps = t => String(t || "").split("\n").map(l => l.trim()).filter(Boolean)
  .map(l => { const i = l.indexOf(":"); return i < 0 ? [l, ""] : [l.slice(0, i).trim(), l.slice(i + 1).trim()]; });
export const metaTexto = it => [it.tipo, it.raridade, it.peso ? "Peso " + String(it.peso).replace(".", ",") : "", it.qtd > 1 ? "×" + it.qtd : "", it.max ? `${it.rot || "Usos"} ${it.at ?? it.max}/${it.max}` : "", it.valor].filter(Boolean).join(" · ");
export const detalhesHTML = it => (it.props || []).map(p => `<div class="pr"><span>${esc(p[0])}</span>${p[1] ? "<b>" + esc(p[1]) + "</b>" : ""}</div>`).join("")
  + ((it.tags || []).length ? `<div class="tg">${it.tags.map(t => `<i>${esc(t)}</i>`).join("")}</div>` : "");
export const novoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Mantém só negrito, itálico e quebras de linha. */
export function sanitize(html) {
  const doc = new DOMParser().parseFromString("<body>" + (html || "") + "</body>", "text/html");
  const out = [];
  const termBr = () => out.length && out[out.length - 1] === "<br>";
  (function walk(node) {
    node.childNodes.forEach(n => {
      if (n.nodeType === 3) { out.push(esc(n.nodeValue)); return; }
      if (n.nodeType !== 1) return;
      const t = n.tagName.toLowerCase();
      const fw = n.style && n.style.fontWeight;
      const negrito = t === "b" || t === "strong" || fw === "bold" || parseInt(fw, 10) >= 600;
      const italico = t === "i" || t === "em" || (n.style && n.style.fontStyle === "italic");
      if (t === "script" || t === "style") return;
      if (t === "br") { out.push("<br>"); return; }
      if (t === "div" || t === "p") { if (out.length && !termBr()) out.push("<br>"); walk(n); return; }
      if (negrito) out.push("<b>");
      if (italico) out.push("<i>");
      walk(n);
      if (italico) out.push("</i>");
      if (negrito) out.push("</b>");
    });
  })(doc.body);
  return out.join("").replace(/(<br>)+$/, "");
}

export function htmlParaTexto(html) {
  const d = document.createElement("div");
  d.innerHTML = (html || "").replace(/<br\s*\/?>/gi, "\n");
  return d.textContent;
}

export async function copiarTexto(texto) {
  try { await navigator.clipboard.writeText(texto); return true; } catch (e) {}
  const t = document.createElement("textarea");
  t.value = texto; t.style.cssText = "position:fixed;left:-9999px;top:0";
  document.body.appendChild(t); t.select();
  let ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
  t.remove(); return ok;
}

/* Copia mantendo o negrito (text/html + text/plain). */
export async function copiarRico(html) {
  const limpo = sanitize(html);
  const plano = htmlParaTexto(limpo);
  try {
    await navigator.clipboard.write([new ClipboardItem({
      "text/html": new Blob([limpo], { type: "text/html" }),
      "text/plain": new Blob([plano], { type: "text/plain" })
    })]);
    return true;
  } catch (e) {}
  // Plano B: seleciona um trecho renderizado e copia (também preserva a formatação)
  const d = document.createElement("div");
  d.innerHTML = limpo;
  d.style.cssText = "position:fixed;left:-9999px;top:0;white-space:pre-wrap";
  document.body.appendChild(d);
  const r = document.createRange(); r.selectNodeContents(d);
  const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  let ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
  s.removeAllRanges(); d.remove(); return ok;
}

export function holoHTML(src) {
  const s = esc(src);
  return `<div class="holo"><div class="holo-in"><img class="h-base" src="${s}" alt="" draggable="false"><img class="h-glow" src="${s}" alt="" draggable="false"></div></div>`;
}

export function initHolo(holo) {
  const inner = holo.querySelector(".holo-in");
  const reset = () => {
    holo.classList.remove("ativo"); holo.classList.add("solto");
    ["--rx", "--ry", "--mx", "--my", "--hue"].forEach(v => inner.style.removeProperty(v));
  };
  const mover = e => {
    const r = holo.getBoundingClientRect();
    const px = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    const py = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
    holo.classList.add("ativo"); holo.classList.remove("solto");
    inner.style.setProperty("--ry", ((px - 0.5) * 34).toFixed(1));
    inner.style.setProperty("--rx", ((0.5 - py) * 34).toFixed(1));
    inner.style.setProperty("--mx", (px * 100).toFixed(1));
    inner.style.setProperty("--my", (py * 100).toFixed(1));
    inner.style.setProperty("--hue", (px * 140 - 30).toFixed(0));
  };
  holo.addEventListener("pointermove", mover);
  holo.addEventListener("pointerdown", e => { try { holo.setPointerCapture(e.pointerId); } catch (_) {} mover(e); });
  holo.addEventListener("pointerleave", reset);
  holo.addEventListener("pointerup", e => { if (e.pointerType !== "mouse") reset(); });
  holo.addEventListener("pointercancel", reset);
}
