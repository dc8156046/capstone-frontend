export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 relative">
        <img src="/myLogo.png" alt="My Logo" />
      </div>
      <span className="font-bold text-xl">BrickByClick</span>
    </div>
  );
}
