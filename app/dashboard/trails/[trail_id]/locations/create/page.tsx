import Form from '@/app/ui/locations/create-form';
import Breadcrumbs from '@/app/ui/trails/breadcrumbs';
import { fetchTrailWithLocationsById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ trail_id: string }> }) {
    const params = await props.params;
    const trail_id = params.trail_id;
    const trail = await fetchTrailWithLocationsById(trail_id);

    if (!trail) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Locations', href: `/dashboard/trails/${trail_id}/locations` },
                    {
                        label: `Create Location for Trail: ${trail.name}`,
                        href: `/dashboard/trails/${trail_id}/locations/create`,
                        active: true,
                    }
                ]}
            />
            {/* This will be the form for creating a new location */}
            <Form trail={trail} />
        </main>
    );
}