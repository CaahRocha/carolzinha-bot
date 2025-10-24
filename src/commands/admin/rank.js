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
      if (!remoteJid?.endsWith('@g.us')) {
        await sendErrorReply('❌ Este comando só pode ser usado em grupos.');
        return;
      }

      // Verifica permissão de admin usando groupMetadata
      let autorizado = false;
      try {
        const meta = await socket.groupMetadata(remoteJid);
        const participant = meta?.participants?.find(p => p.id === userJid);
        autorizado = participant?.admin === 'admin' || participant?.admin === 'superadmin';
      } catch (e) {
        errorLog(`[RANK] Erro ao verificar permissões: ${e.message}`);
        autorizado = false;
      }

      if (!autorizado) {
        await sendErrorReply('❌ Apenas administradores podem usar este comando.');
        return;
      }

      // Busca contagem de mensagens
      const contagem = await getMessageCountByGroup(remoteJid);
      
      if (!contagem || Object.keys(contagem).length === 0) {
        await sendText('📊 Ainda não há mensagens registradas para gerar o ranking.');
        return;
      }

      // Obtém membros atuais do grupo
      const metadata = await socket.groupMetadata(remoteJid);
      const membrosAtuais = new Set(
        metadata.participants.map(p => p.id)
      );

      // Filtra e ordena ranking
      const ranking = Object.entries(contagem)
        .filter(([jid]) => membrosAtuais.has(jid))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      if (ranking.length === 0) {
        await sendText('📊 Nenhum membro atual tem mensagens registradas.');
        return;
      }

      // Formata mensagem
      const mentions = ranking.map(([jid]) => jid);
      const texto = ranking
        .map(([jid, count], index) => 
          `🏆 ${index + 1}º - @${onlyNumbers(jid)} — ${count} mensagens`
        )
        .join('\n');

      await sendText(`📊 *Top 5 mais comunicativos do grupo:*\n\n${texto}`, mentions);

    } catch (err) {
      errorLog(`Erro no comando rank: ${err.message}`);
      await sendErrorReply('❌ Erro ao gerar o ranking.');
    }
  }
};