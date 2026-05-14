'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getAquatic(searchTerm = '') {
  let sql = `SELECT * FROM Aquatic`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE TO_CHAR(Depth) LIKE :1 OR TO_CHAR(Animal_ID) LIKE :2`;
    binds = [`%${searchTerm}%`, `%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addAquatic(formData: FormData) {
  const sql = `INSERT INTO Aquatic (Animal_ID, Depth) VALUES (:1, :2)`;
  const binds = [formData.get('ANIMAL_ID'), formData.get('DEPTH')];
  await executeDML(sql, binds);
  revalidatePath('/aquatic');
}

export async function deleteAquatic(animalId: string) {
  const sql = `DELETE FROM Aquatic WHERE Animal_ID = :1`;
  await executeDML(sql, [animalId]);
  revalidatePath('/aquatic');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}