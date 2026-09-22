// ============================================================
// Backup Service — Interface Placeholder
// ============================================================
// JSON export/import. Phase 10 implements this.
// ============================================================

import type { BackupData } from "@/types";

/**
 * Export all learning data as a JSON backup.
 *
 * Implemented in Phase 10.
 */
export async function exportData(): Promise<BackupData> {
  throw new Error("Not implemented — Phase 10");
}

/**
 * Import learning data from a JSON backup.
 *
 * Implemented in Phase 10.
 */
export async function importData(_data: BackupData): Promise<void> {
  throw new Error("Not implemented — Phase 10");
}
