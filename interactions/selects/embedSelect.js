const { EmbedBuilder } = require('discord.js');

module.exports = {
    customId: 'embed_select',
    async execute(interaction) {
        const selectedValue = interaction.values[0];
        
        const instructions = {
            'embed_title': {
                prompt: '📝 **Veuillez envoyer le titre de l\'embed :**',
                example: 'Exemple : Mon Super Titre'
            },
            'embed_desc': {
                prompt: '📄 **Veuillez envoyer la description de l\'embed :**',
                example: 'Exemple : Ma description détaillée...'
            },
            'embed_author': {
                prompt: '👤 **Veuillez envoyer le nom de l\'auteur :**',
                example: 'Exemple : Nom de l\'auteur'
            },
            'embed_footer': {
                prompt: '📌 **Veuillez envoyer le texte du footer :**',
                example: 'Exemple : Texte du footer'
            },
            'embed_thumbnail': {
                prompt: '🖼️ **Veuillez envoyer l\'URL du thumbnail :**',
                example: 'Exemple : https://example.com/image.png'
            },
            'embed_timestamp': {
                prompt: '⏰ **Veuillez envoyer le timestamp :**',
                example: 'Tapez "maintenant" pour l\'heure actuelle, ou une date ISO'
            },
            'embed_image': {
                prompt: '🖼️ **Veuillez envoyer l\'URL de l\'image :**',
                example: 'Exemple : https://example.com/image.png'
            },
            'embed_color': {
                prompt: '🎨 **Veuillez envoyer la couleur :**',
                example: 'Exemple : ff0000, red, ou 255,0,0'
            }
        };

        const instruction = instructions[selectedValue];
        if (!instruction) return;

        await interaction.reply({
            content: `${instruction.prompt}\n\n*${instruction.example}*\n\n⏱️ Vous avez 60 secondes pour répondre.`,
            ephemeral: true
        });

        const filter = (msg) => msg.author.id === interaction.user.id;
        
        try {
            const collected = await interaction.channel.awaitMessages({
                filter,
                max: 1,
                time: 60000,
                errors: ['time']
            });

            const userMessage = collected.first();
            const userInput = userMessage.content.trim();

            try {
                await userMessage.delete();
            } catch (error) {
                console.log('Impossible de supprimer le message utilisateur');
            }

            const currentEmbed = interaction.message.embeds[0];
            const embed = EmbedBuilder.from(currentEmbed);

            let success = true;
            let errorMessage = '';

            switch (selectedValue) {
                case 'embed_title':
                    if (userInput.length > 256) {
                        errorMessage = 'Le titre ne peut pas dépasser 256 caractères !';
                        success = false;
                    } else {
                        embed.setTitle(userInput || null);
                    }
                    break;

                case 'embed_desc':
                    if (userInput.length > 4000) {
                        errorMessage = 'La description ne peut pas dépasser 4000 caractères !';
                        success = false;
                    } else {
                        embed.setDescription(userInput || '\u200B');
                    }
                    break;

                case 'embed_author':
                    if (userInput.length > 256) {
                        errorMessage = 'Le nom de l\'auteur ne peut pas dépasser 256 caractères !';
                        success = false;
                    } else {
                        embed.setAuthor({ name: userInput });
                    }
                    break;

                case 'embed_footer':
                    if (userInput.length > 2048) {
                        errorMessage = 'Le footer ne peut pas dépasser 2048 caractères !';
                        success = false;
                    } else {
                        embed.setFooter({ text: userInput });
                    }
                    break;

                case 'embed_thumbnail':
                    if (!userInput.match(/^https?:\/\/.+/)) {
                        errorMessage = 'Veuillez fournir une URL valide !';
                        success = false;
                    } else {
                        embed.setThumbnail(userInput);
                    }
                    break;

                case 'embed_timestamp':
                    if (userInput.toLowerCase() === 'maintenant' || userInput.toLowerCase() === 'now') {
                        embed.setTimestamp();
                    } else if (userInput === '' || userInput.toLowerCase() === 'vide') {
                        embed.data.timestamp = undefined;
                    } else {
                        try {
                            const date = new Date(userInput);
                            if (isNaN(date.getTime())) {
                                throw new Error('Date invalide');
                            }
                            embed.setTimestamp(date);
                        } catch (error) {
                            errorMessage = 'Format de date invalide ! Utilisez : "maintenant", une date ISO ou "vide"';
                            success = false;
                        }
                    }
                    break;

                case 'embed_image':
                    if (!userInput.match(/^https?:\/\/.+/)) {
                        errorMessage = 'Veuillez fournir une URL valide !';
                        success = false;
                    } else {
                        embed.setImage(userInput);
                    }
                    break;

                case 'embed_color':
                    const color = parseColor(userInput);
                    if (color === null) {
                        errorMessage = 'Couleur invalide ! Utilisez : hex (ff0000), nom (red) ou RGB (255,0,0)';
                        success = false;
                    } else {
                        embed.setColor(color);
                    }
                    break;
            }

            if (success) {
                const components = interaction.message.components;
                await interaction.message.edit({ 
                    embeds: [embed], 
                    components: components 
                });

                await interaction.followUp({
                    content: '✅ Embed mis à jour avec succès !',
                    ephemeral: true
                });
            } else {
                await interaction.followUp({
                    content: `❌ ${errorMessage}`,
                    ephemeral: true
                });
            }

        } catch (error) {
            await interaction.followUp({
                content: '⏰ Temps écoulé ! Veuillez réessayer.',
                ephemeral: true
            });
        }
    }
};

function parseColor(colorString) {
    if (!colorString) return null;
    
    // Couleurs nommées
    const namedColors = {
        'red': 0xff0000, 'green': 0x00ff00, 'blue': 0x0000ff,
        'yellow': 0xffff00, 'purple': 0x800080, 'orange': 0xffa500,
        'pink': 0xffc0cb, 'black': 0x000000, 'white': 0xffffff,
        'gray': 0x808080, 'brown': 0xa52a2a
    };
    
    const lower = colorString.toLowerCase();
    if (namedColors[lower]) return namedColors[lower];
    
    const rgbMatch = colorString.match(/^(\d+),(\d+),(\d+)$/);
    if (rgbMatch) {
        const [, r, g, b] = rgbMatch.map(Number);
        if (r <= 255 && g <= 255 && b <= 255) {
            return (r << 16) + (g << 8) + b;
        }
    }
    
    const hexMatch = colorString.match(/^#?([0-9a-f]{6})$/i);
    if (hexMatch) {
        return parseInt(hexMatch[1], 16);
    }
    
    return null;
}