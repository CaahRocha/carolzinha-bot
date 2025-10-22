const { onlyNumbers } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const { ASSETS_DIR, PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "casal",
  description: "Forma um casal entre dois membros aleatórios do grupo.",
  commands: ["casal", "ship", "namoro"],
  usage: `${PREFIX}casal`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendVideoFromFile, sendErrorReply, socket, remoteJid }) => {
    try {
      const { participants } = await socket.groupMetadata(remoteJid);

      const membros = participants
        .map(p => p.id)
        .filter(id => id.endsWith("@s.whatsapp.net") || id.endsWith("@lid"));

      if (membros.length < 2) {
        await sendErrorReply("💕 ❌ Erro! Não há membros suficientes no grupo para formar um casal.");
        return;
      }

      // Sorteia dois membros diferentes
      let pessoa1, pessoa2;
      do {
        pessoa1 = membros[Math.floor(Math.random() * membros.length)];
        pessoa2 = membros[Math.floor(Math.random() * membros.length)];
      } while (pessoa1 === pessoa2);

      const nome1 = onlyNumbers(pessoa1);
      const nome2 = onlyNumbers(pessoa2);

      await sendVideoFromFile(
        path.resolve(ASSETS_DIR, "images", "funny", "casal.mp4"),
        `💘 Novo casal formado!\n\n@${nome1} ❤️ @${nome2}\nSerá que vai dar namoro? 😍`,
        [pessoa1, pessoa2]
      );
    } catch (err) {
      console.error("Erro no comando casal:", err);
      await sendErrorReply("💕 ❌ Erro interno ao tentar formar o casal.");
    }
  },
};