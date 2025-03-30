import type { Metadata } from "next";
import { Providers } from "./provider";
import { ReactNode } from "react";
import { NavBar } from "@/components/Navbar";
import Page from "@/components/Page";

export const metadata: Metadata = {
  title: "Echo",
  description: "Echo Knowledge Avatars",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavBar />
          <div style={{ marginLeft: "250px", padding: "16px" }}>
            <Page>{children}</Page>
          </div>
        </Providers>
      </body>
    </html>
  );
}
