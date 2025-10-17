const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { onlyNumbers, toUserJidOrLid } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const { ASSETS_DIR } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "gostosa",
  description: "Mede o nível de gostosura de alguém (com humor).",
  commands: ["gostosa"],
  usage: `${PREFIX}gostosa @usuario`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    sendGifFromFile,
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
      categoria = "sem sal";
      piada = "🥱 Passa batida até no raio-x.";
    } else if (porcentagem <= 50) {
      categoria = "tem potencial";
      piada = "😌 Com um filtro certo, vira crush fácil.";
    } else if (porcentagem <= 80) {
      categoria = "gostosinha";
      piada = "🔥 Já tem gente stalkeando no Instagram.";
    } else {
      categoria = "gostosa suprema";
      piada = "💃 Quebra corações e recordes de likes!";
    }

    const mensagem = `💅 A gostosura de @${targetNumber} está em *${porcentagem}%*.\n💬 Categoria: *${categoria.toUpperCase()}*\n\n${piada}`;

    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "gostosa.mp4"),
      mensagem,
      [userJid, targetJid]
    );
  },
};