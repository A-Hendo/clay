import { execa } from "execa";
import { Write } from "../../utils/file.js";

const packages = ["tailwindcss", "postcss", "autoprefixer"];

export async function GenerateTailwind(packageManager: string | undefined, typescript: boolean | undefined) {

    if (packageManager === "npm") {
        await execa("npm", ["install", "-D"].concat(packages));
    } else if (packageManager === "yarn") {
        packages.push("-D");
        await execa("yarn", ["add"].concat(packages));
    }

    WriteTailwindConfig(typescript);
    WriteTailwindcss();
};

export async function InstallTailwindDependencies(packageManager: string | undefined) {
    if (packageManager === "npm") {
        await execa("npm", ["install", "-D", "tailwindcss", "postcss", "autoprefixer"]);
    } else if (packageManager === "yarn") {
        await execa("yarn", ["add", "tailwindcss", "postcss", "autoprefixer", "-D"]);
    }
}

export function WriteTailwindcss() {
    const data = `@tailwind base;
@tailwind components;
@tailwind utilities;
@tailwind variants;

`;
    Write("./src/routes/styles.css", data);
}

function WriteTailwindConfig(typescript: boolean | undefined) {
    const data = `/** @type {import('tailwindcss').Config} */
export default = {
  darkMode: ["class"],
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
    Write(`./tailwind.config.${typescript ? "ts" : "js"}`, data);
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
