const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { toUserJidOrLid, onlyNumbers } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const { ASSETS_DIR } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "casal",
  description: "Forma um casal entre você e alguém ou entre duas pessoas marcadas.",
  commands: ["casal", "ship", "namoro"],
  usage: `${PREFIX}casal @usuario`,

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
    if (!args.length && !isReply) {
      throw new InvalidParameterError("Você precisa mencionar ou marcar um membro!");
    }

    const pessoa1 = userJid;
    const pessoa2 = isReply ? replyJid : toUserJidOrLid(args[0]);

    if (!pessoa2) {
      await sendErrorReply("Não foi possível identificar o par. Tente marcar alguém ou usar @.");
      return;
    }

    const nome1 = onlyNumbers(pessoa1);
    const nome2 = onlyNumbers(pessoa2);

    await sendVideoFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "casal.mp4"),
      `💘 Novo casal formado!\n\n@${nome1} ❤️ @${nome2}\nSerá que vai dar namoro? 😍`,
      [pessoa1, pessoa2]
    );
  },
};