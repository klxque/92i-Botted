const { Events, EmbedBuilder } = require('discord.js');
const { color, text, logo } = require('../../config.json');
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;

        if (interaction.customId === 'embedForm') {
            try {
                const title = interaction.fields.getTextInputValue('embedTitle');
                const description = interaction.fields.getTextInputValue('embedDescription');
                const thumbnail = interaction.fields.getTextInputValue('embedThumbnail');

                if (thumbnail && !thumbnail.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
                    return interaction.reply({
                        content: 'L\'URL du thumbnail n\'est pas valide. Veuillez fournir un lien direct vers une image.',
                        ephemeral: true,
                    });
                }

                const embed = new EmbedBuilder()
                    .setTitle(`${title}`.trim())
                    .setDescription(description)
                    .setFooter({ text: text, iconURL: logo })
                    .setColor(color); 

                if (thumbnail) {
                    embed.setThumbnail(thumbnail);
                }

                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.error('Erreur lors de la création de l\'embed :', error);
                return interaction.reply({
                    content: 'Une erreur est survenue lors de la création de l\'embed.',
                    ephemeral: true,
                });
            }
        }
    },
};
