import { checkbox, confirm, input, select } from "@inquirer/prompts";
import { Command, Option } from "commander";
import { type Options } from "create-svelte/types/internal.js";
import * as fs from "fs";
import * as path from "path";
import { CreateSvelte } from "../../frameworks/svelte/index.js";


export function SvelteCommands(program: Command) {
    program
        .command("svelte")
        .description("Create a new project")
        .option("-n, --name <name>", "Project name", "my-app")
        .addOption(
            new Option("-t, --template", "Project template - default, skeleton or skeletonlib")
                .choices(["default", "skeleton", "skeletonlib"])
                .default("default"))
        .addOption(
            new Option("-y, --types", "Typechecker - typescript, checkjs or null")
                .choices(["typescript", "checkjs", "null"])
                .default("checkjs"))
        .option("-p, --prettier", "Use Prettier", false)
        .option("-e, --eslint", "Use ESLint", false)
        .option("-w, --playwright", "Use Playwright", false)
        .option("-v, --vitest", "Use Vitest", false)
        .option("-s, --svelte", "Use Svelte", false)
        .option("-i, --interactive", "Enable interactive mode", false)
        .action(async (interactive: boolean, options: Options) => {
            if (interactive) {
                options = await SveltePrompts();
            }

            const projectPath = path.join(process.cwd(), options.name);

            if (fs.existsSync(projectPath)) {
                console.error(`Project folder ${options.name} already exists!`);
                process.exit(1);
            }

            await CreateSvelte(options);
        });
};

export async function SveltePrompts() {
    const options: Options = {
        name: "",
        template: "default",
        types: "checkjs",
        prettier: false,
        eslint: false,
        playwright: false,
        vitest: false,
        svelte5: false,
    };

    options.name = await input({ message: "Project name?" });
    options.template = await select({
        message: "Select a project template",
        choices: [
            { name: "Default", value: "default" },
            { name: "skeleton", value: "skeleton" },
            { name: "skeletonlib", value: "skeletonlib" },
        ],
    });

    options.types = await select({
        message: "Select typechecking",
        choices: [
            { name: "Typescript", value: "typescript" },
            { name: "Checkjs", value: "checkjs" },
            { name: "null", value: null },
        ],
    });

    const choices = await checkbox({
        message: "Additional options",
        choices: [
            { name: "Prettier", value: "prettier" },
            { name: "ESLint", value: "eslint" },
            { name: "Playwright", value: "playwright" },
            { name: "Vitest", value: "vitest" },
        ]
    });

    options.prettier = choices.includes("prettier");
    options.eslint = choices.includes("eslint");
    options.playwright = choices.includes("playwright");
    options.vitest = choices.includes("vitest");

    options.svelte5 = await confirm({ message: "Use Svelte 5?" });

    return options;
};
