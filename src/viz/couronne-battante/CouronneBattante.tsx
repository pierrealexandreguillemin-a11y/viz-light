"use client";

import { creerCoquille } from "@/core/composants/creerCoquille.tsx";

import { monterCouronneBattante } from "./algo.ts";
import manifest from "./manifest.json";

export default creerCoquille(manifest, monterCouronneBattante);
