import { Command } from "commander";
import { SvelteCommands } from "./commands/svelte/index.js";
import { ViteCommands } from "./commands/vite/index.js";

const program = new Command();

program
    .name("clay")
    .description("A CLI for creating fullstack apps")
    .version("0.0.0")

SvelteCommands(program);
ViteCommands(program);

program.parse(process.argv);
