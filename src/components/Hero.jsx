// src/components/Hero.jsx
export default function Hero() {
  return (
    <section className="relative z-10 px-6 pb-2 pt-10 sm:pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-wider-2 text-brass-light">
          FHSA · TFSA · RRSP
        </p>
        <h1 className="mt-4 font-display text-[2.5rem] italic leading-[1.08] text-paper sm:text-[3.4rem]">
          Find the right account
          <br />
          for every dollar.
        </h1>
      </div>
    </section>
  );
}
