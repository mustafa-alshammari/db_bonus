'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getSafetyTeams(searchTerm = '') {
  let sql = `SELECT * FROM Safety_team`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE UPPER(Location) LIKE UPPER(:1)`;
    binds = [`%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addSafetyTeam(formData: FormData) {
  const sql = `INSERT INTO Safety_team (Location, Team_ID) VALUES (:1, :2)`;
  const binds = [formData.get('LOCATION'), formData.get('TEAM_ID')];
  await executeDML(sql, binds);
  revalidatePath('/safety-team');
}

export async function deleteSafetyTeam(teamId: string) {
  const sql = `DELETE FROM Safety_team WHERE Team_ID = :1`;
  await executeDML(sql, [teamId]);
  revalidatePath('/safety-team');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}