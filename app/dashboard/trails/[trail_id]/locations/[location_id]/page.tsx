import Breadcrumbs from "@/app/ui/trails/breadcrumbs";
import Form from '@/app/ui/drinks/create-form';
import DrinksTable from '@/app/ui/drinks/drinks-table';
import BackToLocationsButton from '@/app/ui/drinks/buttons';


export default async function Page(props: { params: Promise<{ trail_id: string; location_id: string }> }) {
    const params = await props.params;
    const trail_id = params.trail_id;
    const location_id = params.location_id;

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Trails', href: '/dashboard/trails' },
                    { label: 'Locations', href: `/dashboard/trails/${trail_id}/locations` },
                    {
                        label: 'Drinks in Location',
                        href: `/dashboard/trails/${trail_id}/locations/${location_id}`,
                        active: true,
                    }
                ]}
            />
            <Form trail_id={trail_id} location_id={location_id} />

            <DrinksTable location_id={location_id} />
            
            <BackToLocationsButton trail_id={trail_id} />
        </main>
    );
}