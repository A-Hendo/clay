import { Command } from "commander";
import figlet from "figlet";
import { SvelteKitCommands } from "./commands/svelte/index.js";
import { ViteCommands } from "./commands/vite/index.js";


console.log(
    figlet.textSync("CLAY", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
    })
);
console.log("\n\n");

const program = new Command();

program
    .name("clay")
    .description("A CLI for scaffolding applications")
    .version("0.1.0")

SvelteKitCommands(program);

ViteCommands(program);

program.parse(process.argv);
