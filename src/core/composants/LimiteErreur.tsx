"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Proprietes {
  readonly nom: string;
  readonly children: ReactNode;
}

interface Etat {
  readonly message: string | null;
}

/**
 * UNE VIZ QUI CRASHE NE FAIT PAS TOMBER LA GALERIE (SPEC.md §6).
 *
 * Ce catalogue affiche du code venu de trente sources différentes, dont des
 * shaders et des sketches golfés : l'un d'eux plantera. Sans cette barrière, une
 * exception dans une viz démonte tout l'arbre React et laisse une page blanche —
 * l'utilisateur perdrait les vingt-neuf autres à cause d'une seule.
 *
 * Classe et non fonction : React n'expose `componentDidCatch` d'aucune autre
 * manière, en 19 comme avant.
 */
export class LimiteErreur extends Component<Proprietes, Etat> {
  override state: Etat = { message: null };

  static getDerivedStateFromError(erreur: unknown): Etat {
    return { message: erreur instanceof Error ? erreur.message : String(erreur) };
  }

  override componentDidCatch(erreur: Error, infos: ErrorInfo): void {
    // Laissé visible en console : une viz qui tombe silencieusement est une viz
    // qu'on ne répare jamais.
    console.error(`[viz-light] « ${this.props.nom} » a échoué :`, erreur, infos.componentStack);
  }

  override render(): ReactNode {
    if (this.state.message === null) return this.props.children;
    return (
      <div className="flex h-full w-full flex-col justify-center gap-2 bg-(--color-encre-levee) p-5 text-xs">
        <p className="text-(--color-ambre)">« {this.props.nom} » n’a pas pu s’afficher.</p>
        <p className="text-(--color-os-mat)">{this.state.message}</p>
        <p className="text-(--color-os-pale)">Le reste de la planche continue de tourner.</p>
      </div>
    );
  }
}
