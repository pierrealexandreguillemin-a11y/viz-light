"use client";

import { creerCoquille } from "@/core/composants/creerCoquille.tsx";

import { monterCoquilleJumelle } from "./algo.ts";
import manifest from "./manifest.json";

export default creerCoquille(manifest, monterCoquilleJumelle);
