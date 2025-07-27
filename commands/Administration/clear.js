const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Supprime le nombre de messages voulu.")
        .addIntegerOption(option =>
            option.setName("nombre")
                .setDescription('Nombre de messages à supprimer (max 100)')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const amount = interaction.options.getInteger('nombre');

        try {
            if (amount) {
                const deleted = await interaction.channel.bulkDelete(amount, true);
                await interaction.reply({
                    content: `${deleted.size} messages supprimés.`,
                    ephemeral: true
                });
            } else {
                let totalDeleted = 0;
                let fetched;

                do {
                    fetched = await interaction.channel.messages.fetch({ limit: 100 });
                    if (fetched.size === 0) break;

                    const deleted = await interaction.channel.bulkDelete(fetched, true);
                    totalDeleted += deleted.size;

                    await new Promise(res => setTimeout(res, 1000)); // Pour éviter le rate limit
                } while (fetched.size >= 2);

                await interaction.reply({
                    content: `${totalDeleted} messages supprimés.`,
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "Une erreur est survenue lors de la suppression des messages.",
                ephemeral: true
            });
        }
    }
};
