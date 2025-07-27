const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { logo, color, text } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banni un utilisateur.')
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Membre à bannir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison du bannissement')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const member = interaction.options.getUser('membre');
        const reason = interaction.options.getString('raison');
        const membre = interaction.guild.members.cache.get(member.id);

        const ban = new EmbedBuilder()
            .setColor(color)
            .setFooter({ text: text, iconURL: logo })
            .setDescription(`Membre: ${member}\nRaison: ${reason}`)
            .setTitle("Bannissement");

        if (!membre) {
            return interaction.reply({ content: "Membre inconnu.", ephemeral: true });
        }

        if (!membre.bannable) {
            return interaction.reply({ content: "Je n'ai pas les permissions requises pour bannir ce membre.", ephemeral: true });
        }

        try {
            await membre.ban({ reason: reason });
            await interaction.reply({ embeds: [ban] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Une erreur lors du bannissement.", ephemeral: true });
        }
        
    },
};