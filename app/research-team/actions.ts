'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getResearchTeams(searchTerm = '') {
  let sql = `SELECT * FROM Research_Team`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE TO_CHAR(Team_ID) LIKE :1`;
    binds = [`%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addResearchTeam(formData: FormData) {
  const sql = `INSERT INTO Research_Team (Team_ID) VALUES (:1)`;
  const binds = [formData.get('TEAM_ID')];
  await executeDML(sql, binds);
  revalidatePath('/research-team');
}

export async function deleteResearchTeam(teamId: string) {
  const sql = `DELETE FROM Research_Team WHERE Team_ID = :1`;
  await executeDML(sql, [teamId]);
  revalidatePath('/research-team');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}