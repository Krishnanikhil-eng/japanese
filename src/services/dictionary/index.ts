// ============================================================
// Dictionary Service — Interface Placeholder
// ============================================================
// Local JMdict search. Phase 8D implements this.
// ============================================================

import type { DictionaryEntry } from "@/types";

/**
 * Search the local JMdict dictionary.
 *
 * Implemented in Phase 8D.
 */
export async function searchDictionary(_query: string): Promise<DictionaryEntry[]> {
  throw new Error("Not implemented — Phase 8D");
}
