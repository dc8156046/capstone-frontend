import "./globals.css";

export const metadata = {
  title: "BrickbyClick",
  description: "BrickbyClick Capstone Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
