'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getEmployees(searchTerm = '', searchSSN = '') {
  let sql = `SELECT * FROM Employee WHERE 1 = 1`;
  let binds: any[] = [];

  if (searchTerm) {
    sql += ` AND (UPPER(First_name) LIKE UPPER(:${binds.length + 1}) OR UPPER(Last_name) LIKE UPPER(:${binds.length + 2}))`;
    binds.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }

  if (searchSSN) {
    sql += ` AND SSN = :${binds.length + 1}`;
    binds.push(searchSSN);
  }

  return await executeDML(sql, binds);
}

export async function updateEmployee(modifiedData: FormData)
{
  const sql = `
    UPDATE Employee
    SET FIRST_NAME=:1,
        LAST_NAME=:2,
        HIRE_DATE=TO_DATE(:3, 'YYYY-MM-DD'),
        SALARY=:4,
        FIELD_OF_WORK=:5,
        MANAGER_ID=:6
    WHERE SSN=:7     
  `

  const getVal = (key: string) => {
    const val = modifiedData.get(key);
    return val === '' ? null : val;
  };

  const binds = [
    getVal('FIRST_NAME'), 
    getVal('LAST_NAME'),
    getVal('HIRE_DATE'), 
    getVal('SALARY'), 
    getVal('FIELD_OF_WORK'),
    getVal('MANAGER_ID'),
    getVal('SSN')
  ];

  try {
    await executeDML(sql, binds);
    revalidatePath('/employee');
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Error("Failed to update database");
  }
}

export async function addEmployee(formData: FormData) {
  const sql = `
    INSERT INTO Employee (SSN, First_name, Last_name, hire_date, Salary, Field_of_work, Manager_ID) 
    VALUES (:1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'), :5, :6, :7)
  `;

  const binds = [
    formData.get('SSN'), formData.get('FIRST_NAME'), formData.get('LAST_NAME'),
    formData.get('HIRE_DATE'), formData.get('SALARY'), formData.get('FIELD_OF_WORK'),
    formData.get('MANAGER_ID')
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
    nullable: row.NULLABLE === 'Y'
  }));
}