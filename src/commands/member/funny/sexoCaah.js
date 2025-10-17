const { onlyNumbers } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const { ASSETS_DIR, PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "sexo",
  description: "Sexo com a Caah.",
  commands: ["sexoCaah"],
  usage: `${PREFIX}sexoCaah`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendGifFromFile, userJid, groupMetadata }) => {
    const participants = groupMetadata?.participants || [];

    // Remove o próprio usuário da lista
    const otherParticipants = participants.filter(p => p.id !== userJid);

    if (otherParticipants.length === 0) {
      await sendGifFromFile(
        path.resolve(ASSETS_DIR, "images", "funny", "caah.mp4"),
        `@${onlyNumbers(userJid)} tentou transar com a Caah, mas ela não está on 😢`,
        [userJid]
      );
      return;
    }

    // Sorteia um participante aleatório
    const randomIndex = Math.floor(Math.random() * otherParticipants.length);
    const targetJid = otherParticipants[randomIndex].id;

    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "caah.mp4"), // Certifique-se de que esse arquivo existe
      `@${onlyNumbers(userJid)} transou gostoso com a Caah @${onlyNumbers(targetJid)}! 🔥`,
      [userJid, targetJid]
    );
  },
};
``