const { ComponentType, ActionRowBuilder, SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { color, text, logo } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Envoie le panel d'aide"),
    async execute(interaction, client) {
        const commandCount = client.commands.size;

        function generateCmdDesc(commands, filter = []) {
            const cmds = [...commands.values()]
                .filter(cmd => filter.length === 0 || filter.includes(cmd.data.name))
                .map(cmd => `\`/${cmd.data.name}\` - ${cmd.data.description || "Pas de description"}`);
            return cmds.join('\n\n');
        }

        const embed = new EmbedBuilder()
            .setTitle('Help')
            .setColor(color)
            .setFooter({ text: text, iconURL: logo })
            .setDescription(`Salut <@${interaction.user.id}> !\nLe bot contient **\`${commandCount}\`** commandes.`);

        const HelpMenu = new StringSelectMenuBuilder()
            .setCustomId('helpmenu')
            .setPlaceholder('Choisir un menu')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Acceuil')
                    .setEmoji('<:home:1398418658329362462>')
                    .setValue('home'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Utilitaire')
                    .setEmoji('<:utility:1398418969878200323>')
                    .setValue('Utility'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Modération')
                    .setEmoji('<:mod:1398418720933810406>')
                    .setValue('mod'),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Administration")
                    .setEmoji("<:admin:1398418686095921214>")
                    .setValue('admin')
            );

        const Mod = new EmbedBuilder()
            .setTitle('Modération')
            .setColor(color)
            .setFooter({ text: text, iconURL: logo })
            .setDescription(generateCmdDesc(client.commands, ['ban', 'mute', 'kick']))

        const Utility = new EmbedBuilder()
            .setTitle('Utilitaire')
            .setColor(color)
            .setFooter({ text: text, iconURL: logo })
            .setDescription(generateCmdDesc(client.commands, ['help', 'ping', 'server', 'user']))
        
        const Admin = new EmbedBuilder()
            .setTitle("Administration")
            .setColor(color)
            .setFooter({ text: text, iconURL: logo })
            .setDescription(generateCmdDesc(client.commands, ['embed', 'tickets', 'join-message', 'join-role', 'lock', 'unlock', 'clear']))
        
        const select = new ActionRowBuilder()
            .addComponents(HelpMenu);

        const response = await interaction.reply({ embeds: [embed], components: [select] });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                await i.reply({ content: 'Interaction impossible, \`/help\` pour pouvoir intéragir avec le menu.', ephemeral: true });
                return;
            }

            const Value = i.values[0];

            if (Value === 'home') {
                await i.update({ embeds: [embed], components: [select] });
            } else if (Value === 'Utility') {
                await i.update({ embeds: [Utility], components: [select] });
            } else if (Value === 'mod') {
                await i.update({ embeds: [Mod], components: [select] })
            } else if (Value === 'admin') {
                await i.update({ embeds: [Admin], components: [select] })
            }
        });
    }
}