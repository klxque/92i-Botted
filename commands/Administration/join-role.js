const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join-role')
        .setDescription('Attribue un rôle aux nouveaux membres qui rejoignent le serveur.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Le rôle à attribuer aux nouveaux membres')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            return interaction.reply({
                content: "Vous n'avez pas la permission d'executer cette commande.",
                ephemeral: true
            });
        }

        const role = interaction.options.getRole('role');

        if (!role) {
            return interaction.reply({
                content: "Le rôle spécifié est invalide.",
                ephemeral: true
            });
        }

        const serverJoinRoleKey = `server_${interaction.guild.id}_joinRole`;
        await db.set(serverJoinRoleKey, role.id);

        return interaction.reply({
            content: `Le rôle **${role}** sera attribué aux nouveaux membres qui rejoignent le serveur.`,
            ephemeral: true
        });
    }
};
