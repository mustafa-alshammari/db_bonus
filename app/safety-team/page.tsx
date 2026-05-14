import { getSafetyTeams, addSafetyTeam, deleteSafetyTeam, getTableMetadata } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';

export default async function SafetyTeamScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const safetyTeams = await getSafetyTeams(search);
  const tableColumns = await getTableMetadata('Safety_team')

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Safety Teams</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Safety_team' columns={tableColumns} action={addSafetyTeam} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Team ID</th>
            <th className="p-2">Location</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {safetyTeams.map((item: any) => (
            <tr key={item.TEAM_ID} className="border-b">
              <td className="p-2">{item.TEAM_ID}</td>
              <td className="p-2">{item.LOCATION}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteSafetyTeam.bind(null, item.TEAM_ID)}>
                   <button type="submit" className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}