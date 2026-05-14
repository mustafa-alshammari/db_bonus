import { getAnimals, addAnimal, deleteAnimal, getTableMetadata } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';

export default async function AnimalScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const animals = await getAnimals(search);
  const animalColumns = await getTableMetadata('Animal');

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Animal Management</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Animal' columns={animalColumns} action={addAnimal} />
      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">ID</th><th className="p-2">Age</th><th className="p-2">Gender</th>
            <th className="p-2">Type</th><th className="p-2">Species</th><th className="p-2">Diet</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {animals.map((anim: any) => (
            <tr key={anim.ANIMAL_ID} className="border-b">
              <td className="p-2">{anim.ANIMAL_ID}</td><td className="p-2">{anim.AGE}</td><td className="p-2">{anim.GENDER}</td>
              <td className="p-2">{anim.ANIMAL_TYPE}</td><td className="p-2">{anim.SPECIES}</td><td className="p-2">{anim.DIET}</td>
              <td className="p-2 flex gap-2">
                <form action={deleteAnimal.bind(null, anim.ANIMAL_ID)}>
                   <button type="submit" className="bg-red-500 text-white px-2 py-1 text-sm rounded">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}