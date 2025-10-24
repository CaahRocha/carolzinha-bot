const { PREFIX, OWNER_NUMBER } = require('../../config');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');

// Helper functions
const isGroup = (jid) => jid.endsWith('@g.us');
const toUserJidOrLid = (text) => {
  const number = text.replace(/[^0-9]/g, '');
  return `${number}@s.whatsapp.net`;
};

// Helper to get profile pic
async function getProfilePic(socket, jid) {
  try {
    const ppUrl = await socket.profilePictureUrl(jid, 'image');
    const response = await axios.get(ppUrl, { responseType: 'arraybuffer' });
    return {
      buffer: Buffer.from(response.data),
      success: true
    };
  } catch (error) {
    console.log("[PERFIL] Erro ao buscar foto:", error);
    return {
      buffer: null,
      success: false
    };
  }
}

module.exports = {
  name: "perfil",
  description: "Mostra informações de um usuário",
  commands: ["perfil", "profile"],
  type: 'member',
  usage: `${PREFIX}perfil ou perfil @usuario`,

  handle: async ({
    args,
    socket,
    remoteJid,
    userJid,
    sendErrorReply,
    sendWaitReply,
    sendSuccessReact,
    sendText
  }) => {
    try {
      if (!isGroup(remoteJid)) {
        await sendErrorReply("Este comando só pode ser usado em grupo.");
        return;
      }

      const targetJid = args[0] ? toUserJidOrLid(args[0]) : userJid;
      await sendWaitReply("⏳ Carregando perfil...");

      // Busca foto do perfil
      const { buffer: profilePic, success: hasProfilePic } = await getProfilePic(socket, targetJid);
      
      // Verifica cargo no grupo
      const groupMetadata = await socket.groupMetadata(remoteJid);
      const participant = groupMetadata.participants.find(p => p.id === targetJid);
      let userRole = "Membro";

      if (targetJid.startsWith(OWNER_NUMBER)) {
        userRole = "Dona";
      } else if (participant?.admin) {
        userRole = "Administrador";
      }

      // Gera dados aleatórios
      const deviceTypes = ["Android", "iOS"];
      const frasesDoDia = [
        "A persistência realiza o impossível.",
        "Você é mais forte do que imagina.",
        "Cada dia é uma nova chance para brilhar.",
        "Confie no processo.",
        "Seja a mudança que você quer ver no mundo."
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

      if (hasProfilePic && profilePic) {
        await socket.sendMessage(remoteJid, {
          image: profilePic,
          caption: mensagem,
          mentions: [targetJid]
        });
      } else {
        await sendText(mensagem, [targetJid]);
      }

    } catch (error) {
      console.error("[PERFIL] Erro:", error);
      await sendErrorReply("❌ Ocorreu um erro ao buscar o perfil.");
    }
  },
};