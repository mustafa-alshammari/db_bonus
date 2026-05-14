'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getBirds(searchTerm = '') {
  let sql = `SELECT * FROM Birds`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE TO_CHAR(Flock_Size) LIKE :1 OR TO_CHAR(Animal_ID) LIKE :2`;
    binds = [`%${searchTerm}%`, `%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addBird(formData: FormData) {
  const sql = `INSERT INTO Birds (Animal_ID, Flock_Size) VALUES (:1, :2)`;
  const binds = [formData.get('ANIMAL_ID'), formData.get('FLOCK_SIZE')];
  await executeDML(sql, binds);
  revalidatePath('/birds');
}

export async function updateBird(modifiedData: FormData)
{
  const sql = `
    UPDATE Birds
    SET FLOCK_SIZE=:1
    WHERE ANIMAL_ID=:7     
  `

  const getVal = (key: string) => {
    const val = modifiedData.get(key);
    return val === '' ? null : val;
  };

  const binds = [
    getVal('FLOCK_SIZE'),
    getVal('ANIMAL_ID')
  ];

  try {
    await executeDML(sql, binds);
    revalidatePath('/birds');
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Error("Failed to update database");
  }
}

export async function deleteBird(animalId: string) {
  const sql = `DELETE FROM Birds WHERE Animal_ID = :1`;
  await executeDML(sql, [animalId]);
  revalidatePath('/birds');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}