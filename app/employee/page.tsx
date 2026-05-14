import AddEmployee from '@/components/AddEntry';
import { getEmployees, addEmployee, deleteEmployee, getTableMetadata } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';

export default async function EmployeeScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const employees = await getEmployees(search);

  const employeeTableColumns = await getTableMetadata('Employee')

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>

      <Search defaultSearch='' />

      <AddEntry tableName='Employee' columns={employeeTableColumns} action={addEmployee} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">SSN</th>
            <th className="p-2">Name</th>
            <th className="p-2">Field Of Work</th>
            <th className="p-2">Salary</th>
            <th className="p-2">Hire Date</th>
            <th className="p-2">Manager</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp: any) => (
            <tr key={emp.SSN} className="border-b">
              <td className="p-2">{emp.SSN}</td>
              <td className="p-2">{emp.FIRST_NAME} {emp.LAST_NAME}</td>
              <td className="p-2">{emp.FIELD_OF_WORK}</td>
              <td className="p-2">${emp.SALARY}</td>
              <td className="p-2">{emp.HIRE_DATE.toLocaleDateString('en-GB')}</td>
              <td className="p-2">{emp.MANAGER_ID ?? "No Manager"}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteEmployee.bind(null, emp.SSN)}>
                   <button type="submit" className="bg-red-500 text-white px-2 py-1 text-sm">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}