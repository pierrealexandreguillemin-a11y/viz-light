/**
 * Page d'accueil — coquille provisoire de l'étape 2 (scaffold).
 *
 * Elle n'existe que pour prouver que la chaîne Next 16 / React 19 / Tailwind 4
 * construit et rend en OKLCH. La galerie réelle arrive à l'étape 5 ; le
 * catalogue qu'elle affichera est généré depuis les manifests (étape 4).
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm tracking-[0.2em] text-(--color-accent) uppercase">Viz Light</p>
      <h1 className="text-4xl font-semibold text-balance text-(--color-ink)">
        Le catalogue est en cours de montage.
      </h1>
      <p className="max-w-prose text-(--color-ink-muted)">
        Les 3 artifacts sources sont rapatriés et le socle se câble. La galerie, les fiches de viz
        et le contrat d’extraction arrivent ensuite — étape par étape, chacune vérifiée avant la
        suivante.
      </p>
      <p className="text-sm text-(--color-ink-faint)">
        Avancement détaillé : <code>docs/SPEC.md</code>, section « Fil d’Ariane ».
      </p>
    </main>
  );
}
