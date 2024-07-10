import { WriteTailwindPostcss } from "../../../../ui/tailwind/index.js";
import { Append, Write } from "../../../../utils/file.js";
import { Vite } from "../../index.js";


export class ReactNextUI extends Vite {
    constructor (
        name: string,
        template: string,
        packageManager: string,
        typescript: boolean,
    ) {
        super(name, template, packageManager, typescript);


        this.dependencies = this.dependencies.concat(["@nextui-org/react", "framer-motion", "react-router-dom"]);
        this.devDependencies = this.devDependencies.concat(
            ["tailwindcss", "postcss", "autoprefixer", "vite-tsconfig-paths"]
        );
    }

    async Create() {
        await this.CreateVite();
        await this.InstallDependencies();

        WriteTailwindPostcss();

        this.WriteTailwindConfig();
        this.WriteViteConfig();
        this.WriteMainFile();
        this.AppendTailwindcss();
    };

    WriteViteConfig() {
        const data = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
})
`
        Write(`./vite.config.${this.typescript ? "ts" : "js"}`, data);
    };


    WriteTailwindConfig() {
        const data = `import {nextui} from '@nextui-org/theme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
}
`;
        Write(`./tailwind.config.${this.typescript ? "ts" : "js"}`, data);
    }


    WriteMainFile() {
        const data = `import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import {NextUIProvider} from "@nextui-org/react";
import './index.css'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
`
        const path: string = this.typescript ? "./src/main.tsx" : "./src/main.jsx";
        Write(path, data);
    }

    AppendTailwindcss() {
        const data = `@tailwind base;
@tailwind components;
@tailwind utilities;`

        Append("./src/index.css", data);
    }
};
