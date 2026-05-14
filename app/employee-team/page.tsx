import { getEmployeeTeams, addEmployeeTeam, deleteEmployeeTeam, getTableMetadata } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';

export default async function EmployeeTeamScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const assignments = await getEmployeeTeams(search);
  const tableColumns = await getTableMetadata('Employee_part_of_team');

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Employee Team Assignments</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Employee_part_of_team' columns={tableColumns} action={addEmployeeTeam} />
      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Team ID</th><th className="p-2">Employee SSN</th>
            <th className="p-2">Assigned Manager</th><th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment: any) => (
            <tr key={`${assignment.TEAM_ID}-${assignment.SSN}`} className="border-b">
              <td className="p-2">{assignment.TEAM_ID}</td>
              <td className="p-2">{assignment.SSN}</td>
              <td className="p-2">{assignment.ASSIGNED_MANAGER}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteEmployeeTeam.bind(null, assignment.TEAM_ID, assignment.SSN)}>
                   <button type="submit" className="bg-red-500 text-white px-2 py-1 text-sm rounded">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}