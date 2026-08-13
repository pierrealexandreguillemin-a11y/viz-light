import { CATEGORIES, type Categorie } from "../manifest/types.ts";
import type { EntreeViz } from "@/viz/registre.genere.ts";

import { Specimen } from "./Specimen.tsx";

/**
 * LES CATÉGORIES SONT SÉPARÉES, parce qu'on ne les choisit pas de la même
 * façon : un fond se juge discret derrière du texte ; une animation se regarde
 * pour elle-même ; un interactif se manipule ; un composant se pose dans une
 * page. Les mélanger dans une liste unique force à comparer des choses
 * incomparables.
 *
 * `Record<Categorie, …>` ET NON UN TABLEAU : une catégorie ajoutée à
 * `CATEGORIES` sans titre ici devient une **erreur de compilation**. Avec un
 * tableau, elle aurait produit une viz valide, mesurée, cataloguée… et
 * INVISIBLE dans la vitrine — le pire mode de panne, celui qui ne dit rien.
 */
const TITRES: Record<Categorie, string> = {
  fond: "Fonds",
  animation: "Animations",
  interactif: "Interactifs",
  composant: "Composants",
};

const SECTIONS = CATEGORIES.map((categorie) => ({ categorie, titre: TITRES[categorie] }));

export function Planche({ entrees }: { readonly entrees: readonly EntreeViz[] }) {
  if (entrees.length === 0) return <PlancheVide />;

  return (
    <div className="flex flex-col gap-16">
      {SECTIONS.map(({ categorie, titre }) => {
        const lot = entrees.filter((e) => e.manifest.categorie === categorie);
        if (lot.length === 0) return null;
        return (
          <section key={categorie} className="flex flex-col gap-6">
            <h2 className="etiquette">
              {titre} · {lot.length}
            </h2>
            {lot.map((entree) => (
              <Specimen key={entree.manifest.slug} entree={entree} />
            ))}
          </section>
        );
      })}
    </div>
  );
}

/** Une invitation, pas une excuse : ce qui arrive, et à quelle condition. */
function PlancheVide() {
  return (
    <div className="flex max-w-prose flex-col gap-4 border-t border-(--color-filet) pt-8">
      <p className="text-2xl leading-tight tracking-tight text-balance text-(--color-os)">
        Le socle est monté. La migration n’a pas commencé.
      </p>
      <p className="voix-humaine text-base text-(--color-os-mat)">
        31 viz attendent dans <code className="not-italic">sources/</code>. Chacune arrivera avec
        son coût mesuré — le catalogue refuse de publier une viz dont la performance n’a pas été
        relevée.
      </p>
    </div>
  );
}
