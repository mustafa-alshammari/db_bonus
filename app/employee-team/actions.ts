'use server'
import { ColumnMeta } from '@/components/AddEntry';
import { executeDML } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getEmployeeTeams(searchTerm = '') {
  let sql = `SELECT * FROM Employee_part_of_team`;
  let binds: any[] = [];
  
  if (searchTerm) {
    sql += ` WHERE UPPER(Assigned_Manager) LIKE UPPER(:1)`;
    binds = [`%${searchTerm}%`];
  }
  return await executeDML(sql, binds);
}

export async function addEmployeeTeam(formData: FormData) {
  const sql = `INSERT INTO Employee_part_of_team (Team_ID, SSN, Assigned_Manager) VALUES (:1, :2, :3)`;
  const binds = [formData.get('TEAM_ID'), formData.get('SSN'), formData.get('ASSIGNED_MANAGER')];
  await executeDML(sql, binds);
  revalidatePath('/employee-team');
}

// Notice it takes TWO parameters for the composite key
export async function deleteEmployeeTeam(teamId: string, ssn: string) {
  const sql = `DELETE FROM Employee_part_of_team WHERE Team_ID = :1 AND SSN = :2`;
  await executeDML(sql, [teamId, ssn]);
  revalidatePath('/employee-team');
}

export async function getTableMetadata(tableName: string): Promise<ColumnMeta[]> {
  const sql = `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = :tableName ORDER BY column_id`;
  const rows = await executeDML(sql, [tableName.toUpperCase()]);
  return rows.map((row: any) => ({ name: row.COLUMN_NAME, dataType: row.DATA_TYPE, nullable: row.nullable === 'Y' }));
}