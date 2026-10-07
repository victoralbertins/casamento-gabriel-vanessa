(function () {
  const cfg = window.CONFIG || {};
  const EVENTO = new Date("2027-03-13T17:00:00-03:00");
  const FIM = new Date("2027-03-14T02:00:00-03:00");

  /* ---------- contagem regressiva ---------- */
  const elDias = document.getElementById("cd-dias");
  const elHoras = document.getElementById("cd-horas");
  const elMin = document.getElementById("cd-min");

  function atualizarContagem() {
    const ms = Math.max(0, EVENTO - Date.now());
    const min = Math.floor(ms / 60000);
    elDias.textContent = Math.floor(min / 1440);
    elHoras.textContent = Math.floor((min % 1440) / 60);
    elMin.textContent = min % 60;
  }
  atualizarContagem();
  setInterval(atualizarContagem, 30000);

  /* ---------- salvar na agenda ---------- */
  const titulo = "Casamento Gabriel & Vanessa";
  const descricao = "Cerimônia às 17h · Recepção às 19h na Chácara Dornellas. O convite oficial será enviado posteriormente.";
  const local = "Vicência - PE";
  const utc = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  document.getElementById("btn-google").href =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(titulo) +
    "&dates=" + utc(EVENTO) + "/" + utc(FIM) +
    "&details=" + encodeURIComponent(descricao) +
    "&location=" + encodeURIComponent(local);

  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Gabriel e Vanessa//Pre-save//PT",
    "BEGIN:VEVENT",
    "UID:casamento-gabriel-vanessa-20270313",
    "DTSTAMP:" + utc(new Date()),
    "DTSTART:" + utc(EVENTO), "DTEND:" + utc(FIM),
    "SUMMARY:" + titulo, "DESCRIPTION:" + descricao, "LOCATION:" + local,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  document.getElementById("btn-ics").href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);

  /* ---------- formulário ---------- */
  document.getElementById("prazo").textContent = cfg.PRAZO || "a data combinada";

  const form = document.getElementById("form");
  const erro = document.getElementById("erro");
  const botao = document.getElementById("enviar");
  const obrigado = document.getElementById("obrigado");

  form.addEventListener("input", (e) => e.target.classList.remove("invalido"));

  function mostrarErro(msg, campo) {
    erro.textContent = msg;
    erro.hidden = false;
    if (campo) { campo.classList.add("invalido"); campo.focus(); }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    erro.hidden = true;

    const nome = form.nome.value.trim();
    const presenca = form.presenca.value;

    if (nome.length < 3) return mostrarErro("Por favor, informe seu nome completo.", form.nome);
    if (!presenca) return mostrarErro("Conte pra gente se você poderá vir.");

    const vem = presenca === "sim";
    const dados = {
      nome,
      presenca: vem ? "Sim" : "Não",
      mensagem: form.mensagem.value.trim(),
      enviadoEm: new Date().toISOString(),
    };

    botao.disabled = true;
    botao.querySelector("span").textContent = "Enviando…";

    try {
      if (cfg.ENDPOINT) {
        // Apps Script não devolve cabeçalhos CORS; "no-cors" envia mesmo assim.
        await fetch(cfg.ENDPOINT, { method: "POST", mode: "no-cors", body: new URLSearchParams(dados) });
      } else {
        console.warn("[RSVP] ENDPOINT não configurado em config.js — modo demonstração.", dados);
        await new Promise((r) => setTimeout(r, 600));
      }

      const primeiroNome = nome.split(/\s+/)[0];
      document.getElementById("obrigado-titulo").textContent = vem ? "Que alegria!" : "Sentiremos sua falta";
      document.getElementById("obrigado-texto").textContent = vem
        ? `${primeiroNome}, sua presença foi registrada. Mal podemos esperar para celebrar com você no dia 13 de março!`
        : `${primeiroNome}, obrigado por nos avisar. Você estará em nossos corações nesse dia.`;
      form.hidden = true;
      obrigado.hidden = false;
      obrigado.focus();
    } catch (err) {
      console.error(err);
      mostrarErro("Não foi possível enviar agora. Verifique sua conexão e tente novamente.");
    } finally {
      botao.disabled = false;
      botao.querySelector("span").textContent = "Confirmar presença";
    }
  });

  document.getElementById("nova").addEventListener("click", () => {
    form.reset();
    obrigado.hidden = true;
    form.hidden = false;
    form.nome.focus();
  });
})();
