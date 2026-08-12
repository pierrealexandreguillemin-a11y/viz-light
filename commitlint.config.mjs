/**
 * Message de commit conventionnel — gate, pas convention molle.
 *
 * Le corps et le pied sont volontairement NON bornés en longueur : les commits
 * de ce dépôt portent les preuves (sorties de commandes, chiffres mesurés), et
 * une limite de colonne pousserait à les résumer, c'est-à-dire à les affaiblir.
 * La ligne de sujet, elle, reste courte : c'est elle qu'on lit dans un `log`.
 */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
    "subject-case": [2, "never", ["upper-case", "pascal-case", "start-case"]],
    "header-max-length": [2, "always", 100],
  },
};

export default config;
