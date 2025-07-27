const { ActionRowBuilder, ActionRow, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { color, text, logo } = require('../../config.json');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tickets")
        .setDescription("Met en place le système de ticket")
        .addChannelOption(option =>
            option.setName("salon")
                .setDescription("Salon de l'embed")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option =>
            option.setName("categorie")
                .setDescription('Catégorie des tickets')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addRoleOption(option =>
            option.setName("role-support")
                .setDescription("Support role")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        async execute(interaction) {
            if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                interaction.reply({
                    content: "Vous n'avez pas la permissions d'utiliser cette commande.",
                    ephemeral: true
                });
            }

            const channel = interaction.options.getChannel('salon');

            const serverTicketsCategory = `server_${interaction.guild.id}_ticketsCategory`;
            const category = interaction.options.getChannel('categorie');

            await db.set(serverTicketsCategory, category.id)

            const supportRole = interaction.options.getRole('role-support')
            const serverSupportRole = `server_${interaction.guild.id}_supportRole`

            await db.set(serverSupportRole, supportRole.id)

            const embed = new EmbedBuilder()
                .setTitle(`Ticket ${interaction.guild.name}`)
                .setDescription('Utiliser le bouton ci-dessous pour ouvrir un ticket.')
                .setColor(color)
                .setFooter({ text: text, iconURL: logo })

            const createButton = new ButtonBuilder()
                .setCustomId('create_tickets')
                .setLabel("Ouvrir un Ticket")
                .setEmoji("📥")
                .setStyle(ButtonStyle.Success)
            
            const row = new ActionRowBuilder().addComponents(createButton)

            await interaction.reply({
                content: `Système de ticket disponible dans ${channel}`,
                ephemeral: true
            })

            await channel.send({ embeds: [embed], components: [row] })
        }

}