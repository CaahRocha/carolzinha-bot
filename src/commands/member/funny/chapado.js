const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { onlyNumbers, toUserJidOrLid } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const fs = require("node:fs");
const { ASSETS_DIR } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "chapado",
  description: "Mede o nível de chapação de alguém (com humor e leveza).",
  commands: ["chapado", "brisado", "fumado"],
  usage: `${PREFIX}chapado @usuario`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    sendVideoFromFile,
    sendErrorReply,
    userJid,
    replyJid,
    args,
    isReply,
  }) => {
    const targetJid = isReply ? replyJid : args[0] ? toUserJidOrLid(args[0]) : userJid;

    if (!targetJid) {
      await sendErrorReply("Você precisa mencionar ou marcar um membro!");
      return;
    }

    const targetNumber = onlyNumbers(targetJid);
    const porcentagem = Math.floor(Math.random() * 101); // 0 a 100%

    let categoria;
    let piada;

    if (porcentagem <= 20) {
      categoria = "careta convicto";
      piada = "🧘‍♂️ Nem café toma, vive na paz e na meditação.";
    } else if (porcentagem <= 50) {
      categoria = "curioso da brisa";
      piada = "😶‍🌫️ Já deu umas tragadas, mas ainda pergunta se vai dar onda.";
    } else if (porcentagem <= 80) {
      categoria = "brisado funcional";
      piada = "🌬️ Trabalha chapado, mas entrega tudo no prazo.";
    } else {
      categoria = "nuvem ambulante";
      piada = "☁️ Vive em outra dimensão. Só volta quando acaba o estoque.";
    }

    const mensagem = `🌿 O nível de chapação de @${targetNumber} é *${porcentagem}%*.\n💬 Categoria: *${categoria.toUpperCase()}*\n\n${piada}`;

    const videoPath = path.resolve(ASSETS_DIR, "images", "funny", "chapado.mp4"); // ✅ caminho corrigido

    if (!fs.existsSync(videoPath)) {
      await sendErrorReply("Vídeo 'chapado.mp4' não encontrado. Verifique o caminho ou o arquivo.");
      return;
    }

    await sendVideoFromFile(videoPath, mensagem, [userJid, targetJid]);
  },
};