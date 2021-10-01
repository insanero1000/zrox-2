var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
var {
  databasing
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageMenuOption, MessageMenu } = require('discord-buttons')
module.exports = {
  name: "setup-warn",
  category: "💪 Setup",
  aliases: ["setupwarn", "warn-setup", "warnsetup", "warnsystem"],
  cooldown: 5,
  usage: "setup-warn --> Follow Steps",
  description: "Adjust the Settings for the warn system, like add a Role per specific warn amount or ban/kick on a specific amount of warn",
  memberpermissions: ["ADMINISTRATOR"],
  run: async (client, message, args, cmduser, text, prefix) => {
    var es = client.settings.get(message.guild.id, "embed")
    try {
      first_layer()
      async function first_layer(){
        let warnsettings = client.settings.get(message.guild.id, "warnsettings")
        let menuoptions = [
          {
            value: "Kick Amount",
            description: `${warnsettings.kick ? `A User will be kicked if he has ${warnsettings.kick} Warns,change it` : `Define a WarnAmount someone needs to have, to get kicked`}`,
            emoji: "🔨"
          },
          {
            value: "Ban Amount",
            description: `${warnsettings.kick ? `A User will be banned if he has ${warnsettings.ban} Warns,change it` : `Define a WarnAmount someone needs to have, to get kicked`}`,
            emoji: "📤"
          },
          {
            value: "Add Role on Warn",
            description: `Define a Role to give, if he has X Warns`,
            emoji: "📌"
          },
          {
            value: "Remove Role on Warn",
            description: `Remove a X Warn Defined Role`,
            emoji: "💢"
          },
          {
            value: "Show Settings",
            description: `Show the Current Settings`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Ticket-Setup!`,
            emoji: "833101993668771842"
          }
        ]
        //define the selection
        let Selection = new MessageMenu()
          .setID('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Warn System!');  //message in the content placeholder
        menuoptions.forEach(option => {
          let row = new MessageMenuOption()
            .setLabel(option.label ? option.label : option.value)
            .setValue(option.value) 
            .setDescription(option.description) 
            .setDefault() 
          if(option.emoji) row.setEmoji(option.emoji) 
          Selection.addOption(row)
        })
        
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
        .setColor(es.color)
        .setAuthor("Warn Setup", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/prohibited_1f6ab.png", "https://discord.gg/FQGXbypRf8")
        .setDescription("***Select what you need in the `Selection` down Below!***")
        let used1 = false;
        //send the menu msg
        let menumsg = await message.channel.send(MenuEmbed, Selection)
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v => v.value == menu.values[0])
          let menuoptionindex = menuoptions.findIndex(v => v.value == menu.values[0])
          if(menu.values[0] == "Cancel") return menu.reply.send(":x: Cancelled the Setup!")
          menu.reply.defer();
          used1 = true;
          second_layer(menuoptionindex, menuoptiondata)
        }
        //Event
        client.on('clickMenu', (menu) => {
          if (menu.message.id === menumsg.id) {
            if (menu.clicker.user.id === cmduser.id) {
              if(used1) return menu.reply.send(`<:no:833101993668771842> You already selected something, this Selection is now disabled!`, true);
              menuselection(menu);
            }
            else menu.reply.send(`<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, true);
          }
        });
      }

      async function handle_the_picks(optionhandletype, SetupNumber, ticket) {
        
        switch (optionhandletype) {
          case 0:  
              var msg6 = new MessageEmbed()
                .setTitle(`**Hey ${message.author.username}!**`)
                .setDescription(`Please input the message of the ticket setup`)
                .setFooter(es.footertext, es.footericon)
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              message.channel.send({embed: msg6}).then(msg => {
              msg.channel.awaitMessages(m => m.author.id == cmduser, {
                max: 1,
                time: 180000,
                errors: ['time'],
              }).then(collected => {
                ticketmsg = collected.first().content;
                message.guild.channels.create("Support - Tickets", {
                    type: 'category',
                    permissionOverwrites: [{
                      id: message.guild.id,
                      allow: ['READ_MESSAGE_HISTORY'],
                      deny: ['SEND_MESSAGES'],
                    }, ],
                  })
                  .then((channel) => {
                    //PARENT ID IN DB
                    client.setups.set(message.guild.id, channel.id, `ticketsystem${SetupNumber}.parentid`);
                    //PARENT ID IN DB
                    var lol = message.guild.channels
                      .create("Create a ticket", {
                        type: 'text',
                        topic: `React with ${emoji} to open a Ticket`,
                        parent: channel.id,
                        permissionOverwrites: [{
                          id: message.guild.id,
                          allow: ['READ_MESSAGE_HISTORY'],
                          deny: ['SEND_MESSAGES'],
                        }, ],
                      })
                      .then((channel) => {
                        //channel id in db
                        client.setups.set(message.guild.id, channel.id, `ticketsystem${SetupNumber}.channelid`);
                        //channel id in db
                        let button_open = new MessageButton().setStyle('green').setID('create_a_ticket').setLabel('Create a Ticket').setEmoji("📨") 
    
                        channel.send({embed: new MessageEmbed()
                          .setTitle(`📨 **Create a Ticket**`)
                          .setDescription(`${ticketmsg}`)
                          .setFooter(es.footertext, es.footericon)
                          .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                          , buttons: [button_open]}).then(msg => {
                          //message id in db
                          console.log(`ticketsystem${SetupNumber}.messageid`)
                          client.setups.set(message.guild.id, msg.id, `ticketsystem${SetupNumber}.messageid`);
                          client.setups.set(message.guild.id, true, `ticketsystem${SetupNumber}.enabled`);
                          //msg.react(emoji2react)
                          var themebd = new MessageEmbed()
                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                            .setTitle(`Your Ticket Setup is created, you can edit everything by running \`${prefix}setup\` again`)
                            .setDescription(`<#${channel.id}>`)
                            .setFooter(es.footertext, es.footericon)
                            
                          message.reply(themebd)
                        })
                      })
                  })
              }).catch(error => {
                return message.reply(new Discord.MessageEmbed()
                  .setTitle("<:no:833101993668771842> ERROR | Your Time ran out")
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(es.footertext, es.footericon)
                );
              })
              })
            break;
          case 1:
            var rembed = new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setFooter(es.footertext, es.footericon)
              
              .setTitle("Enter the message now!")
              .setDescription(`{user} == the user who opens the ticket`)
              message.channel.send({embed: rembed}).then(msg => {
              msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                message.reply("Successfully changed the Message")
                client.setups.set(message.guild.id, collected.first().content, `ticketsystem${SetupNumber}.message`);
                console.log(client.setups.get(message.guild.id, `ticketsystem${SetupNumber}`));
              }).catch(error => {
                return message.reply(new Discord.MessageEmbed()
                  .setTitle("<:no:833101993668771842> ERROR | Your Time ran out")
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(es.footertext, es.footericon)
                );
              })
            })
            break;
          case 2:
            var rrembed = new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setFooter("Pick the INDEX NUMBER", es.footericon)
              
              .setTitle("Ping a Role now!")
              .setDescription(`Just Ping the Role`)
              message.channel.send({embed: rrembed}).then(msg => {
              msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                var role = collected.first().mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
                if (!role) message.reply("CANCELLED, u didn't Pingged a valid Role")

                message.reply("Successfully **added**: `" + role.name + "` to the Admin-Roles");
                client.setups.push(message.guild.id, role.id, `ticketsystem${SetupNumber}.adminroles`);
                
              }).catch(error => {
                return message.reply(new Discord.MessageEmbed()
                  .setTitle("<:no:833101993668771842> ERROR | Your Time ran out")
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(es.footertext, es.footericon)
                );
              })
            })
            break;
          case 3:
            var rrrembed = new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setFooter("Pick the INDEX NUMBER", es.footericon)
              .setTitle("Ping a Role now!")
              .setDescription(`Just Ping the Role`)
              message.channel.send({embed: rrrembed}).then(msg => {
              msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                var role = collected.first().mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
                if (!role) message.reply("CANCELLED, u didn't Pingged a valid Role")
                try {
                  client.setups.remove(message.guild.id, role.id, `ticketsystem${SetupNumber}.adminroles`);
                  message.reply("Successfully **removed**: `" + role.name + "` from the Admin-Roles");
                } catch {
                  message.reply("ERROR -> Resetted all Admin roles")
                  client.setups.set(message.guild.id, [], `ticketsystem${SetupNumber}.adminroles`);
                }
              }).catch(error => {
                return message.reply(new Discord.MessageEmbed()
                  .setTitle("<:no:833101993668771842> ERROR | Your Time ran out")
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(es.footertext, es.footericon)
                );
              })
            })
            break;
          case 4:
            var rembed = new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setFooter(es.footertext, es.footericon)
              
              .setTitle("Enter the open Ticket Category now!")
              .setDescription(`Just send the CATEGORY ID IN HERE, this is an example: \`833614604604276736\``)
              message.channel.send({embed: rembed}).then(msg => {
              msg.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                time: 30000,
                errors: ['time']
              }).then(collected => {
                if(collected.first().content.length == 18){
                  try{
                    var cat = message.guild.channels.cache.get(collected.first().content)
                    message.reply("Successfully changed the Category")
                    client.setups.set(message.guild.id, cat.id, `ticketsystem${SetupNumber}.parentid`);
                  }catch{
                    message.reply("INVALID ID")
                  }
                }else{
                  message.reply("INVALID ID")
                }

              }).catch(error => {
                return message.reply(new Discord.MessageEmbed()
                  .setTitle("<:no:833101993668771842> ERROR | Your Time ran out")
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(es.footertext, es.footericon)
                );
              })
            })
            break;
          default:
            message.reply(String("SORRY, that Number does not exists :(\n Your Input:\n> " + collected.first().content).substr(0, 1999))
          break;
        }
      }
     
     
  

    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.channel.send(new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(es.footertext, es.footericon)
        .setTitle(`<:no:833101993668771842> Something went Wrong`)
        .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``)
      );
    }
  },
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
