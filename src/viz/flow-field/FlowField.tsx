"use client";

import { creerCoquille } from "@/core/composants/creerCoquille.tsx";

import { monterFlowField } from "./algo.ts";
import manifest from "./manifest.json";

export default creerCoquille(manifest, monterFlowField);
