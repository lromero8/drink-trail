import { fetchLocationsWithDrinksByTrailId } from '@/app/lib/data';
import EmptyLocationsState from './empty-locations-state';
import LocationTimeline from './location-timeline';

export default async function LocationsList({
    trail_id,
}: {
    trail_id: string;
}) {
    // Fetch all locations with their drinks for this trail
    const locations = await fetchLocationsWithDrinksByTrailId(trail_id);
    
    if (locations.length === 0) {
        return <EmptyLocationsState />;
    }
    
    return <LocationTimeline locations={locations} trail_id={trail_id} />;
}
