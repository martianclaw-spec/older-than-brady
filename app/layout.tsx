import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Older Than Brady?",
  description: "Is the player older or younger than Tom Brady? A quick, addictive NFL trivia game.",
  openGraph: {
    title: "Older Than Brady?",
    description: "Is the player older or younger than Tom Brady?",
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#013369"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen flex flex-col">{children}</main>
      </body>
    </html>
  );
}
