"use client";

import { creerCoquille } from "@/core/composants/creerCoquille.tsx";

import { monterRosaceJumelle } from "./algo.ts";
import manifest from "./manifest.json";

export default creerCoquille(manifest, monterRosaceJumelle);
