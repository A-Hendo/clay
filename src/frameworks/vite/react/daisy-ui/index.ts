import { WriteTailwindPostcss } from "../../../../ui/tailwind/index.js";
import { Append, Write } from "../../../../utils/file.js";
import { Vite } from "../../index.js";

export class ReactDaisyUI extends Vite {
    constructor (
        name: string,
        template: string,
        packageManager: string,
        typescript: boolean,
    ) {
        super(name, template, packageManager, typescript);


        this.dependencies = this.dependencies.concat(["daisyui", "react-daisyui"]);
        this.devDependencies = this.devDependencies.concat(["tailwindcss", "postcss", "autoprefixer"]);
    }

    async Create() {
        await this.CreateVite();
        await this.InstallDependencies();

        this.AppendTailwindcss();
        WriteTailwindPostcss();
        this.WriteTailwindConfig();
    }

    WriteTailwindConfig() {
        const data = `/** @type {import('tailwindcss').Config} */
export default {
    content: [
    './src/**/*.{html,svelte,js,ts}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
    ],
    theme: {
    extend: {},
    },
    plugins: [require('daisyui')],
}`
        Write(`./tailwind.config.${this.typescript ? "ts" : "js"}`, data);
    }

    AppendTailwindcss() {
        const data = `@tailwind base;
@tailwind components;
@tailwind utilities;`

        Append("./src/index.css", data);
    }
};
