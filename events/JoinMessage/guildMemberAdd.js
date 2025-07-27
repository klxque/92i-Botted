const { Events, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { logo, color, text } = require('../../config.json');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const serverJoinMessageKey = `server_${member.guild.id}_joinMessage`;
        const channelId = await db.get(serverJoinMessageKey);
        const messageChannel = member.guild.channels.cache.get(channelId);

        const embed = new EmbedBuilder()
            .setColor(color)
            .setFooter({ text: text, iconURL: logo })
            .setTitle("Une nouvelle pousse sur le serveur !")
            .setDescription(`Bienvenue ${member} sur **${member.guild.name}**,\nnous sommes maintenant **${member.guild.memberCount}** !`)
            .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 512 }))

        if (messageChannel) {
            await messageChannel.send({ embeds: [embed] });
        }
    }
}