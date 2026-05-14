import { getInsects, addInsect, deleteInsect, getTableMetadata, updateInsects } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';
import ModifyEntry from '@/components/ModifyEntry';

export default async function InsectScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const insects = await getInsects(search);
  const tableColumns = await getTableMetadata('Insect')

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Insects Classification</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Insect' columns={tableColumns} action={addInsect} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Animal ID</th>
            <th className="p-2">Has Wings</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {insects.map((item: any) => (
            <tr key={item.ANIMAL_ID} className="border-b">
              <td className="p-2">{item.ANIMAL_ID}</td>
              <td className="p-2">{item.HAS_WINGS}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteInsect.bind(null, item.ANIMAL_ID)}>
                   <button type="submit" className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600">Delete</button>
                </form>
                <ModifyEntry columns={tableColumns} rowData={item} updateAction={updateInsects} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}