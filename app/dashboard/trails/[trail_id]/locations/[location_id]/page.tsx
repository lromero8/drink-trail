// import Form from '@/app/ui/trails/add-location-form';
import Breadcrumbs from '@/app/ui/trails/breadcrumbs';
import { fetchTrailById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const trail = await fetchTrailById(id);

    if (!trail) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Trails', href: '/dashboard/trails' },
                    {
                        label: 'Add New Drinking Location',
                        href: `/dashboard/trails/${id}/locations`,
                        active: true,
                    }
                ]}
            />
            {/* This will be the form for adding a new location */}
            {/* <Form trail={trail} /> */}
        </main>
    );
}