const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Playlist = require('../../settings/models/Playlist.js');

module.exports = { 
    name: "private",
    description: "Private a playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: 3
        }
    ],
    run: async (interaction, client, user, language) => {

        const value = interaction.options.getString("name");

        try {
            if (user && user.isPremium) {

        const PName = value.replace(/_/g, ' ');
 
        const playlist = await Playlist.findOne({ name: PName });
        if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "private_notfound")}`);
        if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "private_owner")}`);

        const Private = await Playlist.findOne({ name: PName, private: true });
        if(Private) return interaction.editReply(`${client.i18n.get(language, "playlist", "private_already")}`);

        const msg = await interaction.editReply(`${client.i18n.get(language, "playlist", "private_loading")}`);

        playlist.private = true;

        playlist.save().then(() => {
            const embed = new MessageEmbed()
                .setDescription(`${client.i18n.get(language, "playlist", "private_success")}`)
                .setColor(client.color)
            msg.edit({ content: " ", embeds: [embed] });
        });

    } else {
        const Premiumed = new MessageEmbed()
            .setAuthor({ name: `${client.i18n.get(language, "nopremium", "premium_author")}`, iconURL: client.user.displayAvatarURL() })
            .setDescription(`${client.i18n.get(language, "nopremium", "premium_desc")}`)
            .setColor(client.color)
            .setTimestamp()

            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Get Free Premium")
                    .setEmoji("<:premium:980510994214314015>")
                    .setStyle("LINK")
                    .setURL(`https://discord.gg/DBhmbAyykP`)
            )

        return interaction.editReply({ content: " ", embeds: [Premiumed], components: [row] });
      }
    } catch (err) {
        console.log(err)
        interaction.editReply({ content: `${client.i18n.get(language, "nopremium", "premium_error")}` })
        }
    }
};