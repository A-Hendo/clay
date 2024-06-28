import { execa } from "execa";
import { Write } from "../../utils/file.js";

export async function GenerateTailwind(packageManager: string | undefined, typescript: boolean | undefined) {
    const packages = ["tailwindcss", "postcss", "autoprefixer"];

    if (packageManager === "npm") {
        await execa("npm", ["install", "-D"].concat(packages));
    } else if (packageManager === "yarn") {
        packages.push("-D");
        await execa("yarn", ["add"].concat(packages));
    }

    Write(`./tailwind.config.${typescript ? "ts" : "js"}`, TailwindConfig());
    Write("./src/routes/styles.css", Tailwindcss());
};

export async function InstallTailwindDeps(packageManager: string | undefined) {
    if (packageManager === "npm") {
        await execa("npm", ["install", "-D", "tailwindcss", "postcss", "autoprefixer"]);
    } else if (packageManager === "yarn") {
        await execa("yarn", ["add", "-D", "tailwindcss", "postcss", "autoprefixer"]);
    }
}


export function Tailwindcss() {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
}

function TailwindConfig() {
    return `/** @type {import('tailwindcss').Config} */
export default = {
  darkMode: ["class"],
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
};


export function WriteTailwindPostcss() {
    const data = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

    Write("./postcss.config.js", data);
};
