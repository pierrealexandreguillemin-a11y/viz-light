import { Legende } from "@/core/composants/Legende.tsx";
import { Planche } from "@/core/composants/Planche.tsx";
import { REGISTRE } from "@/viz/registre.genere.ts";

/**
 * LA PLANCHE — page d'accueil du catalogue (ADR 0009).
 *
 * L'en-tête est court et ne porte QUE l'identité : dans un catalogue de
 * visuels, l'espace appartient aux visuels. Ce qui explique la planche descend
 * contre la planche (`Legende`), là où on en a besoin.
 */
export default function Accueil() {
  const entrees = Object.values(REGISTRE);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1400px] flex-col gap-10 px-4 py-10 sm:px-8">
      <header className="flex flex-col gap-4">
        <p className="etiquette">
          Planche contact · {entrees.length} spécimen{entrees.length > 1 ? "s" : ""}
        </p>
        <h1 className="text-5xl leading-[0.85] tracking-tighter text-(--color-os) sm:text-7xl">
          viz<span className="text-(--color-ambre)">·</span>light
        </h1>
        <p className="voix-humaine max-w-prose text-base text-(--color-os-mat)">
          Des fonds animés à regarder, et à emporter tels quels.
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-3">
        <Legende />
        <Planche entrees={entrees} />
      </div>

      <footer className="etiquette border-t border-(--color-filet) pt-6 normal-case">
        Extraction : <code className="text-(--color-os-mat)">CATALOG.md</code> donne, pour chaque
        viz, la liste exacte des fichiers à copier.
      </footer>
    </main>
  );
}
