import { Metadata } from 'next';
import Link from 'next/link';
import { fetchTrailById, fetchLocationsWithDrinksByTrailId } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/trails/breadcrumbs';
import { CreateLocation } from '@/app/ui/locations/buttons';
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
    
    // Fetch all locations with their drinks for this trail
    const locationsWithDrinks = await fetchLocationsWithDrinksByTrailId(trail_id);
    
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

            <div className="flex items-center justify-end mb-4">
                <CreateLocation trail_id={trail_id} />
            </div>

            {locationsWithDrinks.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-6 text-center">
                    <h2 className="text-xl font-semibold mb-1">No locations yet</h2>
                    <p className="text-gray-500 mb-4">Add your first location to start creating your drink trail.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {locationsWithDrinks.map((location) => (
                        <Link 
                            href={`/dashboard/trails/${trail_id}/locations/${location.id}`}
                            key={location.id}
                            className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h2 className="text-xl font-semibold mb-2">{location.name}</h2>
                            <p className="text-xs text-gray-500 mb-2">Visited on {new Date(location.created_at).toLocaleDateString()}</p>
                            <div className="border-t border-gray-100 pt-2 mt-2">
                                <p className="text-gray-500 mb-1">
                                    {location.drinks.length} {location.drinks.length === 1 ? 'drink' : 'drinks'} available
                                </p>
                                {location.drinks.length > 0 && (
                                    <div className="mt-3">
                                        <h3 className="text-sm font-medium text-gray-600 mb-1">Available drinks:</h3>
                                        <ul className="text-sm text-gray-500 list-disc pl-5">
                                            {location.drinks.slice(0, 3).map((drink) => (
                                                <li key={drink.id}>
                                                    {drink.typeName} ({drink.size})
                                                    {drink.isAlcoholic && <span className="text-amber-600"> • Alcoholic</span>}
                                                </li>
                                            ))}
                                            {location.drinks.length > 3 && (
                                                <li className="text-blue-500">
                                                    +{location.drinks.length - 3} more...
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}