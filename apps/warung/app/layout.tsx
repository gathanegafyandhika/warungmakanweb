import type { Metadata } from "next"
import { ToasterProvider } from "@/components/toaster-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Warung Rasa Nusa · Masakan Rumahan Malang",
    template: "%s · Warung Rasa Nusa",
  },
  description:
    "Menu dan informasi Warung Rasa Nusa. Masakan rumahan hangat di jantung Kota Malang.",
  openGraph: {
    title: "Warung Rasa Nusa",
    description: "Masakan rumahan, rasa yang selalu dirindukan.",
    type: "website",
    locale: "id_ID",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap"
        />
      </head>
      <body>
        {children}
        <ToasterProvider />
      </body>
    </html>
  )
}
