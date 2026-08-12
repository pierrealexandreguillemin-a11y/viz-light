/**
 * LA LÉGENDE DU FILET DE COÛT.
 *
 * Elle est ici, contre la planche, et non dans l'en-tête : une légende sert au
 * moment où l'on regarde l'objet qu'elle explique. Elle montre la barre plutôt
 * que de la décrire — c'est plus court et ça se vérifie d'un coup d'œil.
 */
export function Legende() {
  return (
    <div className="etiquette flex flex-wrap items-center gap-x-6 gap-y-2 normal-case">
      <span className="flex items-center gap-2">
        <span className="cout w-12 shrink-0">
          <span className="cout__js" style={{ width: "22%" }} />
        </span>
        part du budget d’une image consommée par le JavaScript
      </span>
      <span className="flex items-center gap-2">
        <span className="cout cout--gpu w-12 shrink-0">
          <span className="cout__js" style={{ width: "8%" }} />
        </span>
        barre presque vide mais viz lente : le goulot est le GPU
      </span>
      <span className="flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 shrink-0 border border-(--color-filet-mesure)"
          aria-hidden
        />
        filet ambre : performance relevée
      </span>
    </div>
  );
}
