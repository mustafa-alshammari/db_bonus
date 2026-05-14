import { getResearchCategories, addResearchCategory, deleteResearchCategory, getTableMetadata, updateResearchCategory } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';
import ModifyEntry from '@/components/ModifyEntry';

export default async function ResearchCategoryScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const categories = await getResearchCategories(search);
  const columns = await getTableMetadata('Research_category');

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Research Categories</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Research_category' columns={columns} action={addResearchCategory} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Category</th>
            <th className="p-2">Team ID</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((item: any) => (
            <tr key={`${item.TEAM_ID}-${item.CATEGORY}`} className="border-b">
              <td className="p-2">{item.CATEGORY}</td>
              <td className="p-2">{item.TEAM_ID}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteResearchCategory.bind(null, item.TEAM_ID, item.CATEGORY)}>
                   <button type="submit" className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600">Delete</button>
                </form>
                <ModifyEntry columns={columns} rowData={item} updateAction={updateResearchCategory} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}