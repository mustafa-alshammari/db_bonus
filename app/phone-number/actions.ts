'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getPhoneNumbers(searchTerm = '') {
  let sql = `SELECT * FROM Phone_Number`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE Phone_number LIKE :1`;
    binds = [`%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addPhoneNumber(formData: FormData) {
  const sql = `INSERT INTO Phone_Number (SSN, Phone_number) VALUES (:1, :2)`;
  const binds = [formData.get('SSN'), formData.get('PHONE_NUMBER')];
  await executeDML(sql, binds);
  revalidatePath('/phone-number');
}

export async function updatePhone_number(modifiedData: FormData)
{
  const sql = 
  `
    UPDATE Phone_number
    SET phone_number=:1
    WHERE SSN=:2
  `

  const getVal = (key: string) => {
    const val = modifiedData.get(key);
    return val === '' ? null : val;
  };

  const binds = [ 
    getVal('PHONE_NUMBER'),
    getVal('SSN')
  ];

  try {
    await executeDML(sql, binds);
    revalidatePath('/phone-number');
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Error("Failed to update database");
  }
}

export async function deletePhoneNumber(ssn: string, phone: string) {
  const sql = `DELETE FROM Phone_Number WHERE SSN = :1 AND Phone_number = :2`;
  await executeDML(sql, [ssn, phone]);
  revalidatePath('/phone-number');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}