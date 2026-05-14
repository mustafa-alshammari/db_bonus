import { getAnalysisEquipments, addAnalysisEquipment, deleteAnalysisEquipment, getTableMetadata, updateAnalysisEquipment } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';
import ModifyEntry from '@/components/ModifyEntry';

export default async function AnalysisEquipmentScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const equipmentRecords = await getAnalysisEquipments(search);
  const columns = await getTableMetadata('Analysis_Equipment');

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Analysis Equipment</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Analysis_Equipment' columns={columns} action={addAnalysisEquipment} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Team ID</th>
            <th className="p-2">Equipment</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {equipmentRecords.map((item: any) => (
            <tr key={`${item.TEAM_ID}-${item.EQUIPMENT}`} className="border-b">
              <td className="p-2">{item.TEAM_ID}</td>
              <td className="p-2">{item.EQUIPMENT}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteAnalysisEquipment.bind(null, item.TEAM_ID, item.EQUIPMENT)}>
                   <button type="submit" className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600">Delete</button>
                </form>
                <ModifyEntry columns={columns} rowData={item} updateAction={updateAnalysisEquipment} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}