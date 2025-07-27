module.exports = {
    customId: 'embed_send_channel',
    async execute(interaction) {
        await interaction.reply({
            content: '📤 **Veuillez indiquer le salon où envoyer l\'embed :**\n\n*Vous pouvez mentionner le salon (#salon) ou donner son ID*\n\n⏱️ Vous avez 60 secondes pour répondre.',
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

            let targetChannel;

            const channelMention = userInput.match(/<#(\d+)>/);
            if (channelMention) {
                targetChannel = interaction.guild.channels.cache.get(channelMention[1]);
            }

            else if (/^\d+$/.test(userInput)) {
                targetChannel = interaction.guild.channels.cache.get(userInput);
            }

            else if (userInput.startsWith('#')) {
                const channelName = userInput.slice(1);
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
                    content: '❌ Ce salon ne permet pas l\'envoi de messages !',
                    ephemeral: true
                });
            }

            if (!targetChannel.permissionsFor(interaction.guild.members.me).has(['SendMessages', 'EmbedLinks'])) {
                return await interaction.followUp({
                    content: '❌ Je n\'ai pas les permissions pour envoyer des messages ou des embeds dans ce salon !',
                    ephemeral: true
                });
            }

            const embedToSend = interaction.message.embeds[0];
            
            try {
                await targetChannel.send({ embeds: [embedToSend] });
                
                await interaction.followUp({
                    content: `✅ Embed envoyé avec succès dans ${targetChannel} !`,
                    ephemeral: true
                });

            } catch (error) {
                console.error('Erreur envoi embed:', error);
                await interaction.followUp({
                    content: '❌ Erreur lors de l\'envoi de l\'embed. Vérifiez mes permissions.',
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