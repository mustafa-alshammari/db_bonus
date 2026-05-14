'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function Search({ defaultSearch }: { defaultSearch: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="mb-8">
      <input
        type="text"
        defaultValue={defaultSearch}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by name..."
        className="border p-2 w-full max-w-md bg-gray-800 text-white"
      />
      {isPending && <span className="ml-4 text-sm text-gray-400">Updating...</span>}
    </div>
  );
}