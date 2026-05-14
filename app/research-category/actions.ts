'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getResearchCategories(searchTerm = '') {
  let sql = `SELECT * FROM Research_category`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE UPPER(Category) LIKE UPPER(:1)`;
    binds = [`%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addResearchCategory(formData: FormData) {
  const sql = `INSERT INTO Research_category (Category, Team_ID) VALUES (:1, :2)`;
  const binds = [formData.get('CATEGORY'), formData.get('TEAM_ID')];
  await executeDML(sql, binds);
  revalidatePath('/research-category');
}

export async function updateResearchCategory(modifiedData: FormData)
{
  const sql = 
  `
    UPDATE Research_Category
    SET Category=:1
    WHERE Team_ID=:2 AND Category=:3      
  `

  const getVal = (key: string) => {
    const val = modifiedData.get(key);
    return val === '' ? null : val;
  };

  const binds = [ 
    getVal('CATEGORY'), 
    getVal('TEAM_ID'),
    getVal('OLD_CATEGORY')
  ];

  try {
    await executeDML(sql, binds);
    revalidatePath('/research-category');
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Error("Failed to update database");
  }
}

export async function deleteResearchCategory(teamId: string, category: string) {
  const sql = `DELETE FROM Research_category WHERE Team_ID = :1 AND Category = :2`;
  await executeDML(sql, [teamId, category]);
  revalidatePath('/research-category');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}