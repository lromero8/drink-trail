// import Form from '@/app/ui/trails/add-location-form';
import Breadcrumbs from '@/app/ui/trails/breadcrumbs';
import { fetchTrailById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

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
                    { label: 'Trails', href: `/dashboard/trails/` },
                    {
                        label: `${trail.name}`,
                        href: `/dashboard/trails/${trail_id}/locations`,
                        active: true,
                    }
                ]}
            />
            {/* Here I will show the list of locations the user has visited */}
            {/* Also I will show the button to create a new location */}
            <h1>{trail.name} - Locations</h1>
        </main>
    );
}