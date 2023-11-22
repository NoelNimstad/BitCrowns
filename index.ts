// DB
import { ActivityType, Client, EmbedBuilder, Events, GatewayIntentBits, Message, Partials } from "discord.js";
import * as mongoose from "mongoose";
import User from "./model/User";

// MongoDB Setup
mongoose.connect(`mongodb+srv://${ process.env.DBu }:${ process.env.DBp }@jar.soxupba.mongodb.net/?retryWrites=true&w=majority`);

// Client
const client: Client = new Client({ intents: [  GatewayIntentBits.Guilds, 
                                                GatewayIntentBits.GuildMessages, 
                                                GatewayIntentBits.MessageContent,     
                                                GatewayIntentBits.GuildScheduledEvents], 
                                                partials: [ Partials.Channel ] });

// Command Handler
function HandleCommand(message: Message)
{
    const content: string = (message.content.toLowerCase().split("jar")[1]).replace(" ", "");
    const args: Array<string> = content.split(" ");

    if(!args[0])
    {
        return Leaderboard(message, args);
    } 
    
    switch(args[0])
    {
        /* case "migrate":
            Migrate(message);
            break; */
        case "rules":
            Rules(message, args);
            break;
        case "debt":
            Debt(message, args);
            break;
        case "+":
            Add(message, args);
            break;
        case "indebt":
            Indebt(message, args);
            break;
        case "-":
            Subtract(message, args);
            break;
        case "free":
            Free(message, args);
            break;
        case "sum":
            Sum(message, args);
            break;
        default:
            message.channel.send(`invalid command: ${ args[0] }`);
            break;
    }
};

/* async function Migrate(message: Message)
{
    let users = await User.find();
    for(let i = 0; i < users.length; i++)
    {
        users[i].debt = 0;
        users[i].save();
    }

    message.channel.send("migrated database");
} */

// Leaderboard
async function Leaderboard(message: Message, args: Array<string>)
{
    let users = await User.find();
    let sorted = users.sort((a, b) => { return (b.score || 0) - (a.score || 0) });

    const LeaderboardEmbed = new EmbedBuilder()
        .setTitle("The Jar")
        .setColor("#58eb50")
        .setThumbnail("https://imgur.com/u7in4Nt.png")
        .setFooter({ iconURL: "https://imgur.com/ahGJFsC.png", text: "v2 by Noel Nimstad" });

    let description: string = "";
    for(let i: number = 0; i < sorted.length; i++)
    {
        description += `${ i + 1 }. <@${ sorted[i].id }> ・ ${ sorted[i].score }\n`;
    }
    LeaderboardEmbed.setDescription(description);    

    message.channel.send({ embeds: [ LeaderboardEmbed ] });
};

// Debt
async function Debt(message: Message, args: Array<string>)
{
    let users = await User.find();
    let sorted = users.sort((a, b) => { return (b.debt || 0) - (a.debt || 0) });

    const DebtEmbed = new EmbedBuilder()
        .setTitle("Debt board")
        .setColor("#fcba03")
        .setThumbnail("https://imgur.com/u7in4Nt.png")
        .setFooter({ iconURL: "https://imgur.com/ahGJFsC.png", text: "v2 by Noel Nimstad" });

    let description: string = "";
    for(let i: number = 0; i < sorted.length; i++)
    {
        description += `${ i + 1 }. <@${ sorted[i].id }> ・ ${ sorted[i].debt }kr\n`;
    }
    DebtEmbed.setDescription(description);    

    message.channel.send({ embeds: [ DebtEmbed ] });
};

// Rules
const RulesEmbed = new EmbedBuilder()
    .setTitle("Rules")
    .setColor("White")
    .setFields({ name: "Rule №1", value: "No swearing during school hours" },
               { name: "Rule №2", value: "If we finish early, then swearing is *not* allowed until school hours end" },
               { name: "Rule №3", value: "Substituting swearwords with non-swear variants is not allowed; e.g fuck -> frick" },
               { name: "Rule №4", value: "Abreviations of swears are *not* allowed; e.g bullshit -> bs" },
               { name: "\"Exceptions\"", value: "- Damn\n- Darn" })
    .setThumbnail("https://imgur.com/u7in4Nt.png")
    .setFooter({ iconURL: "https://imgur.com/ahGJFsC.png", text: "v2 by Noel Nimstad" });
async function Rules(message: Message, args: Array<string>)
{
 
    message.channel.send({ embeds: [ RulesEmbed ] });
};

