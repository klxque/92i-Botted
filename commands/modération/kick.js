const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { logo, color, text } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick un utilisateur.')
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Membre à kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison du kick')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const member = interaction.options.getUser('membre');
        const reason = interaction.options.getString('raison');
        const membre = interaction.guild.members.cache.get(member.id);

        const ban = new EmbedBuilder()
            .setColor(color)
            .setDescription(`Membre: ${member}\nRaison: ${reason}`)
            .setFooter({ text: text, iconURL: logo })
            .setTitle("Kick");

        if (!membre) {
            return interaction.reply({ content: "Membre inconnu.", ephemeral: true });
        }

        if (!membre.kickable) {
            return interaction.reply({ content: "Je n'ai pas les permissions requises pour bannir ce membre.", ephemeral: true });
        }

        try {
            await membre.kick({ reason: reason });
            await interaction.reply({ embeds: [ban] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Une erreur lors du bannissement.", ephemeral: true });
        }
        
    },
};