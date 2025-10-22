const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { onlyNumbers, toUserJidOrLid } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const { ASSETS_DIR } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "crente",
  description: "Mede o nível de crente de alguém (com humor).",
  commands: ["crente"],
  usage: `${PREFIX}crente @usuario`,

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
      categoria = "desviado";
      piada = "😈 Precisa de uma campanha de oração urgente!";
    } else if (porcentagem <= 50) {
      categoria = "morno";
      piada = "😅 Vai na igreja só quando dá... e ainda chega atrasado.";
    } else if (porcentagem <= 80) {
      categoria = "quase ungido";
      piada = "🙏 Já sabe os versículos decorados, mas ainda escorrega no louvor.";
    } else {
      categoria = "crente raiz";
      piada = "🔥 Ora, jejua, lê a Bíblia e ainda canta no coral!";
    }

    const mensagem = `🙌 O nível de crente de @${targetNumber} é *${porcentagem}%*.\n💬 Categoria: *${categoria.toUpperCase()}*\n\n${piada}`;

    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "crente.mp4"), // você pode trocar o gif se quiser
      mensagem,
      [userJid, targetJid]
    );
  },
};
