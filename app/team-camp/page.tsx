import { getTeamCamps, addTeamCamp, deleteTeamCamp, getTableMetadata } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';

export default async function TeamCampScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const teamCamps = await getTeamCamps(search);
  const tableColumns = await getTableMetadata('Team_oversees_Camp')

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Team Oversees Camp</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Team_oversees_Camp' columns={tableColumns} action={addTeamCamp} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Camp ID</th>
            <th className="p-2">Team ID</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teamCamps.map((item: any) => (
            <tr key={`${item.CAMP_ID}-${item.TEAM_ID}`} className="border-b">
              <td className="p-2">{item.CAMP_ID}</td>
              <td className="p-2">{item.TEAM_ID}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteTeamCamp.bind(null, item.CAMP_ID, item.TEAM_ID)}>
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