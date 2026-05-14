'use client';

import { useState } from 'react';

export interface ColumnMeta {
  name: string;
  dataType: string;
  nullable: boolean;
}

interface ModifyEntryProps {
  columns: ColumnMeta[];
  rowData: any;
  updateAction: (formData: FormData) => Promise<void>;
}

export default function ModifyEntry({ columns, rowData, updateAction }: ModifyEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    try {
      await updateAction(formData);
      setIsExpanded(false);
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setIsPending(false);
    }
  };

  const getDefaultValue = (colName: string, dataType: string) => {
    const val = rowData[colName];
    if (val == null) return '';
    
    if (dataType.includes('DATE') && val instanceof Date) {
      return val.toISOString().split('T')[0];
    }
    return val;
  };

  return (
    <>
      <button 
        onClick={() => setIsExpanded(true)}
        className="bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600"
      >
        Modify
      </button>

      {isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg border border-gray-600">
            <h2 className="text-xl font-bold mb-4 text-white">Modify Entry</h2>
            
            <form action={handleSubmit} className="flex flex-col gap-4">

              {columns.map((col) => (
                <input 
                  key={`old_${col.name}`} 
                  type="hidden" 
                  name={`OLD_${col.name}`} 
                  value={getDefaultValue(col.name, col.dataType)} 
                />
              ))}

              {columns.map((col) => {
                const isPrimaryKey = col.name === 'SSN' || (col.name.includes('_ID') && !col.name.includes('MANAGER_ID'));

                return (
                  <div key={col.name} className="flex flex-col">
                    <label className="text-sm text-gray-300 mb-1">{col.name}</label>
                    <input
                      type={col.dataType.includes('DATE') ? 'date' : col.dataType.includes('NUMBER') ? 'number' : 'text'}
                      name={col.name}
                      defaultValue={getDefaultValue(col.name, col.dataType)}
                      required={!col.nullable && !isPrimaryKey}
                      readOnly={isPrimaryKey}
                      className={`p-2 border rounded text-white ${
                        isPrimaryKey 
                          ? 'bg-gray-600 border-gray-500 cursor-not-allowed text-gray-400' 
                          : 'bg-gray-700 border-gray-600'
                      }`}
                    />
                  </div>
                );
              })}
              
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}