import { LocationWithDrinks } from '@/app/lib/data';
import TimelineLocationItem from './timeline-location-item';

interface LocationTimelineProps {
    locations: LocationWithDrinks[];
    trail_id: string;
}

export default function LocationTimeline({ locations, trail_id }: LocationTimelineProps) {
    return (
        <div className="relative min-h-[200px] px-4">

            <div className="mb-6">
                <h1 className='text-xl font-semibold'>Locations timeline</h1>
            </div>

            {/* Vertical Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
            
            <div className="space-y-12 py-6">
                {locations.map((location, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <TimelineLocationItem 
                            key={location.id}
                            location={location}
                            isEven={isEven}
                            trail_id={trail_id}
                        />
                    );
                })}
            </div>
        </div>
    );
}
