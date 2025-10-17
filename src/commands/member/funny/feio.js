const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { onlyNumbers, toUserJidOrLid } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const { ASSETS_DIR } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "feio",
  description: "Mede o nível de feiura de alguém (com humor).",
  commands: ["feio"],
  usage: `${PREFIX}feio @usuario`,

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
      categoria = "modelo";
      piada = "✨ Dá até pra usar como papel de parede do celular.";
    } else if (porcentagem <= 50) {
      categoria = "normal";
      piada = "😐 Nem bonito, nem feio... só existe.";
    } else if (porcentagem <= 80) {
      categoria = "meio feinho";
      piada = "🫣 Já ouviu 'beleza interior'? Pois é, confia.";
    } else {
      categoria = "feio demais";
      piada = "🚨 A beleza fugiu e deixou só o RG.";
    }

    const mensagem = `🧟‍♂️ O nível de feiura de @${targetNumber} é *${porcentagem}%*.\n💬 Categoria: *${categoria.toUpperCase()}*\n\n${piada}`;

    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "feio.mp4"),
      mensagem,
      [userJid, targetJid]
    );
  },
};