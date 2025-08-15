import { formatDateTimeToLocal } from '@/app/lib/utils';
import Link from 'next/link';
import { LocationWithDrinks } from '@/app/lib/data';

interface TimelineLocationItemProps {
    location: LocationWithDrinks;
    isEven: boolean;
    trail_id: string;
}

export default function TimelineLocationItem({ location, isEven, trail_id }: TimelineLocationItemProps) {
    return (
        <div className="relative py-4">
            {/* Timeline Circle */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-7 w-5 h-5 rounded-full bg-orange-500 border-2 border-white z-10"></div>
            
            {/* Date on opposite side of content */}
            <div className={`
                absolute top-6 text-xs font-medium text-gray-600 whitespace-nowrap z-10
                ${isEven 
                    ? 'left-[calc(50%+15px)]' /* Date on right side when location is on left */
                    : 'right-[calc(50%+15px)] text-right' /* Date on left side when location is on right */
                }
            `}>
                {formatDateTimeToLocal(location.created_at)}
            </div>
            
            {/* Location Content Box */}
            <Link
                href={`/dashboard/trails/${trail_id}/locations/${location.id}`}
                className={`
                    block rounded-lg border border-gray-200 bg-white p-6 shadow-sm 
                    hover:shadow-md transition-shadow relative z-0
                    ${isEven 
                        ? 'w-[calc(50%-20px)] mr-auto ml-0' /* Location on left side (first) */
                        : 'w-[calc(50%-20px)] ml-auto mr-0' /* Location on right side (second) */
                    }
                `}
            >
                <h2 className="text-xl font-semibold mb-2">{location.name}</h2>
                
                <div className="border-t border-gray-100 pt-2 mt-2">
                    <p className="text-gray-500 mb-1">
                        {location.drinks.length} {location.drinks.length === 1 ? 'drink' : 'drinks'} available
                    </p>
                    {location.drinks.length > 0 && (
                        <div className="mt-3">
                            <h3 className="text-sm font-medium text-gray-600 mb-1">Available drinks:</h3>
                            <ul className="text-sm text-gray-500 list-disc pl-5">
                                {location.drinks.slice(0, 3).map(drink => (
                                    <li key={drink.id}>
                                        {drink.typeName} ({drink.size})
                                        {drink.isAlcoholic && <span className="text-amber-600"> • Alcoholic</span>}
                                    </li>
                                ))}
                                {location.drinks.length > 3 && (
                                    <li className="text-orange-500">
                                        +{location.drinks.length - 3} more...
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
}
