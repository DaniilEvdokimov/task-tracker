import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Inter, Roboto } from "next/font/google";
import { LayoutContent } from "./client-layout-content";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto", weight: ["400", "700"] });

export const metadata: Metadata = {
    title: "Task tracker",
    description: "Task tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={roboto.variable}>
        <body className={`${inter.className} antialiased m-auto`}>
        <QueryProvider>
            <LayoutContent>{children}</LayoutContent>
        </QueryProvider>
        </body>
        </html>
    );
}
