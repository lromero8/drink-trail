import Breadcrumbs from '@/app/ui/trails/breadcrumbs';
import { notFound } from 'next/dist/client/components/navigation';
import { fetchTrailWithLocationsById } from '@/app/lib/data';

export default async function Page(props: { params: Promise<{ trail_id: string; location_id: string }> }) {
    const params = await props.params;
    const trail_id = params.trail_id;
    const location_id = params.location_id;
    const trail = await fetchTrailWithLocationsById(trail_id);

    if (!trail) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Trails', href: '/dashboard/trails' },
                    { label: 'Locations', href: `/dashboard/trails/${trail_id}/locations` },
                    {
                        label: 'Add drinks in Location',
                        href: `/dashboard/trails/${trail_id}/locations/${location_id}/add-drinks`,
                        active: true,
                    }
                ]}
            />
            {/* This will be the form for adding a new drinks to a location */}
            {/* <Form trail={trail} /> */}
        </main>
    );
}