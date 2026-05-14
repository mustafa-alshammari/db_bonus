'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getTeamCamps(searchTerm = '') {
  let sql = `SELECT * FROM Team_oversees_Camp`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE TO_CHAR(Camp_ID) LIKE :1 OR TO_CHAR(Team_ID) LIKE :2`;
    binds = [`%${searchTerm}%`, `%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addTeamCamp(formData: FormData) {
  const sql = `INSERT INTO Team_oversees_Camp (Camp_ID, Team_ID) VALUES (:1, :2)`;
  const binds = [formData.get('CAMP_ID'), formData.get('TEAM_ID')];
  await executeDML(sql, binds);
  revalidatePath('/team-camp');
}

export async function deleteTeamCamp(campId: string, teamId: string) {
  const sql = `DELETE FROM Team_oversees_Camp WHERE Camp_ID = :1 AND Team_ID = :2`;
  await executeDML(sql, [campId, teamId]);
  revalidatePath('/team-camp');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}