import { Metadata } from 'next';
import { fetchTrailById } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/trails/breadcrumbs';
import Form from '@/app/ui/locations/create-form';
import LocationsList from '@/app/ui/locations/locations-list';
import { notFound } from 'next/navigation';
 
export const metadata: Metadata = {
  title: 'Locations',
};

export default async function Page(props: { params: Promise<{ trail_id: string }> }) {
    const params = await props.params;
    const trail_id = params.trail_id;
    const trail = await fetchTrailById(trail_id);

    if (!trail) {
        notFound();
    }
    
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Trails', href: '/dashboard/trails' },
                    { label: 'Locations', href: `/dashboard/trails/${trail_id}/locations`, active: true }
                ]}
            />

            <div className="mt-4 mb-8">
                <h1 className="text-2xl font-bold">{trail.name}</h1>
                <p className="text-gray-500">{trail.description}</p>
            </div>

            <div className='mb-8'>
                <Form trail_id={trail_id} />
            </div>

            <LocationsList trail_id={trail_id} />
        </main>
    );
}