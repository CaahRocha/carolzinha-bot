const { onlyNumbers } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const { ASSETS_DIR, PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "sexo",
  description: "sexo com a Caah.",
  commands: ["sexoCaah"],
  usage: `${PREFIX}sexoCaah [@alguem]`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendGifFromFile, userJid, groupMetadata, args }) => {
    const participants = groupMetadata?.participants || [];
    const otherParticipants = participants.filter(p => p.id !== userJid);

    // Verifica se foi mencionado alguém
    const mentionedJid = args.find(arg => arg.startsWith("@"));
    let targetJid;

    if (mentionedJid) {
      // Converte @ para JID numérico
      const mentionedNumber = onlyNumbers(mentionedJid);
      const found = participants.find(p => onlyNumbers(p.id) === mentionedNumber);
      if (found) {
        targetJid = found.id;
      }
    }

    // Se não encontrou ou não mencionou ninguém, sorteia
    if (!targetJid && otherParticipants.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherParticipants.length);
      targetJid = otherParticipants[randomIndex].id;
    }

    
    if (!targetJid) {
      await sendGifFromFile(
        path.resolve(ASSETS_DIR, "images", "funny", "caah.mp4"),
        `@${onlyNumbers(userJid)} tentou transar com a Caah, mas ela não está on 😢`,
        [userJid]
      );
      return;
    }

    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "caah.mp4"),
      `@${onlyNumbers(userJid)} transou gostoso com a Caah @${onlyNumbers(targetJid)}! 🔥`,
      [userJid, targetJid]
    );
  },
};