import Form from '@/app/ui/trails/create-form';
import Breadcrumbs from '@/app/ui/trails/breadcrumbs';

export default async function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Trails', href: '/dashboard/trails' },
                    {
                        label: 'Create Trail',
                        href: '/dashboard/trails/create',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    );
}