const { onlyNumbers } = require(`${BASE_DIR}/utils`);
const { getMessageCountByGroup } = require(`${BASE_DIR}/utils/database`);
const { isAdmin } = require(`${BASE_DIR}/index`);
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "rank",
  description: "Mostra o top 5 dos membros mais comunicativos do grupo.",
  commands: ["rank", "ranking", "top5"],
  usage: `${PREFIX}rank`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */

  handle: async ({ sendText, sendErrorReply, socket, remoteJid, userJid }) => {
    try {
      const autorizado = await isAdmin({ remoteJid, userJid, socket });

      if (!autorizado) {
        await sendErrorReply("❌ Apenas administradores podem usar este comando.");
        return;
      }

      const metadata = await socket.groupMetadata(remoteJid);
      const participants = metadata && metadata.participants ? metadata.participants : [];
      const membrosDoGrupo = participants.map(p => p.id);

      // aguarda a função que pode ser assíncrona e garante objeto vazio se não houver dados
      const contagem = (await getMessageCountByGroup(remoteJid)) || {};

      const ranking = Object.entries(contagem)
        .filter(([jid]) => membrosDoGrupo.includes(jid))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      if (ranking.length === 0) {
        await sendText("📊 Ainda não há dados suficientes para gerar o ranking.");
        return;
      }

      const mentions = ranking.map(([jid]) => jid);
      const texto = ranking
        .map(([jid, count], index) => `🏆 ${index + 1}º - @${onlyNumbers(jid)} (${count} mensagens)`)
        .join("\n");

      await sendText(`📊 *Top 5 mais comunicativos do grupo:*\n\n${texto}`, mentions);
    } catch (err) {
      console.error("Erro no comando rank:", err);
      await sendErrorReply("❌ Erro ao gerar o ranking.");
    }
  },
};