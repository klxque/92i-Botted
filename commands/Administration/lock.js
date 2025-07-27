const { PermissionOverwriteManager, PermissionOverwrites, SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Permet de lock rapidement un salons")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({
                content: "Vous n'avez pas la permissions d'utiliser cette commande.",
                ephemeral: true
            });
        }

        const channel = interaction.channel;

        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: false
            });

            await interaction.reply({
                content: `${channel} à bien été lock.`
            })
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: "Erreur lors de l'execution de la commande.",
                ephemeral: true
            });
        }
    }
}