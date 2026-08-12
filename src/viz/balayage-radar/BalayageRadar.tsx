"use client";

import { creerCoquille } from "@/core/composants/creerCoquille.tsx";

import { monterBalayageRadar } from "./algo.ts";
import manifest from "./manifest.json";

export default creerCoquille(manifest, monterBalayageRadar);
