import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-10">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">System Dashboard</h1>
        <p className="text-gray-500 mt-2">Manage all database records, teams, and field data.</p>
      </header>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <Link href="/employee" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-blue-50 hover:border-blue-300 transition">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Manage Employees</h5>
          <p className="font-normal text-gray-700">View, insert, update, and delete staff records and assignments.</p>
        </Link>

        {/* Card 2 */}
        <Link href="/team" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-green-50 hover:border-green-300 transition">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Manage Teams</h5>
          <p className="font-normal text-gray-700">Organize research, safety, and analysis teams and their equipment.</p>
        </Link>

        {/* Card 3 */}
        <Link href="/animal" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-amber-50 hover:border-amber-300 transition">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Wildlife Records</h5>
          <p className="font-normal text-gray-700">Access data on tracked animals, habitats, and health statuses.</p>
        </Link>

        {/* Card 4 */}
        <Link href="/camps" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-orange-50 hover:border-orange-300 transition">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Field Camps</h5>
          <p className="font-normal text-gray-700">Monitor base camps, danger levels, and climate conditions.</p>
        </Link>

        {/* Card 5 */}
        <Link href="/projects" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-purple-50 hover:border-purple-300 transition">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Projects</h5>
          <p className="font-normal text-gray-700">Oversee active projects, funding sources, and deadlines.</p>
        </Link>

      </div>
    </div>
  );
}