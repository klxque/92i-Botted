module.exports = {
    customId: 'embed_send_dm',
    async execute(interaction) {
        await interaction.reply({
            content: '💌 **Envoyer en message privé :**\n\n*Mentionnez l\'utilisateur (@user) ou donnez son ID*\n\n⏱️ Vous avez 60 secondes pour répondre.',
            ephemeral: true
        });

        const filter = (msg) => msg.author.id === interaction.user.id;
        
        try {
            const collected = await interaction.channel.awaitMessages({
                filter,
                max: 1,
                time: 60000,
                errors: ['time']
            });

            const userMessage = collected.first();
            const userInput = userMessage.content.trim();

            try {
                await userMessage.delete();
            } catch (error) {
                console.log('Impossible de supprimer le message utilisateur');
            }

            let targetUser;

            const userMention = userInput.match(/<@!?(\d+)>/);
            if (userMention) {
                try {
                    targetUser = await interaction.client.users.fetch(userMention[1]);
                } catch (error) {
                }
            }
            else if (/^\d+$/.test(userInput)) {
                try {
                    targetUser = await interaction.client.users.fetch(userInput);
                } catch (error) {
                }
            }

            if (!targetUser) {
                return await interaction.followUp({
                    content: '❌ Utilisateur introuvable ! Vérifiez l\'ID ou la mention de l\'utilisateur.',
                    ephemeral: true
                });
            }

            if (targetUser.bot) {
                return await interaction.followUp({
                    content: '❌ Je ne peux pas envoyer de messages privés aux bots !',
                    ephemeral: true
                });
            }

            const embedToSend = interaction.message.embeds[0];
            
            try {
                await targetUser.send({ embeds: [embedToSend] });
                
                await interaction.followUp({
                    content: `✅ Embed envoyé en message privé à ${targetUser.tag} !`,
                    ephemeral: true
                });

            } catch (error) {
                console.error('Erreur envoi MP:', error);
                
                let errorMessage = '❌ Impossible d\'envoyer le message privé.';
                
                if (error.code === 50007) {
                    errorMessage += ' L\'utilisateur n\'accepte pas les messages privés ou m\'a bloqué.';
                } else {
                    errorMessage += ' Erreur inconnue.';
                }

                await interaction.followUp({
                    content: errorMessage,
                    ephemeral: true
                });
            }

        } catch (error) {
            await interaction.followUp({
                content: '⏰ Temps écoulé ! Veuillez réessayer.',
                ephemeral: true
            });
        }
    }
};