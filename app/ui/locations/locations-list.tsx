import Link from 'next/link';
import { fetchLocationsWithDrinksByTrailId } from '@/app/lib/data';
import { formatDateTimeToLocal } from '@/app/lib/utils';

export default async function LocationsList({
    trail_id,
}: {
    trail_id: string;
}) {
    // Fetch all locations with their drinks for this trail
    const locations = await fetchLocationsWithDrinksByTrailId(trail_id);
    return (
        <>
            {locations.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-6 text-center">
                    <h2 className="text-xl font-semibold mb-1">No locations yet</h2>
                    <p className="text-gray-500 mb-4">Add your first location to start creating your drink trail.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {locations.map((location) => (
                        <Link
                            href={`/dashboard/trails/${trail_id}/locations/${location.id}`}
                            key={location.id}
                            className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h2 className="text-xl font-semibold mb-2">{location.name}</h2>
                            <p className="text-xs text-gray-500 mb-2">
                                Visited on {formatDateTimeToLocal(location.created_at)}
                            </p>
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
        </>
    );
}
