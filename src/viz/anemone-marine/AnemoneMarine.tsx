"use client";

import { creerCoquille } from "@/core/composants/creerCoquille.tsx";

import { monterAnemoneMarine } from "./algo.ts";
import manifest from "./manifest.json";

export default creerCoquille(manifest, monterAnemoneMarine);
