export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 relative">
        {/* <div className="absolute inset-0 bg-primary rounded-tl-lg rounded-br-lg transform rotate-45"></div>
        <div className="absolute inset-0 bg-primary/50 rounded-tr-lg rounded-bl-lg transform -rotate-45"></div> */}
        <img src="/myLogo.png" alt="My Logo" />
      </div>
      <span className="font-bold text-xl">BrickByClick</span>
    </div>
  );
}
