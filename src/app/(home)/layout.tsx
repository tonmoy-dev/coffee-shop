import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/providers/theme-providers";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/Layouts/DashboardLayout";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

// metadata for SEO
export const metadata: Metadata = {
  title: "Coffee Shop",
  description: "This is a Coffee Shop POS Software.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }


  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <DashboardLayout>{children}</DashboardLayout>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
