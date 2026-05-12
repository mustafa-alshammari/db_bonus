import { SearchParams } from 'next/dist/server/request/search-params';
import { getEmployees, addEmployee, deleteEmployee } from './actions';

export default async function EmployeeScreen({ searchParams } :  { searchParams: SearchParams }) {
  const search = searchParams.search || '';
  const employees = await getEmployees(search as any);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>

      <form method="GET" className="mb-8">
        <input 
          name="search" 
          defaultValue={search} 
          placeholder="Search by name..." 
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Search</button>
      </form>

      <form action={addEmployee} className="grid grid-cols-4 gap-4 mb-8 p-4 border bg-gray-50">
        <input name="SSN" placeholder="SSN" required className="border p-2"/>
        <input name="First_name" placeholder="First Name" required className="border p-2"/>
        <input name="Last_name" placeholder="Last Name" required className="border p-2"/>
        <input name="hire_date" type="date" required className="border p-2"/>
        <input name="Salary" type="number" placeholder="Salary" required className="border p-2"/>
        <input name="Field_of_word" placeholder="Field of Work" className="border p-2"/>
        <input name="Manager_ID" placeholder="Manager ID (Optional)" className="border p-2"/>
        <button type="submit" className="bg-green-500 text-white p-2">Add New Employee</button>
      </form>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b"><th className="p-2">SSN</th><th className="p-2">Name</th><th className="p-2">Salary</th><th className="p-2">Actions</th></tr>
        </thead>
        <tbody>
          {employees.map((emp: any) => (
            <tr key={emp.SSN} className="border-b">
              <td className="p-2">{emp.SSN}</td>
              <td className="p-2">{emp.FIRST_NAME} {emp.LAST_NAME}</td>
              <td className="p-2">${emp.SALARY}</td>
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