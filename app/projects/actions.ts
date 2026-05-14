'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getProjects(searchTerm = '') {
  let sql = `SELECT * FROM Projects`;
  let binds: any[] = [];

  if (searchTerm) {
    sql += ` WHERE UPPER(Project_name) LIKE UPPER(:1) OR UPPER(Funding_source) LIKE UPPER(:2)`;
    binds = [`%${searchTerm}%`, `%${searchTerm}%`];
  }

  return await executeDML(sql, binds);
}

export async function updateProjects(modifiedData: FormData)
{
  const sql = 
  `
    UPDATE Projects
    SET Project_name=:1,
        Funding_source=:2,
        Deadline=TO_DATE(:3, 'YYYY-MM-DD'),
        Start_date=TO_DATE(:4, 'YYYY-MM-DD'),
        Managed_by=:5
    WHERE PROJECT_ID=:6
  `

  const getVal = (key: string) => {
    const val = modifiedData.get(key);
    return val === '' ? null : val;
  };

  const binds = [ 
    getVal('PROJECT_NAME'),
    getVal('FUNDING_SOURCE'),
    getVal('DEADLINE'),
    getVal('START_DATE'),
    getVal('MANAGED_BY'),
    getVal('PROJECT_ID')
  ];

  try {
    await executeDML(sql, binds);
    revalidatePath('/projects');
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Error("Failed to update database");
  }
}


export async function addProject(formData: FormData) {
  const sql = `
    INSERT INTO Projects (Project_ID, Project_name, Funding_source, Deadline, Start_date, Managed_by) 
    VALUES (:1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'), TO_DATE(:5, 'YYYY-MM-DD'), :6)
  `;

  const binds = [
    formData.get('PROJECT_ID'), formData.get('PROJECT_NAME'), formData.get('FUNDING_SOURCE'),
    formData.get('DEADLINE'), formData.get('START_DATE'), formData.get('MANAGED_BY')
  ];

  await executeDML(sql, binds);
  revalidatePath('/projects');
}

export async function deleteProject(id: string) {
  const sql = `DELETE FROM Projects WHERE Project_ID = :1`;
  await executeDML(sql, [id]);
  revalidatePath('/projects');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}