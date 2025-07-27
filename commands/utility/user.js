const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { color, text, logo, supportRoleId, supportId, owner } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription("Donne les informations de l'utilisateur")
        .addUserOption(option =>
            option.setName('membre')
                .setDescription("L'utilisateur à inspecter")
                .setRequired(false)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser('membre') || interaction.user;
        const member = interaction.guild.members.cache.get(target.id);

        const badgeTranslations = {
            DISCORD_EMPLOYEE: "<:discord_employee:1398383791978053713>",
            PARTNERED_SERVER_OWNER: "<:blurple_partner:1398383827046367424>",
            HYPESQUAD_EVENTS: "<:Discord_HypeSquad_Event:1398383877642518679>",
            HOUSE_BRAVERY: "<:hypesquad_bravery_badge:1398383890413916230>",
            HOUSE_BRILLIANCE: "<:hypesquad_brilliance_badge:1398383902061629470>",
            HOUSE_BALANCE: "<:hypesquad_balance_badge:1398383919434436680>",
            EARLY_SUPPORTER: "<:Nitro_Early_supporter:1398383933338685601>",
            VERIFIED_DEVELOPER: "<:blurple_verified_bot_developer:1398383962383974555>",
            BUGHUNTER_LEVEL_1: "<:BUGHUNTER_LEVEL_1:1398383990045544680>",
            BUGHUNTER_LEVEL_2: "<:bughunter_2:1398384002754281613>",
            ACTIVE_DEVELOPER: "<:badge_active_developer:1398383978314207302>"
        };

        function camelToSnakeUpper(str) {
            return str.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
        }

        const userData = await target.fetch();
        const flags = userData.flags?.toArray() || [];

        const badges = flags.length > 0
            ? flags.map(flag => badgeTranslations[camelToSnakeUpper(flag)] || flag).join(', ')
            : "Aucun";

        const nitroTypes = {
            0: "Non",
            1: "<a:basic_nitro:1398383742694981705> - Nitro Classic",
            2: "<:discord_employee:1398383791978053713> - Nitro Boost"
        };
        const nitro = nitroTypes[target.premiumType] || "Non";

        const customBadges = [];

        if (target.id === owner) {
            customBadges.push("<:92i_dev:1398390917295247380> ▸ 92i Developer");
        }

        try {
            const supportGuild = await interaction.client.guilds.fetch(supportId);
            const supportMember = await supportGuild.members.fetch(target.id).catch(() => null);
            if (supportMember && supportMember.roles.cache.has(supportRoleId)) {
                customBadges.push("<:92i_support:1398363450601640197> ▸ 92i Support");
            }
        } catch {}

        const embed = new EmbedBuilder()
            .setTitle("User")
            .setColor(color)
            .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter({ text: text, iconURL: logo })
            .addFields(
                { name: "<:id:1398362845737123921>・ID", value: target.id, inline: true },
                { name: "<:id:1398362845737123921>・Pseudo", value: target.tag, inline: true },
                { name: "<:status:1398362958484078623>・Status", value: member?.presence?.status || "offline", inline: true },
                { name: "<:time:1398363303348015259>・Compte créé le :", value: `<t:${Math.floor(target.createdTimestamp / 1000)}:F>`, inline: true },
                { name: "<:time2:1398362930608869417>・A rejoint le serveur le:", value: member?.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : "Inconnu", inline: true },
                { name: "<:boost:1398362866096148531>・Boost :", value: member?.premiumSince ? "Oui" : "Non", inline: true },
                { name: "<:nitro:1398362866096148531>・Nitro :", value: nitro, inline: true },
                { name: "<:badges:1398380423641436270>・Badges :", value: badges, inline: true },
                {
                    name: "<:badges:1398380423641436270>・92i Badges :",
                    value: customBadges.length
                        ? customBadges.sort((a, b) => {
                            if (a.includes("Developer")) return -1;
                            if (b.includes("Developer")) return 1;
                            return 0;
                        }).join(',\n')
                        : "Non"
                }
            );

        await interaction.reply({ embeds: [embed] });
    }
};
