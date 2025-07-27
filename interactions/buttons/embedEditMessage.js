module.exports = {
    customId: 'embed_edit_message',
    async execute(interaction) {
        await interaction.reply({
            content: '✏️ **Modification d\'un message :**\n\n**1.** Mentionnez d\'abord le salon (#salon) ou donnez son ID\n**2.** Donnez l\'ID du message à modifier\n\n*Format : #salon 123456789 ou 987654321 123456789*\n\n⏱️ Vous avez 60 secondes pour répondre.',
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

            const parts = userInput.split(' ');
            if (parts.length !== 2) {
                return await interaction.followUp({
                    content: '❌ Format incorrect ! Utilisez : `#salon messageId` ou `channelId messageId`',
                    ephemeral: true
                });
            }

            const [channelPart, messageId] = parts;
            let targetChannel;

            const channelMention = channelPart.match(/<#(\d+)>/);
            if (channelMention) {
                targetChannel = interaction.guild.channels.cache.get(channelMention[1]);
            } else if (/^\d+$/.test(channelPart)) {
                targetChannel = interaction.guild.channels.cache.get(channelPart);
            } else if (channelPart.startsWith('#')) {
                const channelName = channelPart.slice(1);
                targetChannel = interaction.guild.channels.cache.find(ch => 
                    ch.name === channelName && ch.isTextBased()
                );
            }

            if (!targetChannel) {
                return await interaction.followUp({
                    content: '❌ Salon introuvable ! Vérifiez l\'ID ou la mention du salon.',
                    ephemeral: true
                });
            }

            if (!targetChannel.isTextBased()) {
                return await interaction.followUp({
                    content: '❌ Ce salon ne permet pas l\'édition de messages !',
                    ephemeral: true
                });
            }

            if (!/^\d+$/.test(messageId)) {
                return await interaction.followUp({
                    content: '❌ ID de message invalide ! L\'ID doit être composé uniquement de chiffres.',
                    ephemeral: true
                });
            }

            let targetMessage;
            try {
                targetMessage = await targetChannel.messages.fetch(messageId);
            } catch (error) {
                return await interaction.followUp({
                    content: '❌ Message introuvable ! Vérifiez l\'ID du message et assurez-vous qu\'il existe dans ce salon.',
                    ephemeral: true
                });
            }

            if (targetMessage.author.id !== interaction.client.user.id) {
                return await interaction.followUp({
                    content: '❌ Je ne peux modifier que mes propres messages !',
                    ephemeral: true
                });
            }

            const embedToSend = interaction.message.embeds[0];
            
            try {
                await targetMessage.edit({ embeds: [embedToSend] });
                
                await interaction.followUp({
                    content: `✅ Message modifié avec succès dans ${targetChannel} !\n[Voir le message](${targetMessage.url})`,
                    ephemeral: true
                });

            } catch (error) {
                console.error('Erreur modification message:', error);
                await interaction.followUp({
                    content: '❌ Erreur lors de la modification du message. Vérifiez mes permissions.',
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