import { execa } from "execa";
import * as fs from "fs";
import { WriteTailwindPostcss } from "../../../../ui/tailwind/index.js";
import { Append, Write } from "../../../../utils/file.js";
import { Vite } from "../../index.js";


export class SvelteShadcn extends Vite {
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
            "tailwind-variants",
            "clsx",
            "tailwind-merge",
            `${this.style === "default" ? "lucide-svelte" : "svelte-radix"}`
        ]);
        this.devDependencies = this.devDependencies.concat(["tailwindcss", "postcss", "autoprefixer"]);
    }

    async Create() {
        await this.CreateVite();
        await this.InstallDependencies();

        await this.InstallShadcnDependencies();

        this.WriteViteConfig();

        if (this.typescript)
            this.AppendTSPathAliases();
        else
            this.AppendJSPathAliases();

        this.WriteComponentConfig();
        this.WriteShadcnTailwindConfig();
        this.WriteShadcnUtils();
        this.WriteShadcnTheming();

        WriteTailwindPostcss();
    }

    WriteViteConfig() {
        const data = `import path from "path";
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
})`
        Write(`./vite.config.${this.typescript ? "ts" : "js"}`, data);
    }

    AppendTSPathAliases() {
        const data = `{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "paths": {
      "$lib": ["./src/lib"],
      "$lib/*": ["./src/lib/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.js", "src/**/*.svelte"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
        Write("./tsconfig.json", data);
    }


    AppendJSPathAliases() {
        const data = `{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "target": "ESNext",
    "module": "ESNext",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "checkJs": true,
    "paths": {
      "$lib": ["./src/lib"],
      "$lib/*": ["./src/lib/*"]
    }
  },
  "include": ["src/**/*.d.ts", "src/**/*.js", "src/**/*.svelte"]
}`
        Write("./jsconfig.json", data);
    }

    WriteComponentConfig() {
        const data = JSON.stringify({
            "$schema": "https://shadcn-svelte.com/schema.json",
            "style": `${this.style}`,
            "tailwind": {
                "config": this.typescript ? "tailwind.config.ts" : "tailwind.config.js",
                "css": `src/app.{p,post}css`,
                "baseColor": `${this.baseColor}`
            },
            "aliases": {
                "components": "$lib/components",
                "utils": "$lib/utils"
            },
            "typescript": this.typescript
        }, null, 4);
        Write("./components.json", data);
    }

    async InstallShadcnDependencies() {
        if (this.components)
            await execa("npx", ["shadcn-svelte", "add", "-a", "-y"]);
    }

    WriteShadcnTailwindConfig() {
        const data = `import { fontFamily } from "tailwindcss/defaultTheme";

    /** @type {import('tailwindcss').Config} */
    const config = {
      darkMode: ["class"],
      content: ["./src/**/*.{html,js,svelte,ts}"],
      safelist: ["dark"],
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
            border: "hsl(var(--border) / <alpha-value>)",
            input: "hsl(var(--input) / <alpha-value>)",
            ring: "hsl(var(--ring) / <alpha-value>)",
            background: "hsl(var(--background) / <alpha-value>)",
            foreground: "hsl(var(--foreground) / <alpha-value>)",
            primary: {
              DEFAULT: "hsl(var(--primary) / <alpha-value>)",
              foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
            },
            secondary: {
              DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
              foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
            },
            destructive: {
              DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
              foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
            },
            muted: {
              DEFAULT: "hsl(var(--muted) / <alpha-value>)",
              foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
            },
            accent: {
              DEFAULT: "hsl(var(--accent) / <alpha-value>)",
              foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
            },
            popover: {
              DEFAULT: "hsl(var(--popover) / <alpha-value>)",
              foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
            },
            card: {
              DEFAULT: "hsl(var(--card) / <alpha-value>)",
              foreground: "hsl(var(--card-foreground) / <alpha-value>)",
            },
          },
          borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
          },
          fontFamily: {
            sans: ["Inter", ...fontFamily.sans],
          },
        },
      },
    };

    export default config;`
        Write(`./tailwind.config.${this.typescript ? "ts" : "js"}`, data);
    };

    WriteShadcnUtils() {
        const data = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
    y?: number;
    x?: number;
    start?: number;
    duration?: number;
};

export const flyAndScale = (
    node: Element,
    params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;

    const scaleConversion = (
        valueA: number,
        scaleA: [number, number],
        scaleB: [number, number]
    ) => {
        const [minA, maxA] = scaleA;
        const [minB, maxB] = scaleB;

        const percentage = (valueA - minA) / (maxA - minA);
        const valueB = percentage * (maxB - minB) + minB;

        return valueB;
    };

    const styleToString = (
        style: Record<string, number | string | undefined>
    ): string => {
        return Object.keys(style).reduce((str, key) => {
            if (style[key] === undefined) return str;
            return str + key + ":" + style[key] + ";";
        }, "");
    };

    return {
        duration: params.duration ?? 200,
        delay: 0,
        css: (t) => {
            const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
            const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
            const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

            return styleToString({
                transform:
                    transform +
                    "translate3d(" +
                    x +
                    "px, " +
                    y +
                    "px, 0) scale(" +
                    scale +
                    ")",
                opacity: t,
            });
        },
        easing: cubicOut,
    };
};`
        Write("./src/lib/utils.ts", data);
    };

    WriteShadcnTheming() {
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

    --destructive: 0 92% 38%;
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

    --destructive: 359 51% 48%;
    --destructive-foreground: 210 40% 98%;

    --ring: 216 34% 17%;

    --radius: 0.5rem;
    }
}

@layer base {
    * {
    @apply border-border;
    }
    body {
    @apply bg-background text-foreground;
    font-feature-settings:
        "rlig" 1,
        "calt" 1;
    }
}`
        Append("./src/app.css", data);
    };
}