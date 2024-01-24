"use client";

export default function CalcButton({ label, click, grid }) {
  return (
    <button
      className="font-bold bg-slate-200 active:bg-slate-400 rounded-full"
      style={{ gridArea: grid, lineHeight: "0", fontSize: "1.75rem" }}
      onClick={(e) => {
        e.preventDefault();
        click(e);
      }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
