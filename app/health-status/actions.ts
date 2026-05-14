'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getHealthStatuses(searchTerm = '') {
  let sql = `SELECT * FROM Health_Status`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE UPPER(Status) LIKE UPPER(:1)`;
    binds = [`%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addHealthStatus(formData: FormData) {
  const sql = `INSERT INTO Health_Status (Status, Animal_ID) VALUES (:1, :2)`;
  const binds = [formData.get('STATUS'), formData.get('ANIMAL_ID')];
  await executeDML(sql, binds);
  revalidatePath('/health-status');
}

export async function deleteHealthStatus(animalId: string, status: string) {
  const sql = `DELETE FROM Health_Status WHERE Animal_ID = :1 AND Status = :2`;
  await executeDML(sql, [animalId, status]);
  revalidatePath('/health-status');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}