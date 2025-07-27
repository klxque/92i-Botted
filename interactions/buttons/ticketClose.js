const { PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: `ticket_close`,

    async execute(interaction) {
        const confirmButton = new ButtonBuilder()
            .setCustomId('ticket_close_confirm')
            .setLabel("Oui")
            .setEmoji('✅')
            .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder().addComponents(confirmButton);

        await interaction.reply({
            content: "Êtes-vous sûr de vouloir ferme ce ticket ?",
            ephemeral: true,
            components: [row]
        });
    }
}