import { Metadata } from 'next';
import { CreateTrail } from '@/app/ui/trails/buttons';
import { fetchTrailsPages } from '@/app/lib/data';
import { TrailsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import Table from '@/app/ui/trails/table';
import Search from '@/app/ui/search';
 
export const metadata: Metadata = {
  title: 'Trails',
};

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchTrailsPages(query);
    
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`text-2xl`}>Trails</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search trails..." />
                <CreateTrail />
            </div>
            <Suspense key={query + currentPage} fallback={<TrailsTableSkeleton />}>
                <Table query={query} currentPage={currentPage} />
            </Suspense>
            {/* <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div> */}
        </div>
    );
}