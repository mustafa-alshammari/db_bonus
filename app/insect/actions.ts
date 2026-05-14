'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getInsects(searchTerm = '') {
  let sql = `SELECT * FROM Insect`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE UPPER(Has_wings) LIKE UPPER(:1)`;
    binds = [`%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addInsect(formData: FormData) {
  const sql = `INSERT INTO Insect (Animal_ID, Has_wings) VALUES (:1, :2)`;
  const binds = [formData.get('ANIMAL_ID'), formData.get('HAS_WINGS')];
  await executeDML(sql, binds);
  revalidatePath('/insect');
}

export async function updateInsects(modifiedData: FormData)
{
  const sql = 
  `
    UPDATE Insect
    SET has_wings=:1
    WHERE Animal_ID=:2     
  `

  const getVal = (key: string) => {
    const val = modifiedData.get(key);
    return val === '' ? null : val;
  };

  const binds = [ 
    getVal('HAS_WINGS'), 
    getVal('ANIMAL_ID')
  ];

  try {
    await executeDML(sql, binds);
    revalidatePath('/insect');
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Error("Failed to update database");
  }
}

export async function deleteInsect(animalId: string) {
  const sql = `DELETE FROM Insect WHERE Animal_ID = :1`;
  await executeDML(sql, [animalId]);
  revalidatePath('/insect');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}