const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { logo, color, text } = require('../../config.json');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join-message")
        .setDescription('Envoie un message quand un utilisateur rejoint le serveur.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription("Salon de bienvenue")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
        async execute(interaction) {
            if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
                return interaction.reply({
                    content: "Vous n'avez pas la permission d'utiliser cette commande.",
                    ephemeral: true
                });
            }

            const serverJoinMessageKey = `server_${interaction.guild.id}_joinMessage`
            const salon = interaction.options.getChannel('channel');

            await db.set(serverJoinMessageKey, salon.id)

            return interaction.reply({
                content: `Le salon ${salon} à été défini comme salon de bienvenue.`,
                ephemeral: true
            })
        }

}