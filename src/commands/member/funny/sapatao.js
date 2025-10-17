const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { onlyNumbers, toUserJidOrLid } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const { ASSETS_DIR } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "sapatao",
  description: "Mede o nível de gay de alguém (com humor).",
  commands: ["sapatao"],
  usage: `${PREFIX}sapatao @usuario`,

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
    const userNumber = onlyNumbers(userJid);
    const porcentagem = Math.floor(Math.random() * 101); // 0 a 100%

    let categoria;
    let piada;

    if (porcentagem <= 20) {
      categoria = "hetero raiz";
      piada = "🧱 Essa aí é mais reta que parede de concreto.";
    } else if (porcentagem <= 50) {
      categoria = "curiosa";
      piada = "👀 Já deu aquela olhadinha... só por curiosidade.";
    } else if (porcentagem <= 80) {
      categoria = "quase lá";
      piada = "🌈 Tá só esperando a proxima parada gay pra se revelar.";
    } else {
      categoria = "sapatãozona raiz";
      piada = "💅 Dirige ate caminhão";
    }

    const mensagem = `🌈 O nível de sapatão de @${targetNumber} é *${porcentagem}%*.\n💬 Categoria: *${categoria.toUpperCase()}*\n\n${piada}`;

    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "sapatao.mp4"),
      mensagem,
      [userJid, targetJid]
    );
  },
};
