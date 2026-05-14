import { getAnalyses, addAnalysis, deleteAnalysis, getTableMetadata } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';

export default async function AnalysisScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const analyses = await getAnalyses(search);
  const columns = await getTableMetadata('Analysis');

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Analysis Teams</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Analysis' columns={columns} action={addAnalysis} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Team ID</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {analyses.map((item: any) => (
            <tr key={item.TEAM_ID} className="border-b">
              <td className="p-2">{item.TEAM_ID}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteAnalysis.bind(null, item.TEAM_ID)}>
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