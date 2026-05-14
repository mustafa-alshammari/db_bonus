'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getCamps(searchTerm = '') {
  let sql = `SELECT * FROM Camps`;
  let binds: any[] = [];

  if (searchTerm) {
    sql += ` WHERE UPPER(Location) LIKE UPPER(:1) OR UPPER(Biome_type) LIKE UPPER(:2)`;
    binds = [`%${searchTerm}%`, `%${searchTerm}%`];
  }

  return await executeDML(sql, binds);
}

export async function addCamp(formData: FormData) {
  const sql = `
    INSERT INTO Camps (Camp_ID, Danger_level, Location, Climate, Biome_type) 
    VALUES (:1, :2, :3, :4, :5)
  `;

  const binds = [
    formData.get('CAMP_ID'), formData.get('DANGER_LEVEL'), formData.get('LOCATION'),
    formData.get('CLIMATE'), formData.get('BIOME_TYPE')
  ];

  await executeDML(sql, binds);
  revalidatePath('/camps');
}

export async function updateCamps(modifiedData: FormData)
{
  const sql = 
  `
    UPDATE Camps
    SET Danger_level=:1,
        Location=:2,
        Climate=:3,
        Biome_type=:4
    WHERE Camp_ID=:5
  `
  const getVal = (key: string) => {
    const val = modifiedData.get(key);
    return val === '' ? null : val;
  };

  const binds = [ 
    getVal('DANGER_LEVEL'),
    getVal('LOCATION'),
    getVal('CLIMATE'),
    getVal('BIOME_TYPE'),
    getVal('CAMP_ID')
  ];

  try {
    await executeDML(sql, binds);
    revalidatePath('/camps');
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Error("Failed to update database");
  }
}

export async function deleteCamp(id: string) {
  const sql = `DELETE FROM Camps WHERE Camp_ID = :1`;
  await executeDML(sql, [id]);
  revalidatePath('/camps');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}