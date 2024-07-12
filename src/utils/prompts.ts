import { checkbox, confirm, input, select } from "@inquirer/prompts";
import chalk from "chalk";
import stripAnsi from "strip-ansi";


export interface Choice {
    value: string,
    name: string,
};

export async function Confirm(message: string, defaultValue = true) {
    return await confirm({ message, default: defaultValue, transformer: (value) => chalk.blue(value) });
};

export async function Input(message: string) {
    return await input({ message, transformer: (value) => chalk.blue(value) });
}

export async function Select(message: string, choices: Choice[]) {
    choices = choices.map((choice) => ({ value: choice.value, name: chalk.gray(choice.name) }));

    return await select<string>({
        message,
        loop: false,
        choices,
        theme: {
            style: {
                highlight: (name: string) => chalk.blue(stripAnsi(name)),
                answer: (value: string) => chalk.blue(stripAnsi(value)),
            }
        }
    });
}

export async function Checkbox(message: string, choices: Choice[]) {
    return await checkbox<string>({
        message,
        choices,
        theme: {
            style: {
                highlight: (name: string) => chalk.blue(stripAnsi(name)),
                answer: (value: string) => chalk.blue(stripAnsi(value)),
            }
        }
    });
};
