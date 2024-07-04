import { Command } from "commander";
import { SvelteKitCommands } from "./commands/svelte/index.js";
import { ViteCommands } from "./commands/vite/index.js";

const program = new Command();

program
    .name("clay")
    .description("A CLI for scaffolding applications")
    .version("0.0.0")

SvelteKitCommands(program);

ViteCommands(program);

program.parse(process.argv);
