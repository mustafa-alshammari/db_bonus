import { getHealthStatuses, addHealthStatus, deleteHealthStatus, getTableMetadata, updateHealthStatus } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';
import ModifyEntry from '@/components/ModifyEntry';

export default async function HealthStatusScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const healthStatuses = await getHealthStatuses(search);
  const tableColumns = await getTableMetadata('Health_Status')

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Health Statuses</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Health_Status' columns={tableColumns} action={addHealthStatus} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Animal ID</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {healthStatuses.map((item: any) => (
            <tr key={`${item.ANIMAL_ID}-${item.STATUS}`} className="border-b">
              <td className="p-2">{item.ANIMAL_ID}</td>
              <td className="p-2">{item.STATUS}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteHealthStatus.bind(null, item.ANIMAL_ID, item.STATUS)}>
                   <button type="submit" className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600">Delete</button>
                </form>
                <ModifyEntry columns={tableColumns} rowData={item} updateAction={updateHealthStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}