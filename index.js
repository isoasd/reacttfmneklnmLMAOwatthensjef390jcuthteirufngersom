const setupCMD = "!createrolemessage"
let initialMessage = `**React to the messages below to set your region**`;
const roles = ["NA-E", "NA-W", "EU"];
const reactions = ["🥇", "🥈", "🥉"];
const botToken = process.env.BOT_TOKEN;

const Discord = require('discord.js');
const bot = new Discord.Client();
bot.login(botToken);



if (roles.length !== reactions.length) throw "Roles list and reactions list are not the same length!";

function generateMessages(){
    var messages = [];
    messages.push(initialMessage);
    for (let role of roles) messages.push(`React below set your region to **"${role}"**`);
    return messages;
}


bot.on("message", message => {
    if(!message.channel.id === "495741200343760911") return;
    if (message.author.id === "495816794678755328" && message.content.toLowerCase() == setupCMD){
        var toSend = generateMessages();
        let mappedArray = [[toSend[0], false], ...toSend.slice(1).map( (message, idx) => [message, reactions[idx]])];
        for (let mapObj of mappedArray){
            message.channel.send(mapObj[0]).then( sent => {
                if (mapObj[1]){
                  sent.react(mapObj[1]);  
                } 
            });
        }
    }
})


bot.on('raw', event => {
    
    if (event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE"){
        
        
        let channel = bot.channels.get(event.d.channel_id);
        let message = channel.fetchMessage(event.d.message_id).then(msg=> {
        let user = msg.guild.members.get(event.d.user_id);
        let role1 = msg.guild.roles.find(r => r.name === "NA-E");
        let role2 = msg.guild.roles.find(r => r.name === "NA-W");
        let role3 = msg.guild.roles.find(r => r.name === "EU");
         		let rankchannel = msg.guild.channels.find('name', 'rank-me');

         
     
        if (msg.author.id == bot.user.id && msg.content != initialMessage){
       
            var re = `\\*\\*"(.+)?(?="\\*\\*)`;
            var role = msg.content.match(re)[1];
        
            
            if (user.id != bot.user.id){
                var roleObj = msg.guild.roles.find('name', role);
                var memberObj = msg.guild.members.get(user.id);

                
                if (event.t === "MESSAGE_REACTION_ADD"){
                    memberObj.addRole(roleObj);
                   memberObj.removeRole(msg.guild.roles.find(r => r.name === "Starter"));
                   memberObj.addRole(msg.guild.roles.find(r => r.name === "Ranking"));
                    	msg.guild.channels.find('name', 'rank-me').sendMessage(memberObj.toString() + " Set rank!").then(msg => msg.delete(500));

                    

                } else {
                    memberObj.removeRole(roleObj);
                }
            }
        }
        })
 
    }   
});