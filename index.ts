import { ActivityType, Client, Events, GatewayIntentBits, Message, Partials } from "discord.js";

// Client
const client: Client = new Client({ intents: [  GatewayIntentBits.Guilds, 
                                                GatewayIntentBits.GuildMessages, 
                                                GatewayIntentBits.MessageContent,     
                                                GatewayIntentBits.GuildScheduledEvents], 
                                                partials: [ Partials.Channel ] });

// Command Handler
function HandleCommand(message: Message)
{
    const content: string = (message.content.split("jar")[1]).replace(" ", "");
    const args: Array<string> = content.split(" ");

    if(!args[0])
    {
        return Leaderboard(message, args);
    } else if (args[0] == "+")
    {
        return Add(message, args);
    } else if (args[0] == "-")
    {
        return Subtract(message, args);
    } else 
    {
        return message.channel.send(`invalid command: ${ args[0] }`);
    }
};

// Leaderboard
async function Leaderboard(message: Message, args: Array<string>)
{
    message.channel.send("1. A\n2. B");
};

// Add
async function Add(message: Message, args: Array<string>)
{    
    let id: string;
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
};

// Subtract
async function Subtract(message: Message, args: Array<string>)
{
    let id: string;
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
};

// Events
client.once(Events.ClientReady, () => 
{
    console.log("preventing swearing since 2023");
});

client.on(Events.MessageCreate, message => 
{
    if(message.content.startsWith("jar")) HandleCommand(message);
});

// Login
client.login(process.env.TOKEN);