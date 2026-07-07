import "./globals.css";
import React from "react";

export const metadata = {
  title: "Ray的家事簿",
  description: "A gamified chore tracker.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@100..800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0D1117" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ray的家事簿" />
        <link rel="apple-touch-icon" href="/icon-512.jpg" />
      </head>
      <body className="bg-background text-on-surface antialiased overflow-hidden h-[100dvh] flex justify-center w-full">
        <div className="w-full max-w-[393px] relative shadow-2xl h-full bg-surface flex flex-col overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
