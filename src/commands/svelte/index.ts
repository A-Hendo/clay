import { checkbox, confirm, input, select } from "@inquirer/prompts";
import { Command } from "commander";
import { type Options } from "create-svelte/types/internal.js";
import * as fs from "fs";
import * as path from "path";
import { CreateSvelte } from "../../frameworks/svelte/index.js";
import { UIPrompts } from "../../ui/index.js";

import { GenerateDaisyUI } from "../../ui/daisy-ui/index.js";
import { GenerateShadcn, PromptBaseColour, PromptComponents, PromptStyle } from "../../ui/shadcn/index.js";

type svelteOptions = Options & { interactive?: boolean, css?: string | null, manager?: string, ui?: string, lang?: string };
interface shadcnOptions { style: string, baseColour: string, components: boolean }

export function SvelteCommands(program: Command) {
    program
        .command("svelte")
        .description("Create a new project")
        // .option("-n, --name", "Project name", "my-app")
        // .addOption(
        //     new Option("-t, --template", "Select a Project template")
        //         .choices(["default", "skeleton", "skeletonlib"])
        //         .default("default"))
        // .addOption(
        //     new Option("-y, --types", "Which typechecking to use?")
        //         .choices(["typescript", "checkjs", "null"])
        //         .default("checkjs"))
        // .option("-p, --prettier", "Use Prettier", false)
        // .option("-e, --eslint", "Use ESLint", false)
        // .option("-w, --playwright", "Use Playwright", false)
        // .option("-v, --vitest", "Use Vitest", false)
        // .option("-s, --svelte", "Use Svelte", false)
        .option("-i, --interactive", "Enable interactive mode", false)
        // .addOption(
        //     new Option("-l, --lang <lang>", "Typescript or Javascript?")
        //         .choices(["Typescript", "Javascript"])
        //         .default("Typescript"))
        // .addOption(
        //     new Option("-c, --css <css>", "Choose a css framework")
        //         .choices(["tailwind", "bootstrap", "null"])
        //         .default("null"))
        // .addOption(
        //     new Option("-m, --manager <manager>", "Choose a package manager")
        //         .choices(["yarn", "npm", "bun"])
        //         .default("npm"))
        // .addOption(
        //     new Option("-u, --ui <manager>", "Choose a UI framework")
        //         .choices(["Shadcn", "Skeleton UI", "Daisy UI", "none"])
        //         .default("none"))
        .action(async (options: svelteOptions) => {

            const shadcn: shadcnOptions = {
                style: "default",
                baseColour: "gray",
                components: false
            };

            if (options.interactive) {
                options = await SveltePrompts();
                options.lang = await LanguagePrompt();
                options.ui = await UIPrompts();
                options.manager = await ManagerPrompts();

                if (options.ui === "shadcn") {
                    shadcn.style = await PromptStyle();
                    shadcn.baseColour = await PromptBaseColour();
                    shadcn.components = await PromptComponents();
                }
            }

            const projectPath = path.join(process.cwd(), options.name);

            if (fs.existsSync(projectPath)) {
                console.error(`Project folder ${options.name} already exists!`);
                process.exit(1);
            }

            await CreateSvelte(options);

            if (process.cwd() === projectPath)
                process.chdir(projectPath);

            if (options.ui === "shadcn") {
                await GenerateShadcn(shadcn.style, shadcn.baseColour, options.lang === "ts" ? true : false, options.manager, shadcn.components);
            }
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
            { name: "Skeleton", value: "skeleton" },
            // { name: "Skeletonlib", value: "skeletonlib" },
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

export async function ManagerPrompts() {
    const manager = await select({
        message: "Choose a package manager",
        choices: [
            { name: "Yarn", value: "yarn" },
            { name: "NPM", value: "npm" },
            { name: "Bun", value: "bun" },
        ]
    });
    return manager;
};

export async function LanguagePrompt() {
    return await select({
        message: "Select language",
        choices: [
            { name: "Typescript", value: "ts" },
            { name: "Javascript", value: "js" },
        ],
    });
}
