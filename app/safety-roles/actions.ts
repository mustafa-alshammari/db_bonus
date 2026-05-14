'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getSafetyRoles(searchTerm = '') {
  let sql = `SELECT * FROM Safety_roles`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE UPPER(Role) LIKE UPPER(:1)`;
    binds = [`%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addSafetyRole(formData: FormData) {
  const sql = `INSERT INTO Safety_roles (Role, Team_ID) VALUES (:1, :2)`;
  const binds = [formData.get('ROLE'), formData.get('TEAM_ID')];
  await executeDML(sql, binds);
  revalidatePath('/safety-roles');
}

export async function updateSafety_Roles(modifiedData: FormData)
{
  const sql = 
  `
    UPDATE Safety_Roles
    SET Role=:1
    WHERE Team_ID=:2 AND Role=:3     
  `

  const getVal = (key: string) => {
    const val = modifiedData.get(key);
    return val === '' ? null : val;
  };

  const binds = [ 
    getVal('ROLE'), 
    getVal('TEAM_ID'),
    getVal('OLD_ROLE')
  ];

  try {
    await executeDML(sql, binds);
    revalidatePath('/safety-roles');
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Error("Failed to update database");
  }
}

export async function deleteSafetyRole(teamId: string, role: string) {
  const sql = `DELETE FROM Safety_roles WHERE Team_ID = :1 AND Role = :2`;
  await executeDML(sql, [teamId, role]);
  revalidatePath('/safety-roles');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}