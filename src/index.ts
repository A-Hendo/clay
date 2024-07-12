#!/usr/bin/env node

import { Command } from "commander";
import gradient from "gradient-string";
import { NextjsCommands } from "./commands/nextjs/index.js";
import { SvelteKitCommands } from "./commands/svelte/index.js";
import { ViteCommands } from "./commands/vite/index.js";

console.log(gradient("#c24509", "#fe0c31")("CréJs v0.3.0"));
console.log("\n");


const program = new Command();

program
    .name("Crejs")
    .description("A CLI for scaffolding applications")
    .version("0.3.0");

await SvelteKitCommands(program);

await ViteCommands(program);

await NextjsCommands(program);

program.parse(process.argv);
