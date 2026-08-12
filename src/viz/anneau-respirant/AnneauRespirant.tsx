"use client";

import { creerCoquille } from "@/core/composants/creerCoquille.tsx";

import { monterAnneauRespirant } from "./algo.ts";
import manifest from "./manifest.json";

export default creerCoquille(manifest, monterAnneauRespirant);
