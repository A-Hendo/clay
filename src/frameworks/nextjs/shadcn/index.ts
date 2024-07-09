import { execa } from "execa";
import * as fs from "fs";
import { Write } from "../../../utils/file.js";
import { Nextjs } from "../index.js";

export class Shadcn extends Nextjs {
    style: string;
    baseColor: string;
    components: boolean;


    constructor (
        name: string,
        template: string,
        packageManager: string,
        typescript: boolean,
        router: boolean,
        alias: string,
        eslint: boolean,
        srcDir: boolean,
        style: string,
        baseColor: string,
        components: boolean,
    ) {
        super(
            name,
            template,
            packageManager,
            typescript,
            router,
            alias,
            eslint,
            srcDir,
        );

        this.style = style;
        this.baseColor = baseColor;
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
        await this.CreateNextjs();
        await this.InstallDependencies();

        if (this.components)
            await execa("npx", ["shadcn-ui@latest", "add", "-a", "-y"]);


        this.WriteComponentConfig();
        this.WriteTailwindConfig();
        this.GlobalStyles();
        this.UtilsCNHelper();

        if (this.typescript)
            this.WriteJsonConfig();
    }

    WriteComponentConfig() {
        const data = JSON.stringify({
            "$schema": "https://shadcn-svelte.com/schema.json",
            "style": `${this.style}`,
            "rsc": true, // Server components
            "tsx": this.typescript,
            "tailwind": {
                "config": `tailwind.config.${this.typescript ? "ts" : "js"}`,
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

    WriteTailwindConfig() {
        const data = `import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx,jsx,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
	],
  prefix: "",
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
} satisfies Config

export default config;
`

        Write(`./tailwind.config.${this.typescript ? "ts" : "js"}`, data);
    }

    WriteJsonConfig() {
        const data = `{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "${this.alias}": [${this.srcDir ? `"./src/*"` : "./*"}]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "**/*.js", "**/*.jsx"],
  "exclude": ["node_modules"]
}
`

        Write("./tsconfig.json", data)
    }

    UtilsCNHelper() {
        if (!fs.existsSync("./src/lib"))
            fs.mkdirSync("./src/lib");

        const data = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
`
        Write(`./src/lib/utils.${this.typescript ? "ts" : "js"}`, data);
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
        Write("./src/app/globals.css", data);
    };
};
