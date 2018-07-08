/**
 * @file Info InviteCommand - Gets the invite link for the bot  
 * **Aliases**: `inv`, `links`, `shill`
 * @module
 * @category info
 * @name invite
 * @returns {MessageEmbed} Invite link along with other links
 */

const {MessageEmbed} = require('discord.js'), 
  {Command} = require('discord.js-commando'), 
  {stripIndents} = require('common-tags'), 
  {deleteCommandMessages, stopTyping, startTyping} = require('../../components/util.js');

module.exports = class InviteCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'invite',
      memberName: 'invite',
      group: 'info',
      aliases: ['inv', 'links', 'shill'],
      description: 'Gives you invitation links',
      examples: ['invite'],
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run (msg) {
    startTyping(msg);
    const inviteEmbed = new MessageEmbed();

    inviteEmbed
      .setTitle('Clara by Jimmy')
      .setThumbnail('https://cdn.discordapp.com/avatars/465010060284788746/106257a13ac02bfa1df5c892a8a1ce43.png?size=2048')
      //.setURL('https://favna.xyz/ribbon')
      .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
      .setDescription(stripIndents`Enrich your Discord server with a fully modular Discord bot with many many commands\n
        [Add me to your server](https://discordapp.com/oauth2/authorize?client_id=465010060284788746&scope=bot&permissions=8)
        [Join the Support Server](https://discord.gg/4eMsYmx)
 `);
       




       

    deleteCommandMessages(msg, this.client);
    stopTyping(msg);

    return msg.embed(inviteEmbed 'Need help with the bot? Join our support server to get help. Just click **Join the Support Server to join.');
  }
};
