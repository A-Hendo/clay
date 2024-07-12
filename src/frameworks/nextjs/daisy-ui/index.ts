import { Write } from "../../../utils/file.js";
import { Nextjs } from "../index.js";


export class DaisyUI extends Nextjs {
    constructor (
        name: string,
        packageManager: string,
        typescript: boolean,
        router: boolean,
        alias: string,
        eslint: boolean,
        srcDir: boolean,
    ) {
        super(name, packageManager, typescript, router, alias, eslint, srcDir);
        this.dependencies.push("daisyui");
        this.devDependencies = this.devDependencies.concat(["tailwindcss", "postcss", "autoprefixer"]);
    }

    async Create() {
        await this.CreateNextjs();
        await this.InstallDependencies();

        this.WriteTailwindConfig();
        this.WriteTailwindPostcss();
    }

    WriteTailwindConfig() {
        const data = `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require('daisyui')],
};
export default config;
`
        Write(`./tailwind.config.${this.typescript ? "ts" : "js"}`, data);
    };

    WriteTailwindPostcss() {
        const data = `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
`;
        Write("./postcss.config.mjs", data);
    };

};
