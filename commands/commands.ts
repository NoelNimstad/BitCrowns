import Command from "./command";
import { Client, EmbedBuilder, Message } from "discord.js";

const embed = new EmbedBuilder()
    .setTitle("Commands")
    .setColor("White")
    .setFooter({ text: "Noel Nimstad", iconURL: "https://imgur.com/T2rAokx.png" })
    .addFields( { name: "// help", value: "Displays the current conversion rate and a bot description" },
                { name: "// wallet", value: "Displays your current wallet" },
                { name: "// stake", value: "Creates a new stake pot" }, 
                { name: "// commands", value: "Displays all BitCrowns commands" });

function Commands(client: Client, message: Message, args: Array<string>)
{
    message.channel.send({ embeds: [ embed ] });
}

const CommandsCommand: Command = { name: "commands", func: Commands };

export default CommandsCommand