import Command from "./command";
import { Client, EmbedBuilder, Message } from "discord.js";

const embed = new EmbedBuilder()
    .setTitle("BitCrowns")
    .setURL("https://github.com/NoelNimstad/BitCrowns")
    .setColor("White")
    .setFooter({ text: "Noel Nimstad", iconURL: "https://imgur.com/T2rAokx.png" })
    .addFields( { name: "About", value: "BitCrowns is an honorary currency system hosted and run by Noel Nimstad.\nRun `// commands` to see a list of commands" }, 
                { name: "Current Conversion Rate", value: "1₿ = 0.1kr\n10kr = 1₿" });

function Help(client: Client, message: Message, args: Array<string>)
{
    message.channel.send({ embeds: [ embed ] });
}

const HelpCommand: Command = { name: "help", func: Help };

export default HelpCommand