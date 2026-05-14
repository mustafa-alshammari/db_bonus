'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getStatuses(searchTerm = '') {
  let sql = `SELECT * FROM Status`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE UPPER(Description) LIKE UPPER(:1)`;
    binds = [`%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addStatus(formData: FormData) {
  const sql = `INSERT INTO Status (Animal_ID, Count, Description) VALUES (:1, :2, :3)`;
  const binds = [formData.get('ANIMAL_ID'), formData.get('COUNT'), formData.get('DESCRIPTION')];
  await executeDML(sql, binds);
  revalidatePath('/status');
}

export async function updateStatus(modifiedData: FormData)
{
  const sql = `
    UPDATE Status
    SET COUNT=:1,
        DESCRIPTION=:2
    WHERE ANIMAL_ID=:3
  `

  const getVal = (key: string) => {
    const val = modifiedData.get(key);
    return val === '' ? null : val;
  };

  const binds = [
    getVal('COUNT'), 
    getVal('DESCRIPTION'),
    getVal('ANIMAL_ID')
  ];

  try {
    await executeDML(sql, binds);
    revalidatePath('/status');
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Error("Failed to update database");
  }
}

export async function deleteStatus(animalId: string) {
  const sql = `DELETE FROM Status WHERE Animal_ID = :1`;
  await executeDML(sql, [animalId]);
  revalidatePath('/status');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}