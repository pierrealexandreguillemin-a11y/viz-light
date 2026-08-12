import type { NextConfig } from "next";

/**
 * Sortie statique (SPEC.md §2 : « Sortie statique, pas de backend »).
 *
 * `output: "export"` n'est pas un détail de déploiement, c'est un GARDE-FOU :
 * il fait échouer le build si une viz introduit par accident une dépendance
 * serveur (route API, `cookies()`, ISR…). Le catalogue n'a rien à servir —
 * il rend des canvas dans le navigateur. Vercel sert l'export tel quel
 * (ADR 0006).
 */
const nextConfig: NextConfig = {
  output: "export",
  // Corollaire de l'export statique : pas d'optimiseur d'images à l'exécution.
  images: { unoptimized: true },
};

export default nextConfig;
