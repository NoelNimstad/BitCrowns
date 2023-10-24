import { Client, Events, GatewayIntentBits, Message, Partials } from "discord.js";
import Command from "./commands/command";

// Commands
import HelpCommand from "./commands/help";
import Stakecommand from "./commands/stake";
import WalletCommand from "./commands/wallet";
import CommandsCommand from "./commands/commands";
let commands: Array<Command> = [ HelpCommand, CommandsCommand, WalletCommand, Stakecommand ];

// Client
const client: Client = new Client({ intents: [  GatewayIntentBits.Guilds, 
                                                GatewayIntentBits.GuildMessages, 
                                                GatewayIntentBits.MessageContent,     
                                                GatewayIntentBits.GuildScheduledEvents], 
                                                partials: [ Partials.Channel ] });

// Command Handler
function HandleCommand(message: Message)
{
    const content: string = message.content.split("// ")[1];
    const args: Array<string> = content.split(" ");

    const command: Command | undefined = commands.find(elem => elem.name == args[0]);
    if(command)
    {
        command.func(client, message, args, content);
    } else 
    {
        message.channel.send("command not found!");
    }
}

// Events
client.once(Events.ClientReady, () => 
{
    console.log("brewing");
});

client.on(Events.MessageCreate, message => 
{
    if(message.content.startsWith("// ")) HandleCommand(message);
});

// Login
client.login(process.env.TOKEN);