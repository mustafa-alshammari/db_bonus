import { addTeam, deleteTeam, getTableMetadata, getTeams } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';
import TeamRow from '@/components/TeamRow';

export default async function TeamScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const teams = await getTeams(search);

  const teamTableColumns = await getTableMetadata('Team')

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Team Management</h1>

      <Search defaultSearch='' />

      <AddEntry tableName='Team' columns={teamTableColumns} action={addTeam} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Type</th>
            <th className="p-2">Member Count</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team: any) => (
            <TeamRow
              key={team.TEAM_ID}
              team={team}
              deleteAction={deleteTeam.bind(null, team.TEAM_ID)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}