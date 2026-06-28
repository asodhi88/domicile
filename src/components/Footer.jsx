// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-paper/10 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[0.65rem] uppercase tracking-wider-2 text-paper/35">
          Read this part
        </p>
        <p className="mt-2 max-w-xl text-[0.83rem] leading-relaxed text-paper/45">
          Domicile is an educational tool, not financial or tax advice. Rules
          are simplified, fund structures can change without notice, and the
          curated ticker list is hand-checked but not exhaustive. Confirm
          anything that matters with the fund provider's tax documentation
          or a qualified professional before acting on it.
        </p>
        <p className="mt-6 font-mono text-[0.65rem] text-paper/25">
          Built by Aman · domicile is not affiliated with the CRA, Vanguard,
          BlackRock, or any fund provider mentioned.
        </p>
      </div>
    </footer>
  );
}
