const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { menuMessage } = require(`${BASE_DIR}/menu`);
const path = require("path");
const fs = require("fs");

module.exports = {
  name: "menu",
  description: "Menu de comandos",
  commands: ["menu", "help"],
  usage: `${PREFIX}menu`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, sendVideoFromFile, sendErrorReply, sendSuccessReact }) => {
    await sendSuccessReact();

    const videoPath = path.join(ASSETS_DIR, "images", "carolzinha-bot.mp4"); // ✅ atualizado para .mp4

    if (!fs.existsSync(videoPath)) {
      await sendErrorReply("Vídeo 'carolzinha-bot.mp4' não encontrado. Verifique o caminho ou o nome do arquivo.");
      return;
    }

    await sendVideoFromFile(videoPath, `\n\n${menuMessage(remoteJid)}`);
  },
};