import { getAquatic, addAquatic, deleteAquatic, getTableMetadata } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';

export default async function AquaticScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const aquaticAnimals = await getAquatic(search);
  const tableColumns = await getTableMetadata('Aquatic')

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Aquatic Classification</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Aquatic' columns={tableColumns} action={addAquatic} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Animal ID</th>
            <th className="p-2">Depth</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {aquaticAnimals.map((item: any) => (
            <tr key={item.ANIMAL_ID} className="border-b">
              <td className="p-2">{item.ANIMAL_ID}</td>
              <td className="p-2">{item.DEPTH}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteAquatic.bind(null, item.ANIMAL_ID)}>
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