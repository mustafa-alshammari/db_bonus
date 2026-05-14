import { getTeamStudies, addTeamStudy, deleteTeamStudy, getTableMetadata } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';

export default async function TeamStudiesAnimalScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const studies = await getTeamStudies(search);
  const tableColumns = await getTableMetadata('Team_studies_animal')

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Team Studies Animal</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Team_studies_animal' columns={tableColumns} action={addTeamStudy} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Team ID</th>
            <th className="p-2">Animal ID</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {studies.map((item: any) => (
            <tr key={`${item.TEAM_ID}-${item.ANIMAL_ID}`} className="border-b">
              <td className="p-2">{item.TEAM_ID}</td>
              <td className="p-2">{item.ANIMAL_ID}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteTeamStudy.bind(null, item.TEAM_ID, item.ANIMAL_ID)}>
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