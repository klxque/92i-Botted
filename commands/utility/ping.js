const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { color, logo, text } = require('../../config.json')


module.exports = {
    data: new SlashCommandBuilder() 
        .setName('ping') 
        .setDescription('Donnne le ping du bot'), 
    async execute(interaction, client) {
        const sent = await interaction.reply({content: 'Récupération du ping...', fetchReply: true});
        ping = sent.createdTimestamp - interaction.createdTimestamp;
        api = interaction.client.ws.ping;

        const embed = new EmbedBuilder()
            .setTitle('Ping')
            .setColor(color)
            .setFooter({ text: text, iconURL: logo })
            .setDescription(`Bot: \`${ping}\`\nApi: \`${api}\``);

        await interaction.editReply({ embeds: [embed] }); 
    }
};