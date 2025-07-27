const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { color, text, logo } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Donne des information psur le serveur.'),
    async execute(interaction) {

        const channelCount = interaction.guild.channels.cache.filter(c => c.type !== 4);

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.guild.name} (${interaction.guild.id})`)
            .setColor(color)
            .setFooter({ text: text, iconURL: logo })
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                { name: `Propriétaire :`, value: `<@${interaction.guild.ownerId}> (${interaction.guild.ownerId})`, inline: true },
                { name: `Membres :`, value: `${interaction.guild.memberCount}`, inline: true },
                { name: `Boosts :`, value: `${interaction.guild.premiumSubscriptionCount}`, inline: true },
                { name: "Rôles :", value: `${interaction.guild.roles.cache.size}`, inline: true },
                { name: "Salons:", value: `${channelCount.size}`, inline: true },
                {
                    name: "Vanity :",
                    value: interaction.guild.vanityUrlCode
                        ? `.gg/${interaction.guild.vanityUrlCode}`
                        : "Aucun",
                    inline: true
                },
                {
                    name: "Communauté :",
                    value: interaction.guild.features.length
                        ? "Activé"
                        : "Désactivé",
                    inline: true
                },
                { name: "Crée le :", value: `<t:${Math.floor(interaction.guild.createdTimestamp / 1000 )}:F>`, inline: true },
                { name: "Rejoint le :", value: `<t:${Math.floor(interaction.guild.joinedTimestamp / 1000)}:F>`, inline: true }
            )

        await interaction.reply({ embeds: [embed] });
    },
};