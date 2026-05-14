'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getEmployees(searchTerm = '') {
  let sql = `SELECT * FROM Employee`;
  let binds: any[] = [];

  if (searchTerm) {
    sql += ` WHERE UPPER(First_name) LIKE UPPER(:1) OR UPPER(Last_name) LIKE UPPER(:2)`;
    binds = [`%${searchTerm}%`, `%${searchTerm}%`];
  }

  return await executeDML(sql, binds);
}

export async function addEmployee(formData: FormData) {
  const sql = `
    INSERT INTO Employee (SSN, First_name, Last_name, hire_date, Salary, Field_of_work, Manager_ID) 
    VALUES (:1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'), :5, :6, :7)
  `;

  const binds = [
    formData.get('SSN'), formData.get('First_name'), formData.get('Last_name'),
    formData.get('hire_date'), formData.get('Salary'), formData.get('Field_of_work'),
    formData.get('Manager_ID')
  ];

  await executeDML(sql, binds);
  revalidatePath('/employee');
}

export async function deleteEmployee(ssn: string) {
  const sql = `DELETE FROM Employee WHERE SSN = :1`;
  await executeDML(sql, [ssn]);
  revalidatePath('/employee');
}

export async function updateEmployeeSalary(ssn: string, newSalary: number) {
  const sql = `UPDATE Employee SET Salary = :1 WHERE SSN = :2`;
  await executeDML(sql, [newSalary, ssn]);
  revalidatePath('/employee');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `
    SELECT column_name, data_type, nullable 
    FROM user_tab_columns 
    WHERE table_name = :tableName
    ORDER BY column_id
  `;

  const rows = await executeDML(sql, [tableName.toUpperCase()]);

  return rows.map((row: any) => ({
    name: row.COLUMN_NAME,
    dataType: row.DATA_TYPE,
    nullable: row.nullable === 'Y'
  }));
}