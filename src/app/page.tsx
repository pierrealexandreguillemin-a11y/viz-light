import { Planche } from "@/core/composants/Planche.tsx";
import { REGISTRE } from "@/viz/registre.genere.ts";

/**
 * L'en-tête tient sur UNE ligne. La version précédente occupait autant de
 * hauteur que la viz elle-même — sur un catalogue de visuels, c'est la place
 * prise à ce qu'on vient voir.
 */
export default function Accueil() {
  const entrees = Object.values(REGISTRE);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1500px] flex-col gap-10 px-4 py-8 sm:px-8">
      <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="text-xl tracking-tighter text-(--color-os)">
          viz<span className="text-(--color-ambre)">·</span>light
        </h1>
        <p className="voix-humaine text-sm text-(--color-os-mat)">
          Des fonds animés à régler, à regarder, et à emporter tels quels.
        </p>
      </header>

      <Planche entrees={entrees} />

      <footer className="etiquette mt-auto border-t border-(--color-filet) pt-6 normal-case">
        <code className="text-(--color-os-mat)">CATALOG.md</code> donne, pour chaque viz, la liste
        exacte des fichiers à copier.
      </footer>
    </main>
  );
}
