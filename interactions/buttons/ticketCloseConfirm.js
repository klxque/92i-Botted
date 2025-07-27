const { EmbedBuilder } = require('discord.js')
const { color, text, logo } = require('../../config.json')

module.exports = {
    customId: 'ticket_close_confirm',

    async execute(interaction) {
        const channel = interaction.channel;

        await interaction.update({
            content: "Fermeture du ticket...",
            components: []
        });

        const closingEmbed = new EmbedBuilder()
            .setTitle("Ticket Fermé")
            .setDescription("Ticket suprimmer dans 5 secondes")
            .setColor(color)
            .setFooter({ text: text, iconURL: logo })
        
        await channel.send({ embeds: [closingEmbed] });

        setTimeout(() => {
            channel.delete().catch(() => {});
        }, 5000);
    }
}