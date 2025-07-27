const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`✅ Le bot est prêt ! Connecté en tant que ${client.user.tag}.`);

        for (const guild of client.guilds.cache.values()) {
            try {
                await guild.members.fetch();
            } catch (err) {
                console.warn(`Impossible de fetch les membres du serveur ${guild.name} :`, err.message);
            }
        }

        const activities = [
            () => {
                const uniqueUsers = new Set();
                client.guilds.cache.forEach(guild => {
                    guild.members.cache.forEach(member => {
                        uniqueUsers.add(member.user.id);
                    });
                });
                return `${uniqueUsers.size} utilisateurs`;
            },
            () => `${client.guilds.cache.size} serveurs`,
            () => 'index.js',
            () => 'code',
        ];

        let i = 0;
        setInterval(() => {
            const activity = activities[i % activities.length]();
            client.user.setPresence({
                activities: [{ name: activity, type: ActivityType.Watching }],
                status: 'idle',
            });
            i++;
        }, 5000);
    },
};
