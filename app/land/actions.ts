'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getLandAnimals(searchTerm = '') {
  let sql = `SELECT * FROM Land`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE TO_CHAR(Animal_ID) LIKE :1`;
    binds = [`%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addLandAnimal(formData: FormData) {
  const sql = `INSERT INTO Land (Animal_ID) VALUES (:1)`;
  const binds = [formData.get('ANIMAL_ID')];
  await executeDML(sql, binds);
  revalidatePath('/land');
}

export async function deleteLandAnimal(animalId: string) {
  const sql = `DELETE FROM Land WHERE Animal_ID = :1`;
  await executeDML(sql, [animalId]);
  revalidatePath('/land');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}