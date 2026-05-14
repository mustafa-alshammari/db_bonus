import { getLandAnimals, addLandAnimal, deleteLandAnimal, getTableMetadata } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';

export default async function LandScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const landAnimals = await getLandAnimals(search);
  const tableColumns = await getTableMetadata('Land')

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Land Animal Classification</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Land' columns={tableColumns} action={addLandAnimal} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Animal ID</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {landAnimals.map((item: any) => (
            <tr key={item.ANIMAL_ID} className="border-b">
              <td className="p-2">{item.ANIMAL_ID}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteLandAnimal.bind(null, item.ANIMAL_ID)}>
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