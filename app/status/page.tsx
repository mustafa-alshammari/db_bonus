import { getStatuses, addStatus, deleteStatus, getTableMetadata, updateStatus } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';
import ModifyEntry from '@/components/ModifyEntry';

export default async function StatusScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const statuses = await getStatuses(search);
  const statusColumns = await getTableMetadata('Status')

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Animal Status</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Status' columns={statusColumns} action={addStatus} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Animal ID</th>
            <th className="p-2">Count</th>
            <th className="p-2">Description</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {statuses.map((item: any) => (
            <tr key={item.ANIMAL_ID} className="border-b">
              <td className="p-2">{item.ANIMAL_ID}</td>
              <td className="p-2">{item.COUNT}</td>
              <td className="p-2">{item.DESCRIPTION}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteStatus.bind(null, item.ANIMAL_ID)}>
                   <button type="submit" className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600">Delete</button>
                </form>
                <ModifyEntry columns={statusColumns} rowData={item} updateAction={updateStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}