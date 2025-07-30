import Form from '@/app/ui/trails/edit-form';
import Breadcrumbs from '@/app/ui/trails/breadcrumbs';
import { notFound } from 'next/navigation';
import { fetchTrailById } from '@/app/lib/data';

export default async function Page(props: { params: Promise<{ trail_id: string }> }) {
    const params = await props.params;
    const id = params.trail_id;
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
                        label: 'Edit Trail',
                        href: `/dashboard/trails/${id}/edit`,
                        active: true,
                    }
                ]}
            />
            <Form trail={trail} />
        </main>
    );
}