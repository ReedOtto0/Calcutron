"use client";

export default function CalcButton({ label, click, grid, buttonStyle }) {
  return (
    <button
      className="active:bg-slate-400 rounded-full"
      style={{
        gridArea: grid,
        lineHeight: "0",
        fontSize: "2.75rem",
        fontWeight: "200",
        background: "hwb(160 90% 5%)",
        ...buttonStyle,
      }}
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
