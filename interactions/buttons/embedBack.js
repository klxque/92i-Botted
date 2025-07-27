const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: 'embed_back',
    async execute(interaction) {
        const select = new StringSelectMenuBuilder()
            .setPlaceholder("Fais un choix")
            .setCustomId('embed_select')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji("<:title:1398564137705148416>")
                    .setValue('embed_title')
                    .setLabel("Modifier le titre"),
                new StringSelectMenuOptionBuilder()
                    .setEmoji("<:mail:1398362881720058059>")
                    .setValue("embed_desc")
                    .setLabel("Modifier la description"),
                new StringSelectMenuOptionBuilder()
                    .setEmoji("<:role:1398362917958717643>")
                    .setValue("embed_author")
                    .setLabel("Modifier l'auteur"),
                new StringSelectMenuOptionBuilder()
                    .setEmoji("<:footer:1398565778722259035>")
                    .setValue("embed_footer")
                    .setLabel("Modifier le footer"),
                new StringSelectMenuOptionBuilder()
                    .setEmoji("<:thum:1398565757117534228>")
                    .setValue("embed_thumbnail")
                    .setLabel("Modifier le thumbnail"),
                new StringSelectMenuOptionBuilder()
                    .setEmoji("<:time2:1398362930608869417>")
                    .setValue("embed_timestamp")
                    .setLabel("Modifier le timestamp"),
                new StringSelectMenuOptionBuilder()
                    .setEmoji("<:image:1398565767418478672>")
                    .setValue("embed_image")
                    .setLabel("Modifier l'image"),
                new StringSelectMenuOptionBuilder()
                    .setEmoji("<:color:1398564147960217620>")
                    .setValue("embed_color")
                    .setLabel("Modifier la couleur")
            );

        const button = new ButtonBuilder()
            .setCustomId('embed_check')
            .setEmoji('<:check:1398567020467060766>')
            .setLabel("Valider")
            .setStyle(ButtonStyle.Success);

        const button2 = new ButtonBuilder()
            .setCustomId('embed_supr')
            .setEmoji("<:supr:1398362987882086540>")
            .setLabel("Suprimmer")
            .setStyle(ButtonStyle.Danger);
        
        const row = new ActionRowBuilder().addComponents(select);
        const row2 = new ActionRowBuilder().addComponents(button, button2);

        const currentEmbed = interaction.message.embeds[0];
        
        await interaction.update({ 
            embeds: [currentEmbed], 
            components: [row, row2] 
        });
    }
};