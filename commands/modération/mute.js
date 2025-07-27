const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { color, logo, text } = require('../../config.json');
const { parse } = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Permet de mute un membre.')
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Membre a mute.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('temps')
                .setDescription('Temps du mute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison du mute')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction) {
        const member = interaction.options.getUser('membre');
        const temps = interaction.options.getString('temps');
        const raison = interaction.options.getString('raison');
        const user = interaction.guild.members.cache.get(member.id);

        const mute = new EmbedBuilder()
            .setColor(color)
            .setDescription(`Membre: ${member}\nRaison: \`${raison}\`\nTemps: \`${temps}\``)
            .setFooter({ text: text, iconURL: logo })
            .setTitle("Mute");

        if (!user) {
            return interaction.reply({ content: "Utilisateur inconnu", ephemeral: true });
        }

        if (!user.moderatable) {
            return interaction.reply({ content: "Je ne peux pas mute cette personne.", ephemeral: true });
        }

        const durationMS = parseDuration(temps);
        if (!durationMS) {
            return interaction.reply({ content: "Temps du mute non défini", ephemeral: true });
        }

        try {
            await user.timeout(durationMS, raison);
            await interaction.reply({ embeds: [mute] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Erreur lors du mute de l'utilisateur", ephemeral: true });
        }
    }
}

function parseDuration(duration) {
    const match = duration.match(/^(\d+)([smhd])$/)
    if (!match) return null;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        case 'y': return value * 365 * 24 * 60 * 60 * 1000;
        default: return null;
    }
}