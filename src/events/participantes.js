module.exports = (conn) => {
  conn.ev.on('group-participants.update', async (update) => {
    const { id: groupId, participants, action } = update;

    if (action === 'add') {
      const { isActiveWelcomeGroup } = require('../utils/database');
      const { welcomeMessage } = require('../mensagens');

      if (!isActiveWelcomeGroup(groupId)) return;

      for (const participant of participants) {
        const mentionTag = `@${participant.split('@')[0]}`;
        const mensagemFinal = welcomeMessage.replace('@member', mentionTag);

        try {
          const profilePic = await conn.profilePictureUrl(participant, 'image');

          await conn.sendMessage(groupId, {
            image: { url: profilePic },
            caption: mensagemFinal,
            mentions: [participant],
          });
        } catch (err) {
          console.error('Erro ao buscar foto de perfil:', err);

          await conn.sendMessage(groupId, {
            text: mensagemFinal,
            mentions: [participant],
          });
        }
      }
    }
  });
};