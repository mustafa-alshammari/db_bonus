import { getPhoneNumbers, addPhoneNumber, deletePhoneNumber, getTableMetadata } from './actions';
import Search from '@/components/Search';
import AddEntry from '@/components/AddEntry';

export default async function PhoneNumberScreen({ searchParams }: any) {
  const params = await searchParams;
  const search = params.search || ''; 
  const phoneNumbers = await getPhoneNumbers(search);
  const tableColumns = await getTableMetadata('Phone_Number')

  return (
    <div className="p-8 bg-gray-800">
      <h1 className="text-2xl font-bold mb-4">Employee Phone Numbers</h1>
      <Search defaultSearch='' />
      <AddEntry tableName='Phone_Number' columns={tableColumns} action={addPhoneNumber} />

      <table className="w-full text-left border-collapse bg-gray-800">
        <thead>
          <tr className="border-b">
            <th className="p-2">Employee SSN</th>
            <th className="p-2">Phone Number</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {phoneNumbers.map((item: any) => (
            <tr key={`${item.SSN}-${item.PHONE_NUMBER}`} className="border-b">
              <td className="p-2">{item.SSN}</td>
              <td className="p-2">{item.PHONE_NUMBER}</td>
              <td className="p-2 flex gap-2">
                <form action={deletePhoneNumber.bind(null, item.SSN, item.PHONE_NUMBER)}>
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