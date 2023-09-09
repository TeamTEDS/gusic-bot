const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');
const GuildSchema = require('../../../schemas/GuildSchema');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('help')
    .setDescription('View all the possible commands!'),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {[]} args
   */
  options: {
    cooldown: 15000,
  },
  run: async (client, interaction, args) => {
    await interaction.deferReply();

    let prefix = config.handler.prefix;

    if (config.handler?.mongodb?.toggle) {
      try {
        const data = await GuildSchema.findOne({ guild: message.guildId });

        if (data && data?.prefix) prefix = data.prefix;
      } catch {
        prefix = config.handler.prefix;
      }
    }

    const mapIntCmds = client.applicationcommandsArray.map(
      (v) => `\`/${v.name}\`: ${v.description || '(No description)'}`
    );

    const user = interaction.user;

    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle('Commands')
          .addFields({
            name: 'Slash commands',
            value: `${mapIntCmds.join('\n')}`,
          })
          .setColor('DarkRed')
          .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL(),
          }),
      ],
    });
  },
};
