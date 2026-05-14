import { getCamps, addCamp, deleteCamp, getTableMetadata, updateCamps } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';
import ModifyEntry from '@/components/ModifyEntry';

export default async function CampsScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const camps = await getCamps(search);
  const campTableColumns = await getTableMetadata('Camps')

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Camps Management</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Camps' columns={campTableColumns} action={addCamp} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Camp ID</th>
            <th className="p-2">Danger Level</th>
            <th className="p-2">Location</th>
            <th className="p-2">Climate</th>
            <th className="p-2">Biome Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {camps.map((camp: any) => (
            <tr key={camp.CAMP_ID} className="border-b">
              <td className="p-2">{camp.CAMP_ID}</td>
              <td className="p-2">{camp.DANGER_LEVEL}</td>
              <td className="p-2">{camp.LOCATION}</td>
              <td className="p-2">{camp.CLIMATE}</td>
              <td className="p-2">{camp.BIOME_TYPE}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteCamp.bind(null, camp.CAMP_ID)}>
                   <button type="submit" className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600">Delete</button>
                </form>
                <ModifyEntry columns={campTableColumns} rowData={camp} updateAction={updateCamps} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}