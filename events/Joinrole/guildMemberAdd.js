const { Events, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const serverJoinRoleKey = `server_${member.guild.id}_joinRole`;
            const roleId = await db.get(serverJoinRoleKey);

            if (!roleId) {
                console.log(`Aucun rôle configuré pour les nouveaux membres dans le serveur ${member.guild.name}.`);
                return;
            }

            const role = member.guild.roles.cache.get(roleId);

            if (!role) {
                console.log(`Le rôle avec l'ID ${roleId} n'existe plus dans le serveur ${member.guild.name}.`);
                return;
            }

            const botMember = await member.guild.members.fetch(member.guild.client.user.id);

            if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                console.error(`Le bot n'a pas la permission de gérer les rôles dans le serveur ${member.guild.name}.`);
                return;
            }

            if (role.position >= botMember.roles.highest.position) {
                console.error(`Le rôle ${role.name} est au même niveau ou plus élevé que le rôle le plus élevé du bot dans le serveur ${member.guild.name}.`);
                return;
            }

            await member.roles.add(role);
            console.log(`Le rôle ${role.name} a été attribué à ${member.user.tag} dans le serveur ${member.guild.name}.`);
        } catch (error) {
            console.error(`Erreur lors de l'attribution du rôle :`, error);
        }
    },
};
