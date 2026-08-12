import type { EntreeViz } from "@/viz/registre.genere.ts";

import { Cellule } from "./Cellule.tsx";

/**
 * LA PLANCHE CONTACT (ADR 0009).
 *
 * Les cellules partagent leurs filets — le trait est continu, comme sur une
 * planche, au lieu de doubler entre des cartes détachées. Le filet passe à
 * l'ambre autour des viz dont la perf est mesurée : la grille elle-même dit ce
 * qui est prouvé et ce qui ne l'est pas encore.
 */
export function Planche({ entrees }: { readonly entrees: readonly EntreeViz[] }) {
  if (entrees.length === 0) return <PlancheVide />;

  return (
    <div className="planche flex-1">
      {entrees.map((entree) => (
        <Cellule key={entree.manifest.slug} entree={entree} />
      ))}
    </div>
  );
}

/**
 * L'ÉTAT VIDE — une invitation, pas une excuse. Il annonce ce qui va arriver
 * et où le suivre, sans s'excuser ni meubler.
 */
function PlancheVide() {
  return (
    <div className="planche flex-1">
      <div className="planche__cellule col-span-full justify-center p-8 sm:p-14">
        <div className="flex max-w-prose flex-col gap-4">
          <p className="etiquette">Planche vierge</p>
          <p className="text-2xl leading-tight tracking-tight text-balance text-(--color-os)">
            Le socle est monté. La migration n’a pas commencé.
          </p>
          <p className="voix-humaine text-base text-(--color-os-mat)">
            31 viz attendent dans <code className="not-italic">sources/</code> : 19 sketches p5, 10
            effets réglables, 5 algorithmes paramétrables. Chacune arrivera avec son coût mesuré —
            le catalogue refuse de publier une viz dont la performance n’a pas été relevée.
          </p>
        </div>
      </div>
    </div>
  );
}
