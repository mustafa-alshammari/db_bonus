import { getSafetyRoles, addSafetyRole, deleteSafetyRole, getTableMetadata, updateSafety_Roles } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';
import ModifyEntry from '@/components/ModifyEntry';

export default async function SafetyRolesScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const roles = await getSafetyRoles(search);
  const tableColumns = await getTableMetadata('Safety_roles')

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Safety Roles</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Safety_roles' columns={tableColumns} action={addSafetyRole} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Team ID</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((item: any) => (
            <tr key={`${item.TEAM_ID}-${item.ROLE}`} className="border-b">
              <td className="p-2">{item.TEAM_ID}</td>
              <td className="p-2">{item.ROLE}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteSafetyRole.bind(null, item.TEAM_ID, item.ROLE)}>
                   <button type="submit" className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600">Delete</button>
                </form>
                <ModifyEntry columns={tableColumns} rowData={item} updateAction={updateSafety_Roles} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}