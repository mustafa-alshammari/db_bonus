'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getAnimals(searchTerm = '') {
  let sql = `SELECT * FROM Animal`;
  let binds: any[] = [];

  if (searchTerm) {
    sql += ` WHERE UPPER(Animal_Type) LIKE UPPER(:1) OR UPPER(Species) LIKE UPPER(:2)`;
    binds = [`%${searchTerm}%`, `%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addAnimal(formData: FormData) {
  const sql = `INSERT INTO Animal (Animal_ID, Age, Gender, Animal_Type, Species, Diet) VALUES (:1, :2, :3, :4, :5, :6)`;
  const binds = [formData.get('ANIMAL_ID'), formData.get('AGE'), formData.get('GENDER'), formData.get('ANIMAL_TYPE'), formData.get('SPECIES'), formData.get('DIET')];
  await executeDML(sql, binds);
  revalidatePath('/animal');
}

export async function deleteAnimal(id: string) {
  const sql = `DELETE FROM Animal WHERE Animal_ID = :1`;
  await executeDML(sql, [id]);
  revalidatePath('/animal');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}