import "./globals.css";

export const metadata = {
  title: "Capstone Project - BrickbyClick",
  description: "BricksbyClick Capstone Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
