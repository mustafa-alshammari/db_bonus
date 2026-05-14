import { getInhabits, addInhabit, deleteInhabit, getTableMetadata } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';

export default async function InhabitScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const inhabits = await getInhabits(search);
  const inhabitTableColumns = await getTableMetadata('Inhabit')

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Inhabit Management</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Inhabit' columns={inhabitTableColumns} action={addInhabit} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Camp ID</th>
            <th className="p-2">Animal ID</th>
            <th className="p-2">Population Size</th>
            <th className="p-2">Last Check Up</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inhabits.map((item: any) => (
            <tr key={`${item.CAMP_ID}-${item.ANIMAL_ID}`} className="border-b">
              <td className="p-2">{item.CAMP_ID}</td>
              <td className="p-2">{item.ANIMAL_ID}</td>
              <td className="p-2">{item.POPULATION_SIZE}</td>
              <td className="p-2">{item.LAST_CHECK_UP?.toLocaleDateString('en-GB')}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteInhabit.bind(null, item.CAMP_ID, item.ANIMAL_ID)}>
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