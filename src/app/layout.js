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
      </head>
      <body className="bg-background text-on-surface antialiased overflow-hidden h-[100dvh] flex justify-center w-full">
        <div className="w-full max-w-[393px] relative shadow-2xl h-full bg-surface flex flex-col overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
