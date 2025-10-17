const { toUserJidOrLid, isGroup } = require(`${BASE_DIR}/utils`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);
const { PREFIX, ASSETS_DIR, OWNER_NUMBER } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { getProfileImageData } = require(`${BASE_DIR}/services/baileys`);

module.exports = {
  name: "perfil",
  description: "Mostra informações de um usuário",
  commands: ["perfil", "profile"],
  usage: `${PREFIX}perfil ou perfil @usuario`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    args,
    socket,
    remoteJid,
    userJid,
    sendErrorReply,
    sendWaitReply,
    sendSuccessReact,
  }) => {
    if (!isGroup(remoteJid)) {
      throw new InvalidParameterError("Este comando só pode ser usado em grupo.");
    }

    const targetJid = args[0] ? toUserJidOrLid(args[0]) : userJid;
    await sendWaitReply("Carregando perfil...");

    try {
      let profilePicUrl;
      let userName;
      let userRole = "Membro";

      try {
        const { profileImage } = await getProfileImageData(socket, targetJid);
        profilePicUrl = profileImage || `${ASSETS_DIR}/images/default-user.png`;

        const contactInfo = await socket.onWhatsApp(targetJid);
        userName = contactInfo[0]?.name || "Usuário Desconhecido";
      } catch (error) {
        errorLog(`Erro ao tentar pegar dados do usuário ${targetJid}: ${JSON.stringify(error, null, 2)}`);
        profilePicUrl = `${ASSETS_DIR}/images/default-user.png`;
        userName = "Usuário Desconhecido";
      }

      const groupMetadata = await socket.groupMetadata(remoteJid);
      const participant = groupMetadata.participants.find(p => p.id === targetJid);

      // Verificação da dona (ignora sufixos como @lid)
      const donoJid = `${OWNER_NUMBER}@s.whatsapp.net`;
      if (targetJid.toLowerCase().startsWith(OWNER_NUMBER)) {
        userRole = "Dona";
      } else if (participant?.admin) {
        userRole = "Administrador";
      }

      // Dados aleatórios
      const deviceTypes = ["Android", "iOS"];
      const frasesDoDia = [
        "A persistência realiza o impossível.",
        "Você é mais forte do que imagina.",
        "Cada dia é uma nova chance para brilhar.",
        "Confie no processo.",
        "Seja a mudança que você quer ver no mundo.",
        "Nada é em vão, tudo é aprendizado.",
        "A vida é feita de ciclos. Aproveite o seu.",
        "Coragem é agir com o coração.",
        "Você está exatamente onde precisa estar.",
        "Grandes coisas levam tempo. Continue!"
      ];

      const randomDevice = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
      const fraseDoDia = frasesDoDia[Math.floor(Math.random() * frasesDoDia.length)];
      const randomPercent = Math.floor(Math.random() * 100);
      const programPrice = (Math.random() * 5000 + 1000).toFixed(2);
      const beautyLevel = Math.floor(Math.random() * 100) + 1;

      const mensagem = `
👤 *Nome:* @${targetJid.split("@")[0]}
🎖️ *Cargo:* ${userRole}

📱 *Dispositivo:* ${randomDevice}
🌚 *Programa:* R$ ${programPrice}
🐮 *Gado:* ${randomPercent + 7}%
🤭 *Passiva:* ${randomPercent + 5}%
✨ *Beleza:* ${beautyLevel}%

📝 *Frase do dia:* "${fraseDoDia}"`;

      await sendSuccessReact();
      await socket.sendMessage(remoteJid, {
        image: { url: profilePicUrl },
        caption: mensagem,
        mentions: [targetJid],
      });
    } catch (error) {
      console.error(error);
      sendErrorReply("Ocorreu um erro ao tentar verificar o perfil.");
    }
  },
};
