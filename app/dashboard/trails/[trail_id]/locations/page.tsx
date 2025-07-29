import { Metadata } from 'next';
import { fetchTrailWithLocationsById } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/trails/breadcrumbs';
import { CreateLocation } from '@/app/ui/locations/buttons';
 
export const metadata: Metadata = {
  title: 'Locations',
};

export default async function Page(props: { params: Promise<{ trail_id: string }> }) {

    const params = await props.params;
    const trail_id = params.trail_id;
    const trail = await fetchTrailWithLocationsById(trail_id);
    
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Trails', href: '/dashboard/trails' },
                    { label: 'Locations', href: `/dashboard/trails/${trail_id}/locations`, active: true }
                ]}
            />

            <div className="flex items-center justify-end mb-4">
                <CreateLocation trail_id={trail_id} />
            </div>

            <div className="w-full">
                {trail?.location_names.map(location_name => (
                    <div key={location_name}></div>
                ))}
            </div>
        </main>
    );
}