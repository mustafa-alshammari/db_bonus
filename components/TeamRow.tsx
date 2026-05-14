'use client';

import { fetchSubclassData, updateTeam } from '@/app/team/actions';
import { useEffect, useState } from 'react';
import ModifyEntry from './ModifyEntry';

export default function TeamRow({ team, deleteAction, colData, updateAction }: { team: any, deleteAction: any, colData: any, updateAction: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [subclassData, setSubclassData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleExpandClick = async () => {
    if (!isExpanded && !subclassData) {
      setIsLoading(true);
      try {
        const data = await fetchSubclassData(team.TEAM_ID, team.TEAM_TYPE);
        setSubclassData(data);
      } catch (error) {
        console.error("Failed to fetch subclass data", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    setIsExpanded(prev => !prev);
  };

  return (
    <>
      <tr className="border-b hover:bg-gray-700 transition-colors">
        <td className="p-2">{team.TEAM_ID}</td>
        <td className="p-2">{team.NAME}</td>
        <td className="p-2">{team.TEAM_TYPE}</td>
        <td className="p-2">{team.MEMBER_COUNT}</td>
        <td className="p-2">{team.EMAIL}</td>
        <td className="p-2 flex gap-2">
          {/* Toggle Button */}
          <button 
            onClick={handleExpandClick}
            className="bg-blue-500 text-white px-2 py-1 text-sm rounded"
          >
            {isExpanded ? 'Hide Details' : 'View Details'}
          </button>

          <form action={deleteAction}>
            <button type="submit" className="bg-red-500 text-white px-2 py-1 text-sm rounded">Delete</button>
          </form>

          <ModifyEntry columns={colData} rowData={team} updateAction={updateAction} />
        </td>
      </tr>

      {/* Subclass Information Row */}
      {isExpanded && (
        <tr className="bg-gray-900 border-b">
          <td colSpan={6} className="p-4">
            <div className="text-sm text-gray-300">
              <h4 className="font-bold text-white mb-2">{team.TEAM_TYPE} Details:</h4>
              
                {isLoading ? (
                    <p className="animate-pulse">Loading data from database...</p>
                ) : subclassData ? (
                    <div>
                    {team.TEAM_TYPE === 'Safety' && (
                        <p>Location: <span className="text-white">{subclassData.LOCATION}</span></p>
                    )}
                    </div>
                ) : (
                    <p>No extra details found for this team.</p>
                )}

            </div>
          </td>
        </tr>
      )}
    </>
  );
}