'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getInhabits(searchTerm = '') {
  // Simple search by ID since we don't have text fields directly inside Inhabit
  let sql = `SELECT * FROM Inhabit`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE TO_CHAR(Camp_ID) LIKE :1 OR TO_CHAR(Animal_ID) LIKE :2`;
    binds = [`%${searchTerm}%`, `%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addInhabit(formData: FormData) {
  const sql = `
    INSERT INTO Inhabit (Camp_ID, Animal_ID, Population_size, Last_check_up) 
    VALUES (:1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'))
  `;
  const binds = [
    formData.get('CAMP_ID'), formData.get('ANIMAL_ID'), 
    formData.get('POPULATION_SIZE'), formData.get('LAST_CHECK_UP')
  ];

  await executeDML(sql, binds);
  revalidatePath('/inhabit');
}

export async function deleteInhabit(campId: string, animalId: string) {
  const sql = `DELETE FROM Inhabit WHERE Camp_ID = :1 AND Animal_ID = :2`;
  await executeDML(sql, [campId, animalId]);
  revalidatePath('/inhabit');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}