const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { onlyNumbers, toUserJidOrLid } = require(`${BASE_DIR}/utils`);
const path = require("path");

module.exports = {
  name: "corno",
  description: "Mede o nível de corno de alguém (com humor e zoeira).",
  commands: ["corno"],
  usage: `${PREFIX}corno @usuario`,

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
      categoria = "imune";
      piada = "🛡️ Esse aí tem radar anti-chifre instalado.";
    } else if (porcentagem <= 50) {
      categoria = "em risco";
      piada = "👀 Melhor ficar de olho no status do WhatsApp.";
    } else if (porcentagem <= 80) {
      categoria = "quase lá";
      piada = "🫣 Já tem gente chamando de 'amigo' demais.";
    } else {
      categoria = "corno confirmado";
      piada = "🐮 Já tá até com crachá e grupo no Telegram.";
    }

    const mensagem = `📊 O nível de corno de @${targetNumber} é *${porcentagem}%*.\n💬 Categoria: *${categoria.toUpperCase()}*\n\n${piada}`;

    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "boi.mp4"),
      mensagem,
      [userJid, targetJid]
    );
  },
};