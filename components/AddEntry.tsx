"use client";

import { useState } from "react";

export type ColumnMeta = {
    name: string;
    dataType: string;
    nullable: boolean;
};

type Props = {
    tableName: string;
    columns: ColumnMeta[];
    action: (formData: FormData) => Promise<any>; 
};

export default function AddEntry({ tableName, columns, action }: Props) {
    const [visible, setVisible] = useState<boolean>(true);

    const getInputType = (dataType: string) => {
        const type = dataType.toUpperCase();
        if (type.includes("NUMBER")) return "number";
        if (type.includes("DATE") || type.includes("TIMESTAMP")) return "date";
        return "text";
    };

    return (
        <div className="mb-8">
            <button
                className="px-4 py-2 bg-green-500 text-white font-bold rounded mb-4 hover:bg-green-600 transition-colors"
                onClick={() => setVisible((prev) => !prev)}
            >
                {visible ? "-" : "+"} Add to {tableName}
            </button>

            <div hidden={!visible}>
                <form action={action} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border bg-gray-800 rounded-lg">
                    {columns.map((col) => (
                        <div key={col.name} className="flex flex-col">
                            <label className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">
                                {col.name.replace(/_/g, " ")} {col.nullable ? "(Optional)" : "*"}
                            </label>
                            
                            <input
                                name={col.name}
                                type={getInputType(col.dataType)}
                                placeholder={`Enter ${col.name.toLowerCase()}`}
                                required={!col.nullable}
                                step={getInputType(col.dataType) === "number" ? "any" : undefined}
                                className="border border-gray-600 p-2 bg-gray-700 text-white rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    ))}
                    <div className="col-span-1 md:col-span-4 mt-2">
                        <button type="submit" className="bg-green-500 text-white p-2 rounded w-full md:w-auto hover:bg-green-600 transition-colors">
                            Submit Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}