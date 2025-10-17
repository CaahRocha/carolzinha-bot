const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { onlyNumbers, toUserJidOrLid } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const { ASSETS_DIR } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "puta",
  description: "Mede o nível de putice de alguém (com humor).",
  commands: ["puta"],
  usage: `${PREFIX}puta @usuario`,

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
      categoria = "muito pura";
      piada = "😇 Se tem uma santa aqui é você.";
    } else if (porcentagem <= 50) {
      categoria = "ainda ta no meio termo de santa pra puta";
      piada = "😌 se continuar com esses seus nudes chega lá.";
    } else if (porcentagem <= 80) {
      categoria = "Já entrou no cabaré";
      piada = "🔥 Já já ta dando mais que chuchu em cerca.";
    } else {
      categoria = "puta suprema";
      piada = "😈 Se tem uma coisa que você é, é uma verdadeira putona";
    }

    const mensagem = `💅 A putice de @${targetNumber} está em *${porcentagem}%*.\n💬 Categoria: *${categoria.toUpperCase()}*\n\n${piada}`;

    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "puta.mp4"),
      mensagem,
      [userJid, targetJid]
    );
  },
};