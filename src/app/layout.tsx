import type { Metadata } from "next";
import { Sidebar } from '@/components/layout/sidebar';
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Inter, Roboto } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700']
})

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: "Task tracker",
  description: "Task tracker",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body
        className={`${inter.className} antialiased m-auto`}
      >
      <QueryProvider>
	      <Sidebar/>
	      {children}
      </QueryProvider>
      </body>
    </html>
  );
}
