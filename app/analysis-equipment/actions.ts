'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getAnalysisEquipments(searchTerm = '') {
  let sql = `SELECT * FROM Analysis_Equipment`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE UPPER(Equipment) LIKE UPPER(:1)`;
    binds = [`%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addAnalysisEquipment(formData: FormData) {
  const sql = `INSERT INTO Analysis_Equipment (Team_ID, Equipment) VALUES (:1, :2)`;
  const binds = [formData.get('TEAM_ID'), formData.get('EQUIPMENT')];
  await executeDML(sql, binds);
  revalidatePath('/analysis-equipment');
}

export async function updateAnalysisEquipment(modifiedData: FormData)
{
  const sql = 
  `
    UPDATE Analysis_equipment
    SET Equipment=:1
    WHERE Team_ID=:2 AND Equipment=:3
  `

  const getVal = (key: string) => {
    const val = modifiedData.get(key);
    return val === '' ? null : val;
  };

  const binds = [
    getVal('EQUIPMENT'),
    getVal('TEAM_ID'),
    getVal('OLD_EQUIPMENT')
  ];

  try {
    await executeDML(sql, binds);
    revalidatePath('/analysis-equipment');
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Error("Failed to update database");
  }
}


export async function deleteAnalysisEquipment(teamId: string, equipment: string) {
  const sql = `DELETE FROM Analysis_Equipment WHERE Team_ID = :1 AND Equipment = :2`;
  await executeDML(sql, [teamId, equipment]);
  revalidatePath('/analysis-equipment');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}