const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { onlyNumbers, toUserJidOrLid } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const { ASSETS_DIR } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "pau",
  description: "Mostra o tamanho do pau de alguém (com humor).",
  commands: ["pau"],
  usage: `${PREFIX}pau @usuario`,

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
    const tamanho = Math.floor(Math.random() * (45 - 3 + 1)) + 3;

    let categoria;
    let piada;

    if (tamanho <= 10) {
      categoria = "pequeno";
      piada = "⚠️ Tamanho não é documento, mas nesse caso... é bilhete de metrô.";
    } else if (tamanho <= 25) {
      categoria = "médio";
      piada = "😏 Equilibrado! Nem assusta, nem decepciona.";
    } else {
      categoria = "grande";
      piada = "🚨 Chama o SAMU! Isso aí é arma branca.";
    }

    const mensagem = `📏 O pau de @${targetNumber} tem *${tamanho}cm* de pura ilusão.\n💬 Categoria: *${categoria.toUpperCase()}*\n\n${piada}`;

    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "pau.mp4"),
      mensagem,
      [userJid, targetJid]
    );
  },
};