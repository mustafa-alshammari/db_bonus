import { getProjects, addProject, deleteProject, getTableMetadata } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';

export default async function ProjectsScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const projects = await getProjects(search);

  const projectTableColumns = await getTableMetadata('Projects')

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Projects Management</h1>

      <Search defaultSearch='' />
      <AddEntry tableName='Projects' columns={projectTableColumns} action={addProject} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Funding Source</th>
            <th className="p-2">Start Date</th>
            <th className="p-2">Deadline</th>
            <th className="p-2">Managed By</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((proj: any) => (
            <tr key={proj.PROJECT_ID} className="border-b">
              <td className="p-2">{proj.PROJECT_ID}</td>
              <td className="p-2">{proj.PROJECT_NAME}</td>
              <td className="p-2">{proj.FUNDING_SOURCE}</td>
              <td className="p-2">{proj.START_DATE?.toLocaleDateString('en-GB')}</td>
              <td className="p-2">{proj.DEADLINE?.toLocaleDateString('en-GB')}</td>
              <td className="p-2">{proj.MANAGED_BY}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteProject.bind(null, proj.PROJECT_ID)}>
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