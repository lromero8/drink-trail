import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function BackToLocationsButton({ trail_id }: { trail_id: string }) {
  return (
    <div className="mt-6">
      <Link
        href={`/dashboard/trails/${trail_id}/locations`}
        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition-colors inline-flex items-center"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to Locations
      </Link>
    </div>
  );
}
