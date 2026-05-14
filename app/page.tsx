import Link from 'next/link';

export default function Home() {

  const routes = [
    { path: '/team', name: 'Team' },
    { path: '/employee', name: 'Employee' },
    { path: '/projects', name: 'Projects' },
    { path: '/team-phone', name: 'Team Phone' },
    { path: '/research-team', name: 'Research Team' },
    { path: '/research-category', name: 'Research Category' },
    { path: '/safety-team', name: 'Safety Team' },
    { path: '/analysis', name: 'Analysis' },
    { path: '/analysis-equipment', name: 'Analysis Equipment' },
    { path: '/safety-roles', name: 'Safety Roles' },
    { path: '/employee-team', name: 'Employee Part of Team' },
    { path: '/camps', name: 'Camps' },
    { path: '/animal', name: 'Animal' },
    { path: '/inhabit', name: 'Inhabit' },
    { path: '/team-camp', name: 'Team Oversees Camp' },
    { path: '/insect', name: 'Insect' },
    { path: '/aquatic', name: 'Aquatic' },
    { path: '/birds', name: 'Birds' },
    { path: '/land', name: 'Land' },
    { path: '/status', name: 'Status' },
    { path: '/health-status', name: 'Health Status' },
    { path: '/team-studies-animal', name: 'Team Studies Animal' },
    { path: '/phone-number', name: 'Employee Phone Number' }
  ];

  return (
    <div className="p-10 bg-gray-500">
      <header className="mb-10 justify-center">
        <h1 className="text-3xl font-extrabold text-gray-900">System Dashboard</h1>
      </header>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {
          routes.map((route) => (
          
          <Link key={route.path} href={`${route.path}`} className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-blue-50 hover:border-blue-300 transition">
            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Manage {route.name}</h5>
            <p className="font-normal text-gray-700">View, insert, update, and delete</p>
          </Link>

          ))
        }


      </div>
    </div>
  );
}