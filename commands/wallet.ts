import Command from "./command";
import { Client, EmbedBuilder, Message } from "discord.js";


const placeholder = 10;
function Wallet(client: Client, message: Message, args: Array<string>)
{
    const author = message.author.username;

    const embed = new EmbedBuilder()
        .setTitle(author + "'s wallet")
        .setColor("White")
        .setThumbnail("https://imgur.com/dMp22Sg.png")
        .setFooter({ text: "Noel Nimstad", iconURL: "https://imgur.com/T2rAokx.png" })
        .addFields( { name: "BitCrowns", value: placeholder + "₿" }, 
                    { name: "SEK equivalent", value: placeholder / 10 + "kr" });

    message.channel.send({ embeds: [ embed ] });
}

const WalletCommand: Command = { name: "wallet", func: Wallet };

export default WalletCommand