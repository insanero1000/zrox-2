/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */

//Importing all needed Commands
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const colors = require("colors"); //this Package is used, to change the colors of our Console! (optional and doesnt effect performance)
const Enmap = require("enmap"); //this package is our Database! We will use it to save the data for ever!
const fs = require("fs"); //this package is for reading files and getting their inputs
const Emoji = require("./botconfig/emojis.json")
const config = require("./botconfig/config.json")
const { delay } = require("./handlers/functions")
//Creating the Discord.js Client for This Bot with some default settings ;) and with partials, so you can fetch OLD messages
const client = new Discord.Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  shards: "auto",
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  presence: {
    afk: false,
    activity: {
      name: `${config.status.text}`.replace("{prefix}", config.prefix), 
      type: config.status.type, 
      url: config.status.url
    },
    status: "online"
  }
});



client.setMaxListeners(50);
require('events').defaultMaxListeners = 50;



const Meme = require("memer-api");
client.memer = new Meme("7Yj4j3k3K98");//GET a TOKEN HERE: https://discord.gg/Mc2FudJkgP


client.adenabled = true;
client.statusad = {
  name: `Bero-Host.de | Host Bots, Websites and Games 4 CHEAP`,
  type: "PLAYING", 
  url: "https://twitch.tv/#"
};
client.spacedot = "・";
client.textad = "Bero-Host.de | Host Bots, Websites and Games 4 CHEAP";


//Loading discord-buttons
const dbs = require('discord-buttons');
dbs(client);

function requirehandlers(){
  client.basicshandlers = Array(
    "extraevents", "loaddb", "clientvariables", "command", "events", "erelahandler"
  );
  client.basicshandlers.forEach(handler => {
    try{ require(`./handlers/${handler}`)(client); }catch (e){ console.log(e) }
  });
}requirehandlers();

function requiresociallogs(){
  client.socialhandlers = Array(
    "twitterfeed", /*"twitterfeed2",*/ "livelog", "youtube", "tiktok"
  );
  client.socialhandlers.forEach(handler=>{
    try{ require(`./social_log/${handler}`)(client); }catch (e){ console.log(e) }
  })
}requiresociallogs();

function requireallhandlers(){
  client.allhandlers = Array(
    "apply", "apply2", "apply3", "apply4", "apply5",
    "ticket", "ticket2", "ticket3", "ticket4", "ticket5", "ticketevent",
    "roster", "roster2", "roster3",
    "welcome", "leave",
    "jointocreate", "logger", "reactionrole", "ranking",
    "antidiscord", "antilinks","anticaps", "blacklist", "keyword",
    "membercount", "autoembed", "suggest", "validcode", "dailyfact", "autonsfw",
    "aichat", "mute"
  )
  client.allhandlers.forEach(handler => {
    try{ require(`./handlers/${handler}`)(client); }catch (e){ console.log(e) }
  });
}requireallhandlers();

//login to the Bot
client.login(config.token);

module.exports.requirehandlers = requirehandlers;
module.exports.requiresociallogs = requiresociallogs;
module.exports.requireallhandlers = requireallhandlers;
async function restartbot(){
  //clear the commands collection
  await client.commands.clear();
  //Delete all files from the cache
  await fs.readdirSync("./commands/").forEach((dir) => {
    const commands = fs.readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
    for (let file of commands) {
      try{
        console.log(`SUCCESS :: ./commands/${dir}/${file}.js`)
        delete require.cache[require.resolve(`./commands/${dir}/${file}.js`)]
      }catch{ 
      }  
    }
  })
  //WAIT 1 SEC
  await delay(1000);
  //clear all events
  await client.removeAllListeners()
  //wait 1 Sec
  await delay(1000);
  //REMOVE ALL BASICS HANDLERS
  await client.basicshandlers.forEach(handler => {
    try{ delete require.cache[require.resolve(`./handlers/${handler}`)]; console.log(`SUCCESS :: ./handlers/${handler}`); }catch (e){ console.log(e) }
  });
  //REMOVE ALL SOCIAL HANDLERS
  await client.socialhandlers.forEach(handler=>{
    try{ delete require.cache[require.resolve(`./social_log/${handler}`)]; console.log(`SUCCESS :: ./social_log/${handler}`); }catch (e){ console.log(e) }
  })
  //REMOVE ALL OTHER HANDLERS
  await client.allhandlers.forEach(handler => {
    try{ delete require.cache[require.resolve(`./handlers/${handler}`)]; console.log(`SUCCESS :: ./handlers/${handler}`); }catch (e){ console.log(e) }
  });
  client.Joblivelog.stop()
  client.Joblivelog2.stop()
  client.Jobyoutube.stop()
  client.Jobtwitterfeed.stop()
  client.Jobtiktok.stop()
  client.Jobautonsfw.stop()
  client.Jobroster.stop()
  client.Jobroster2.stop()
  client.Jobroster3.stop()
  client.Jobmembercount.stop()
  client.JobJointocreate.stop()
  client.JobJointocreate2.stop()
  client.Jobdailyfact.stop()
  client.Jobmute.stop()
  //wait 1 Sec
  await delay(1000);
  //Load the basics, (commands, dbs, events, etc.)
  requirehandlers();
  //LOAD THE SOCIAL LOGS
  requiresociallogs();
  //LOAD ALL OTHER HANDLERS
  requireallhandlers();
  client.login(config.token);
}

module.exports.restartbot = restartbot


/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
