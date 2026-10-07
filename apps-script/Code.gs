/**
 * Recebe as confirmações do site e grava na planilha onde este script está.
 * Como usar: veja a seção "Salvando as respostas" no README.
 */
const ABA = "Confirmações";
const COLUNAS = ["Recebido em", "Nome", "WhatsApp", "Presença", "Pessoas", "Acompanhantes", "Mensagem"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = e.parameter;
    abaConfirmacoes_().appendRow([
      new Date(),
      limpar_(p.nome),
      limpar_(p.telefone),
      limpar_(p.presenca),
      Number(p.quantidade) || 0,
      limpar_(p.acompanhantes),
      limpar_(p.mensagem),
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("RSVP Gabriel & Vanessa: ok");
}

function abaConfirmacoes_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let aba = ss.getSheetByName(ABA);
  if (!aba) {
    aba = ss.insertSheet(ABA);
    aba.appendRow(COLUNAS);
    aba.setFrozenRows(1);
    aba.getRange(1, 1, 1, COLUNAS.length).setFontWeight("bold");
  }
  return aba;
}

// Evita que um texto começando com "=", "+", "-" ou "@" vire fórmula na planilha.
function limpar_(v) {
  const s = String(v || "").slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
