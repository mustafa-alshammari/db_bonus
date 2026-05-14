'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getAnalyses(searchTerm = '') {
  let sql = `SELECT * FROM Analysis`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE Team_ID = :1`;
    binds = [searchTerm]; // Assuming search by ID
  }
  return await executeDML(sql, binds);
}

export async function addAnalysis(formData: FormData) {
  const sql = `INSERT INTO Analysis (Team_ID) VALUES (:1)`;
  const binds = [formData.get('TEAM_ID')];
  await executeDML(sql, binds);
  revalidatePath('/analysis');
}

export async function deleteAnalysis(teamId: string) {
  const sql = `DELETE FROM Analysis WHERE Team_ID = :1`;
  await executeDML(sql, [teamId]);
  revalidatePath('/analysis');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}