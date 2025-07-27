const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'embed_check',
    async execute(interaction) {
        const currentEmbed = interaction.message.embeds[0];
        
        if (!currentEmbed || !currentEmbed.description || currentEmbed.description === '\u200B') {
            return await interaction.reply({
                content: '❌ Vous devez d\'abord configurer au moins la description de l\'embed !',
                ephemeral: true
            });
        }
        
        const sendChannelButton = new ButtonBuilder()
            .setCustomId('embed_send_channel')
            .setEmoji('<:salon:1398571892734169169>')
            .setLabel('Envoyer dans un salon')
            .setStyle(ButtonStyle.Primary);
        
        const editMessageButton = new ButtonBuilder()
            .setCustomId('embed_edit_message')
            .setEmoji('<:edit:1398571880499380294>')
            .setLabel('Modifier un message')
            .setStyle(ButtonStyle.Secondary);
        
        const sendDMButton = new ButtonBuilder()
            .setCustomId('embed_send_dm')
            .setEmoji('<:msg:1398572118395850793>')
            .setLabel('Envoyer en MP')
            .setStyle(ButtonStyle.Secondary);
        
        const backButton = new ButtonBuilder()
            .setCustomId('embed_back')
            .setEmoji('<:back:1398571904662507671>')
            .setLabel('Retour')
            .setStyle(ButtonStyle.Danger);
        
        const row1 = new ActionRowBuilder().addComponents(sendChannelButton, editMessageButton);
        const row2 = new ActionRowBuilder().addComponents(sendDMButton, backButton);
        
        await interaction.update({ 
            embeds: [currentEmbed], 
            components: [row1, row2] 
        });
    }
};