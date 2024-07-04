import { Command } from "commander";
import figlet from "figlet";
import { SvelteKitCommands } from "./commands/svelte/index.js";
import { ViteCommands } from "./commands/vite/index.js";


console.log(
    figlet.textSync("CREJS", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
    })
);
console.log("\n\n");

const program = new Command();

program
    .name("crejs")
    .description("A CLI for scaffolding applications")
    .version("0.1.2")

SvelteKitCommands(program);

ViteCommands(program);

program.parse(process.argv);
