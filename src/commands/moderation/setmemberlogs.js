/**
 * @file Moderation SetMemberlogsCommand - Sets the channel used for member logs  
 * **Aliases**: `setmember`
 * @module
 * @category moderation
 * @name setmemberlogs
 * @example setmemberlogs logs
 * @param {ChannelResolvable} LogChannel The channel to use for member logs
 * @returns {MessageEmbed} Setmemberlogs confirmation log
 */

const {Command} = require('discord.js-commando'), 
  {MessageEmbed} = require('discord.js'), 
  {oneLine, stripIndents} = require('common-tags'), 
  {deleteCommandMessages, stopTyping, startTyping} = require('../../components/util.js');

module.exports = class SetMemberlogsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setmemberlogs',
      memberName: 'setmemberlogs',
      group: 'moderation',
      aliases: ['setmember'],
      description: 'Set the memberlogs channel used for logging member logs (such as people joining and leaving). Ensure to enable memberlogs with the "memberlogs" command.',
      format: 'ChannelID|ChannelName(partial or full)',
      examples: ['setmemberlogs logs'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'channel',
          prompt: 'What channel should I set for member logs? (make sure to start with a # when going by name)',
          type: 'channel'
        }
      ]
    });
  }

  hasPermission (msg) {
    return this.client.isOwner(msg.author) || msg.member.hasPermission('ADMINISTRATOR');
  }

  run (msg, {channel}) {
    startTyping(msg);

    const modlogChannel = msg.guild.settings.get('modlogchannel',
        msg.guild.channels.find(c => c.name === 'mod-logs') ? msg.guild.channels.find(c => c.name === 'mod-logs').id : null),
      setMemberLogsEmbed = new MessageEmbed();

    msg.guild.settings.set('memberlogchannel', channel.id);

    setMemberLogsEmbed
      .setColor('#3DFFE5')
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(stripIndents`
    **Action:** Member logs channel changed
    **Channel:** <#${channel.id}>
    `)
      .setTimestamp();

    if (msg.guild.settings.get('modlogs', true)) {
      if (!msg.guild.settings.get('hasSentModLogMessage', false)) {
        msg.reply(oneLine`📃 I can keep a log of moderator actions if you create a channel named \'mod-logs\'
                  (or some other name configured by the ${msg.guild.commandPrefix}setmodlogs command) and give me access to it.
                  This message will only show up this one time and never again after this so if you desire to set up mod logs make sure to do so now.`);
        msg.guild.settings.set('hasSentModLogMessage', true);
      }
      modlogChannel ? msg.guild.channels.get(modlogChannel).send('', {embed: setMemberLogsEmbed}) : null;
    }

    deleteCommandMessages(msg, this.client);
    stopTyping(msg);

    return msg.embed(setMemberLogsEmbed);
  }
};