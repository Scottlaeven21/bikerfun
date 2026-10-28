'use client';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden bg-biker-yellow text-biker-black px-4 py-2 rounded-full text-sm font-bold uppercase"
    >
      Printen
    </button>
  );
}
