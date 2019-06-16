const Discord = require("discord.js");
const Store = require('data-store');
const accounts = new Store({ path: 'accounts.json' });
var randomItem = require('random-item');
const client = new Discord.Client();
client.on("ready", () => {
  console.log("Bot Active.");
});
const channelID = '587894941489823746'
client.on('message', function(message) {
	if(message.content.startsWith('!gen')&&message.channel.id===channelID&&message.content.split(' ').length===2){
		var accList = accounts.clone()
		if(Object.keys(accList).length>0){
			if(accounts.hasOwn(message.content.split(' ')[1])&&accounts.get(message.content.split(' ')[1]).length>0){
				var rand = randomItem(accounts.get(message.content.split(' ')[1]))
				message.author.send(message.author + ' your account is: '+rand)
				message.channel.send(message.author + ' Check your DM!')
				var accArr = accounts.get(message.content.split(' ')[1])
				var accInd = accArr.indexOf(rand)
				accArr.splice( accInd, 1 )
				accounts.set(message.content.split(' ')[1], accArr)
			}else{
				message.channel.send(message.author + ' no service found with that name or that service currently has no accounts.')
			}
		}else{
			message.channel.send('There are no accounts currently.')
		}
	}else if(message.content.startsWith('!status')){
		var statArr = []
		Object.keys(accounts.clone()).forEach(function(service){
			statArr.push({name: service, value: accounts.get(service).length.toString(), inline: true})
		})
		if(statArr.length===0){statArr.push({name: 'No services found.', value: '0'})}
		const embed = {
		  "fields": statArr
		};
		message.channel.send({ embed });
	}else if(message.content.startsWith('!add') && message.member.hasPermission('ADMINISTRATOR')){
		if(message.content.split(' ').length >=3){
			var attributes = message.content.split(' ')
			attributes.slice(2).forEach(function(account){
				accounts.union(attributes[1], account)
			})
			message.channel.send('Accounts added successfully.')
		}else{
			message.channel.send('Account added incorrectly.')
		}
	}
})
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
    client.user.setActivity("Made by It's me mario#5713", { type: "WATCHING" })
})
client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    }

    if (receivedMessage.content.startsWith("?")) {
        processCommand(receivedMessage)
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    if (primaryCommand == "dmall") {
        dmallCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("Hmmmmm. It seems as though this command does not exist! Try ~help for a list of commands.")
    }
}
function dmallCommand(arguments, receivedMessage) {
    if (!receivedMessage.member.hasPermission("ADMINISTRATOR")) return receivedMessage.channel.send("You do not have permission!")
    receivedMessage.delete().catch(O_o => { });
    if (!arguments[0]) return receivedMessage.channel.send("You must provide a message to announce.")
    receivedMessage.guild.members.forEach(member => {
        member.send(arguments.join(" ")).catch(O_o => { })
    })
}
client.on('error', console.error);
client.login("NTg5MDAxNzQwODc1OTg5MDA0.XQNUuQ.etQkoUrjnB0Td0y2upluzQTSWLo");
