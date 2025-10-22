const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { onlyNumbers, toUserJidOrLid } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const fs = require("node:fs");
const { ASSETS_DIR } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "demonio",
  description: "Mede o nível de capetagem demoníaca de alguém (com humor e maldade).",
  commands: ["demonio", "capeta", "encapetado"],
  usage: `${PREFIX}demonio @usuario`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    sendImageFromFile,
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
      categoria = "anjo perdido";
      piada = "😇 Ainda tem salvação... talvez.";
    } else if (porcentagem <= 50) {
      categoria = "capetinha aprendiz";
      piada = "😈 Já apronta umas, mas ainda pede desculpa.";
    } else if (porcentagem <= 80) {
      categoria = "encapetado oficial";
      piada = "🔥 Já tem carteirinha do inferninho e tudo.";
    } else {
      categoria = "demônio em pessoa";
      piada = "🚨 Só aparece pra causar! Precisa de 7 exorcismos e 1 banho de sal grosso.";
    }

    const mensagem = `😈 O nível de capetagem de @${targetNumber} é *${porcentagem}%*.\n💬 Categoria: *${categoria.toUpperCase()}*\n\n${piada}`;

    const imagePath = path.resolve(ASSETS_DIR, "images", "funny", "demonio.mp4");

    if (!fs.existsSync(imagePath)) {
      await sendErrorReply("Imagem 'demonio.png' não encontrada. Verifique o caminho ou o arquivo.");
      return;
    }

    await sendImageFromFile(imagePath, mensagem, [userJid, targetJid]);
  },
};