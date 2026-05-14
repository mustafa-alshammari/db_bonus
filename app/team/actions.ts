'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getTeams(searchTerm = '') {
  let sql = `SELECT * FROM Team`;
  let binds: any[] = [];

  if (searchTerm) {
    sql += ` WHERE UPPER(Name) LIKE UPPER(:1)`;
    binds = [`%${searchTerm}%`];
  }

  return await executeDML(sql, binds);
}

export async function addTeam(formData: FormData) {
  const sql = `
    INSERT INTO Team (Team_ID, Team_type, Member_count, Email, Name) 
    VALUES (:1, :2, :3, :4, :5)
  `;

  const binds = [
    formData.get('TEAM_ID'), formData.get('TEAM_TYPE'), formData.get('MEMBER_COUNT'),
    formData.get('EMAIL'), formData.get('NAME')
  ];

  await executeDML(sql, binds);
  revalidatePath('/team');
}

export async function deleteTeam(Team_ID: string) {
  const sql = `DELETE FROM Team WHERE Team_ID = :1`;
  await executeDML(sql, [Team_ID]);
  revalidatePath('/team');
}

export async function updateTeamEmail(Team_ID: string, newEmail: number) {
  const sql = `UPDATE Team SET Email = :1 WHERE Team_ID = :2`;
  await executeDML(sql, [newEmail, Team_ID]);
  revalidatePath('/team');
}

export async function fetchSubclassData(Team_ID: string, Team_Type: string)
{

  if (Team_Type == 'Safety')
  {
    const sql = `
      SELECT Location FROM Safety_team
      WHERE Team_ID = :1
    `
  
    const result = await executeDML(sql, [Team_ID]);

    return result && result.length > 0 ? result[0] : null;
  }

  return null;
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `
    SELECT column_name, data_type, nullable 
    FROM user_tab_columns 
    WHERE table_name = :tableName
    ORDER BY column_id
  `;

  const rows = await executeDML(sql, [tableName.toUpperCase()]);

  return rows.map((row: any) => ({
    name: row.COLUMN_NAME,
    dataType: row.DATA_TYPE,
    nullable: row.nullable === 'Y'
  }));
}