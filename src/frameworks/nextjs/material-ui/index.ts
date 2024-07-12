import chalk from "chalk";
import { Write } from "../../../utils/file.js";
import { Nextjs } from "../index.js";

export class MUI extends Nextjs {
    constructor (
        name: string,
        template: string,
        packageManager: string,
        typescript: boolean,
        router: boolean,
        alias: string,
        eslint: boolean,
        srcDir: boolean,
    ) {
        if (!router) {
            console.warn(
                chalk.cyan("⚠️ Page router for Material UI NextJS is not supported, using App Router instead")
            );
            router = true;
        }

        super(name, template, packageManager, typescript, router, alias, eslint, srcDir);

        this.dependencies = this.dependencies.concat(
            ["@mui/material", "@mui/material-nextjs", "@emotion/cache", "@emotion/react", "@emotion/styled"]
        );
    }

    async Create() {
        await this.CreateNextjs();
        await this.InstallDependencies();

        this.WriteLayout();
        this.WriteTheme();
    };


    WriteLayout() {
        const data = `import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
        import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
`
        const path = this.srcDir ?
            `./src/app/layout.${this.typescript ? "tsx" : "jsx"}` : `./app/layout.${this.typescript ? "tsx" : "jsx"}`;
        Write(path, data);
    }

    WriteTheme() {
        const data = `'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
`
        const path = this.srcDir ?
            `./src/app/theme.${this.typescript ? "ts" : "js"}` : `./app/theme.${this.typescript ? "ts" : "js"}`;
        Write(path, data);
    }
};