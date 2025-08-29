
import { fetchTrailsCountForUser, fetchLocationsCountForUser, fetchDrinksCountForUser } from '../../lib/data';
import { MapIcon, MapPinIcon, FaceFrownIcon, FaceSmileIcon } from '@heroicons/react/24/outline';

export default async function Page() {
    const [trailsCount, locationsCount, drinksCount] = await Promise.all([
        fetchTrailsCountForUser(),
        fetchLocationsCountForUser(),
        fetchDrinksCountForUser()
    ]);

    return (
        <main>
            <h1 className='mb-4 text-xl md:text-2xl'>Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="rounded-xl bg-orange-500 p-8 md:p-12 flex flex-col items-center shadow-lg min-h-[200px]">
                    <MapIcon className="h-12 w-12 text-white mb-4" />
                    <span className="text-5xl font-extrabold text-white">{trailsCount}</span>
                    <span className="mt-4 text-lg font-semibold text-white">Total Trails</span>
                </div>
                <div className="rounded-xl bg-orange-500 p-8 md:p-12 flex flex-col items-center shadow-lg min-h-[200px]">
                    <MapPinIcon className="h-12 w-12 text-white mb-4" />
                    <span className="text-5xl font-extrabold text-white">{locationsCount}</span>
                    <span className="mt-4 text-lg font-semibold text-white">Total Locations</span>
                </div>
                <div className="rounded-xl bg-orange-500 p-8 md:p-12 flex flex-col items-center shadow-lg min-h-[200px]">
                    <FaceFrownIcon className="h-12 w-12 text-white mb-4" />
                    <span className="text-5xl font-extrabold text-white">{drinksCount.alcoholic}</span>
                    <span className="mt-4 text-lg font-semibold text-white">Alcoholic Drinks</span>
                </div>
                <div className="rounded-xl bg-orange-500 p-8 md:p-12 flex flex-col items-center shadow-lg min-h-[200px]">
                    <FaceSmileIcon className="h-12 w-12 text-white mb-4" />
                    <span className="text-5xl font-extrabold text-white">{drinksCount.nonAlcoholic}</span>
                    <span className="mt-4 text-lg font-semibold text-white">Non-Alcoholic Drinks</span>
                </div>
            </div>
        </main>
    );
}