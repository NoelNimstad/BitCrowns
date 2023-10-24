import Command from "./command";
import { Client, EmbedBuilder, Message } from "discord.js";

async function Stake(client: Client, message: Message, args: Array<string>, content: string)
{
    const title = content.substring(content.indexOf("'") + 1, content.lastIndexOf("'"));

    if(!title)
    {
        return message.channel.send({ content: "invalid stake title!" })
    }

    const splitTitle = title.split(" ");
    const ammount = args[args.findIndex(elem => elem == splitTitle[splitTitle.length - 1] + "'") + 1];

    const embed = new EmbedBuilder()
        .setTitle(`\"${ title }\" - Stake`)
        .setColor("White")
        .setFooter({ text: "Noel Nimstad", iconURL: "https://imgur.com/T2rAokx.png" })
        .addFields( { name: "Current Pot", value: ammount + "₿" }, 
                    { name: "Contributors", value: "<@500283068284796930>" },
                    { name: "Stake ID", value: "314159265358979323846264338" });

    const m: Message = await message.channel.send({ embeds: [ embed ] });
    console.log(m.id);
}

const Stakecommand: Command = { name: "stake", func: Stake };

export default Stakecommand