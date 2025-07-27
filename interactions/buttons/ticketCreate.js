const { EmbedBuilder, ActionRowBuilder, ActionRow, ChannelType, PermissionOverwrites, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require('discord.js');
const { color, text, logo } = require('../../config.json');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    customId: 'create_tickets',

    async execute(interaction, client) {
        const categoryId = await db.get(`server_${interaction.guild.id}_ticketsCategory`);
        const category = interaction.guild.channels.cache.get(categoryId);

        if (!category || category.type !== ChannelType.GuildCategory) {
            return interaction.reply({
                content: "La catégorie de création des tickets n'est pas indiqué",
                ephemeral: true
            });
        } 

        const supportRoleId = await db.get(`server_${interaction.guild.id}_supportRole`);
        const supportRole = interaction.guild.roles.cache.get(supportRoleId);

        if (!supportRole) {
            return interaction.reply({
                content: "Aucun rôle support défini",
                ephemeral: true
            })
        }

        let ticketNum = await db.get(`ticket_count_${interaction.guild.id}`) || 0
        ticketNum++;
        await db.set(`ticket_count_${interaction.guild.id}`, ticketNum)

        const ticketName = `ticket-${ticketNum}`;

        const channel = await interaction.guild.channels.create({
            name: ticketName,
            type: ChannelType.GuildText,
            parent: category,
            PermissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                },
                {
                    id: supportRoleId,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                }
            ]
        });

        const closeButton = new ButtonBuilder()
            .setCustomId('ticket_close')
            .setLabel("Fermer")
            .setEmoji('🔒')
            .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder().addComponents(closeButton)

        const embed = new EmbedBuilder()
            .setTitle("Ticket Ouvert")
            .setDescription("Merci d'avoir ouvert un ticket.\nUn membre du staff vous répondera bientôt.")
            .setColor(color)
            .setFooter({ text: text, iconURL: logo })
        
        await interaction.reply({
            content: `Ticket créé : ${channel}`,
            ephemeral: true
        })
        
        await channel.send({
            content: `<@${interaction.user.id}> ${supportRole}`,
            embeds: [embed],
            components: [row]
        })
    }
}