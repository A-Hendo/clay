import { execa } from "execa";
import * as fs from "fs";
import { WriteTailwindPostcss } from "../../../../ui/tailwind/index.js";
import { Append, Write } from "../../../../utils/file.js";
import { Vite } from "../../index.js";



export class ReactShadcn extends Vite {
    style: string;
    baseColor: string;
    components: boolean;

    constructor (
        name: string,
        template: string,
        packageManager: string,
        typescript: boolean,
        style: string,
        colour: string,
        components: boolean
    ) {
        super(name, template, packageManager, typescript);

        this.style = style;
        this.baseColor = colour;
        this.components = components;

        this.dependencies = this.dependencies.concat([
            "tailwindcss-animate",
            "class-variance-authority",
            "clsx", "tailwind-merge",
            `${this.style === "default" ? "lucide-react" : "@radix-ui/react-icons"}`
        ]);
        this.devDependencies = this.devDependencies.concat(["tailwindcss", "postcss", "autoprefixer"]);
    }


    async Create() {
        await this.CreateVite();
        await this.InstallDependencies();

        if (this.components)
            await execa("npx", ["shadcn-ui@latest", "add", "-a", "-y"]);

        this.WriteViteConfig();
        this.WriteTailwindConfig();
        this.GlobalStyles();
        this.WriteComponentConfig();
        this.WriteTailwindJson();
        WriteTailwindPostcss();
        this.UtilsCNHelper();
    }

    WriteComponentConfig() {
        const data = JSON.stringify({
            "$schema": "https://shadcn-svelte.com/schema.json",
            "style": `${this.style}`,
            "rsc": false, // Server components
            "tsx": this.typescript,
            "tailwind": {
                "config": "tailwind.config.js",
                "css": `src/index.css`,
                "baseColor": `${this.baseColor}`,
                "cssVariables": true,
                "prefix": ""
            },
            "aliases": {
                "components": "@/lib/components",
                "utils": "@/lib/utils"
            },
        }, null, 4);
        Write("./components.json", data)
    }


    WriteViteConfig() {
        const data = `import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
plugins: [react()],
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},
})`
        Write(`./vite.config.${this.typescript ? "ts" : "js"}`, data);
    }

    WriteTailwindJson() {
        const data = JSON.stringify({
            "compilerOptions": {
                "baseUrl": ".",
                "paths": {
                    "@/*": [
                        "./src/*"
                    ]
                }
            },
            "files": [],
            "references": [
                {
                    "path": "./tsconfig.app.json"
                },
                {
                    "path": "./tsconfig.node.json"
                }
            ]
        }, null, 4);

        Write("./tsconfig.json", data);
    }


    WriteTailwindConfig() {
        const data = `const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
darkMode: ["class"],
content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
theme: {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    fontFamily: {
      sans: ["var(--font-sans)", ...fontFamily.sans],
    },
    keyframes: {
      "accordion-down": {
        from: { height: "0" },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: "0" },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
    },
  },
},
plugins: [require("tailwindcss-animate")],
}`;
        Write(`./tailwind.config.js`, data);
    };

    UtilsCNHelper() {
        if (!fs.existsSync("./src/lib"))
            fs.mkdirSync("./src/lib");

        const data = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
return twMerge(clsx(inputs))
}`
        Write("./src/lib/utils.ts", data);
    }

    GlobalStyles() {
        const data = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;

  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  --popover: 0 0% 100%;
  --popover-foreground: 222.2 47.4% 11.2%;

  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;

  --card: 0 0% 100%;
  --card-foreground: 222.2 47.4% 11.2%;

  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;

  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  --destructive: 0 100% 50%;
  --destructive-foreground: 210 40% 98%;

  --ring: 215 20.2% 65.1%;

  --radius: 0.5rem;
}

.dark {
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;

  --muted: 223 47% 11%;
  --muted-foreground: 215.4 16.3% 56.9%;

  --accent: 216 34% 17%;
  --accent-foreground: 210 40% 98%;

  --popover: 224 71% 4%;
  --popover-foreground: 215 20.2% 65.1%;

  --border: 216 34% 17%;
  --input: 216 34% 17%;

  --card: 224 71% 4%;
  --card-foreground: 213 31% 91%;

  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 1.2%;

  --secondary: 222.2 47.4% 11.2%;
  --secondary-foreground: 210 40% 98%;

  --destructive: 0 63% 31%;
  --destructive-foreground: 210 40% 98%;

  --ring: 216 34% 17%;

  --radius: 0.5rem;
}

@layer base {
* {
  @apply border-border;
}
body {
  @apply bg-background text-foreground;
  font-feature-settings: "rlig" 1, "calt" 1;
}
}`
        Append("./src/index.css", data);
    };

};
