import Breadcrumbs from "@/app/ui/trails/breadcrumbs";
import { fetchDrinksByLocationId } from "@/app/lib/data";


export default async function Page(props: { params: Promise<{ trail_id: string; location_id: string }> }) {
    const params = await props.params;
    const trail_id = params.trail_id;
    const location_id = params.location_id;
    const drinks = await fetchDrinksByLocationId(location_id);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Trails', href: '/dashboard/trails' },
                    { label: 'Locations', href: `/dashboard/trails/${trail_id}/locations` },
                    {
                        label: 'Drinks in Location',
                        href: `/dashboard/trails/${trail_id}/locations/${location_id}/`,
                        active: true,
                    }
                ]}
            />
            {/* This will be the drinks drank in a location */}
            <h1>Drinks in Location</h1>
            <ul>
                {drinks.map(drink => (
                    <li key={drink.id}>
                        - {drink.type} - {drink.size}
                    </li>
                ))}
            </ul>
        </main>
    );
}