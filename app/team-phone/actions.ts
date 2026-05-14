'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getTeamPhones(searchTerm = '') {
  let sql = `SELECT * FROM Team_Phone`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE UPPER(Phone) LIKE UPPER(:1)`;
    binds = [`%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function updateTeam_Phone(modifiedData: FormData)
{
  const sql = 
  `
    UPDATE Team_Phone
    SET Phone=:1
    WHERE Team_ID=:2     
  `

  const getVal = (key: string) => {
    const val = modifiedData.get(key);
    return val === '' ? null : val;
  };

  const binds = [ 
    getVal('PHONE'), 
    getVal('TEAM_ID')
  ];

  try {
    await executeDML(sql, binds);
    revalidatePath('/team-phone');
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Error("Failed to update database");
  }
}

export async function addTeamPhone(formData: FormData) {
  const sql = `INSERT INTO Team_Phone (Team_ID, Phone) VALUES (:1, :2)`;
  const binds = [formData.get('TEAM_ID'), formData.get('PHONE')];
  await executeDML(sql, binds);
  revalidatePath('/team-phone');
}

export async function deleteTeamPhone(teamId: string, phone: string) {
  const sql = `DELETE FROM Team_Phone WHERE Team_ID = :1 AND Phone = :2`;
  await executeDML(sql, [teamId, phone]);
  revalidatePath('/team-phone');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}