// Indebt
async function Indebt(message: Message, args: Array<string>)
{    
    let id: string = "";
    let username: string = "";
    if(args.length == 2) // extract user id
    {
        id = message.author.id;
    } else if(args.length == 3 && message.mentions.users.size == 1)
    {
        id = message.mentions.users.at(0)?.id || "";
    } else
    {
        message.channel.send(`invalid command arguments: ${ args }`);
    }

    let ammount: number = parseInt(args[1]);
    if(!ammount)
    {
        message.channel.send(`invalid command arguments: ${ args }`);
    }

    let check = await User.exists({ id: id });
    let target;
    if(!check)
    {
        target = await User.create
        ({
            id: id,
            score: 0
        });
        await target.save();
    } else 
    {
        target = await User.findOne({ id: id });
    }

    if(!target) return;
    if(!target.debt && target.debt != 0) return;
    target.debt += ammount;
    target.save();

    const AddEmbed = new EmbedBuilder()
        .setColor("#43eb34")
        .setTimestamp()
        .setDescription(`added ${ ammount }kr of debt to <@${ id }>\ntotal: ${ target.debt }kr of debt`);
    message.channel.send({ embeds: [ AddEmbed ] });
};

// Indebt
async function Add(message: Message, args: Array<string>)
{    
    let id: string = "";
    let username: string = "";
    if(args.length == 1) // extract user id
    {
        id = message.author.id;
    } else if(args.length == 2 && message.mentions.users.size == 1)
    {
        id = message.mentions.users.at(0)?.id || "";
    } else
    {
        message.channel.send(`invalid command arguments: ${ args }`);
    }

    let check = await User.exists({ id: id });
    let target;
    if(!check)
    {
        target = await User.create
        ({
            id: id,
            score: 0
        });
        await target.save();
    } else 
    {
        target = await User.findOne({ id: id });
    }

    if(!target) return;
    if(!target.score && target.score != 0) return;
    if(!target.debt && target.debt != 0) return;
    target.score += 1;
    target.debt += 1;
    target.save();

    const AddEmbed = new EmbedBuilder()
        .setColor("#43eb34")
        .setTimestamp()
        .setDescription(`added 1 to <@${ id }>\ntotal: ${ target.score } swears`);
    message.channel.send({ embeds: [ AddEmbed ] });
};

// Subtract
async function Subtract(message: Message, args: Array<string>)
{
    let id: string = "";
    let username: string = "";
    if(args.length == 1) // extract user id
    {
        id = message.author.id;
    } else if(args.length == 2 && message.mentions.users.size == 1)
    {
        id = message.mentions.users.at(0)?.id || "";
    } else
    {
        message.channel.send(`invalid command arguments: ${ args }`);
    }

    let check = await User.exists({ id: id });
    let target;
    if(!check)
    {
        target = await User.create
        ({
            id: id,
            score: 0
        });
        await target.save();
    } else 
    {
        target = await User.findOne({ id: id });
    }

    if(!target) return;
    if(!target.score && target.score != 0) return;
    if(!target.debt && target.debt != 0) return;
    target.score -= 1;
    target.debt -= 1;
    target.save();

    const SubtractEmbed = new EmbedBuilder()
        .setColor("#eb5334")
        .setTimestamp()
        .setDescription(`removed 1 from <@${ id }>\ntotal: ${ target.score }`);
    message.channel.send({ embeds: [ SubtractEmbed ] });
};

// Free
async function Free(message: Message, args: Array<string>)
{    
    let id: string = "";
    let username: string = "";
    if(args.length == 2) // extract user id
    {
        id = message.author.id;
    } else if(args.length == 3 && message.mentions.users.size == 1)
    {
        id = message.mentions.users.at(0)?.id || "";
    } else
    {
        message.channel.send(`invalid command arguments: ${ args }`);
    }

    let ammount: number = parseInt(args[1]);
    if(!ammount)
    {
        message.channel.send(`invalid command arguments: ${ args }`);
    }

    let check = await User.exists({ id: id });
    let target;
    if(!check)
    {
        target = await User.create
        ({
            id: id,
            score: 0
        });
        await target.save();
    } else 
    {
        target = await User.findOne({ id: id });
    }

    if(!target) return;
    if(!target.debt && target.debt != 0) return;
    target.debt -= ammount;
    target.save();

    const AddEmbed = new EmbedBuilder()
        .setColor("#43eb34")
        .setTimestamp()
        .setDescription(`removed ${ ammount }kr of debt from <@${ id }>\ntotal: ${ target.debt }kr of debt`);
    message.channel.send({ embeds: [ AddEmbed ] });
};

// Sum
async function Sum(message: Message, args: Array<string>)
{
    let users = await User.find();
    let sum: number = 0;
    let debt: number = 0;

    for(let i: number = 0; i < users.length; i++)
    {
        sum += users[i].score || 0;
        debt += users[i].debt || 0;
    }

    const SumEmbed = new EmbedBuilder()
        .setColor("#58eb50")
        .setFields({ name: "Swears", value: `${ sum } total swears` },
                   { name: "Debt", value: `${ debt }kr of debt accumulated` })
        .setTimestamp();

    message.channel.send({ embeds: [ SumEmbed ] });
};

// Events
client.once(Events.ClientReady, () => 
{
    console.log("preventing swearing since 2023");
});

client.on(Events.MessageCreate, message => 
{
    if(message.content.toLowerCase().startsWith("jar")) HandleCommand(message);
});

// Login
client.login(process.env.TOKEN);

// Cleanup
async function exitHandler()
{
    await mongoose.disconnect();
    process.exit();
}
process.on('SIGINT', () => exitHandler());