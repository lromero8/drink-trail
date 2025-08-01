import Breadcrumbs from "@/app/ui/trails/breadcrumbs";
import { fetchDrinksByLocationId } from "@/app/lib/data";
import Form from '@/app/ui/drinks/create-form';


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
                        href: `/dashboard/trails/${trail_id}/locations/${location_id}`,
                        active: true,
                    }
                ]}
            />
            <Form trail_id={trail_id} location_id={location_id} />

            {/* Display drinks in a location with detailed information */}
            <h1>Drinks in Location</h1>
            <div className="mt-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Size
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Alcoholic
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {drinks.map(drink => (
                            <tr key={drink.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {drink.typeName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {drink.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {drink.size}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {drink.isAlcoholic ? 'Yes' : 'No'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}