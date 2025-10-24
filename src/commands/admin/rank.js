const { onlyNumbers } = require(`${BASE_DIR}/utils`);
const { getMessageCountByGroup } = require(`${BASE_DIR}/utils/database`);
const { PREFIX } = require(`${BASE_DIR}/config`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);

module.exports = {
  name: "rank",
  description: "Gera o top 5 dos membros mais comunicativos do grupo (somente admins).",
  commands: ["rank", "ranking", "top5"],
  type: "admin",
  usage: `${PREFIX}rank`,

  handle: async ({ sendText, sendErrorReply, socket, remoteJid, userJid }) => {
    try {
      if (!remoteJid?.endsWith("@g.us")) {
        await sendErrorReply("❌ Este comando só pode ser usado em grupos.");
        return;
      }

      // verifica permissão de admin
      let autorizado = false;
      try {
        const meta = await socket.groupMetadata(remoteJid);
        const participant = meta?.participants?.find((p) => p.id === userJid);
        autorizado = participant?.admin === "admin" || participant?.admin === "superadmin";
      } catch (e) {
        errorLog(`[RANK] Erro ao verificar permissões: ${e?.message || e}`);
        autorizado = false;
      }

      if (!autorizado) {
        await sendErrorReply("❌ Apenas administradores podem usar este comando.");
        return;
      }

      // obtém contagem do DB (pode ser sync/async e vários formatos)
      let contagemRaw;
      try {
        contagemRaw = await getMessageCountByGroup(remoteJid);
      } catch (e) {
        errorLog(`[RANK] Erro ao obter contagem do DB: ${e?.message || e}`);
        contagemRaw = null;
      }

      if (!contagemRaw || (typeof contagemRaw === "object" && Object.keys(contagemRaw).length === 0)) {
        await sendText("📊 Ainda não há mensagens registradas para gerar o ranking.");
        return;
      }

      // normaliza diferentes formatos para array de pares [jidOrKey, count]
      let entries = [];
      if (contagemRaw instanceof Map) {
        entries = Array.from(contagemRaw.entries());
      } else if (Array.isArray(contagemRaw)) {
        entries = contagemRaw;
      } else if (typeof contagemRaw === "object") {
        entries = Object.entries(contagemRaw);
      } else {
        errorLog(`[RANK] Formato de contagem inesperado: ${typeof contagemRaw}`);
        await sendErrorReply("❌ Não foi possível processar os dados de contagem.");
        return;
      }

      // agrega contagens por número (somente dígitos) para suportar chaves em formatos diferentes
      const countsByNumber = {};
      for (const [key, cnt] of entries) {
        const jidStr = String(key || "");
        const num = onlyNumbers(jidStr);
        if (!num) continue;
        countsByNumber[num] = (countsByNumber[num] || 0) + Number(cnt || 0);
      }

      // obtém participantes atuais do grupo e monta candidatos ao ranking
      const metadata = await socket.groupMetadata(remoteJid);
      const participants = metadata?.participants || [];
      const rankingCandidates = [];

      for (const p of participants) {
        const jid = p.id;
        const num = onlyNumbers(jid);
        const count = countsByNumber[num] || 0;
        if (count > 0) {
          rankingCandidates.push({ jid, num, count });
        }
      }

      if (rankingCandidates.length === 0) {
        await sendText("📊 Nenhum membro atual tem mensagens registradas.");
        return;
      }

      // ordena e pega top 5
      const ranking = rankingCandidates.sort((a, b) => b.count - a.count).slice(0, 5);

      // prepara mentions (usa JID completo) e texto
      const mentions = ranking.map((r) => (r.jid.includes("@") ? r.jid : `${r.jid}@s.whatsapp.net`));
      const texto = ranking
        .map((r, i) => `🏆 ${i + 1}º - @${r.num} — ${r.count} mensagens`)
        .join("\n");

      await sendText(`📊 *Top 5 mais comunicativos do grupo:*\n\n${texto}`, mentions);
    } catch (err) {
      errorLog(`Erro no comando rank: ${err?.message || err}`);
      await sendErrorReply("❌ Erro ao gerar o ranking.");
    }
  },
};