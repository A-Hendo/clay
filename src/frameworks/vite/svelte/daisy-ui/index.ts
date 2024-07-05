import { WriteTailwindPostcss } from "../../../../ui/tailwind/index.js";
import { Append, Write } from "../../../../utils/file.js";
import { Vite } from "../../index.js";


export class SvelteDaisyUI extends Vite {

    constructor (
        name: string,
        template: string,
        packageManager: string,
        typescript: boolean,
    ) {
        super(
            name,
            template,
            packageManager,
            typescript,
        );

        this.dependencies.push("daisyui");
        this.devDependencies = this.devDependencies.concat(["tailwindcss", "postcss", "autoprefixer"]);
    }

    async Create() {
        await super.CreateVite();
        await this.InstallDependencies();
        this.WriteTailwindConfig();
        this.AppendTailwindcss();
        WriteTailwindPostcss();
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

        Append("./src/app.css", data);
    }

};
