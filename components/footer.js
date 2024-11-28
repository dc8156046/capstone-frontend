import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-4">
        <p>&copy; 2024 BrickbyClick</p>
      </div>
    </footer>
  );
}
