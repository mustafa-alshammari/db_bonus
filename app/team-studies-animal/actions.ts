'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getTeamStudies(searchTerm = '') {
  let sql = `SELECT * FROM Team_studies_animal`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE TO_CHAR(Team_ID) LIKE :1 OR TO_CHAR(Animal_ID) LIKE :2`;
    binds = [`%${searchTerm}%`, `%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addTeamStudy(formData: FormData) {
  const sql = `INSERT INTO Team_studies_animal (Team_ID, Animal_ID) VALUES (:1, :2)`;
  const binds = [formData.get('TEAM_ID'), formData.get('ANIMAL_ID')];
  await executeDML(sql, binds);
  revalidatePath('/team-studies-animal');
}

export async function deleteTeamStudy(teamId: string, animalId: string) {
  const sql = `DELETE FROM Team_studies_animal WHERE Team_ID = :1 AND Animal_ID = :2`;
  await executeDML(sql, [teamId, animalId]);
  revalidatePath('/team-studies-animal');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}