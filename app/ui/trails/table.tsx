import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredTrails } from '@/app/lib/data';
import { DeleteTrail, UpdateTrail } from '@/app/ui/trails/buttons';
import Link from 'next/link';

export default async function TrailsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const trails = await fetchFilteredTrails(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {trails?.map((trail) => (
              <div
                key={trail.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <Link 
                    href={`/dashboard/trails/${trail.id}/locations`}
                    className="w-full cursor-pointer"
                  >
                    <div>
                      <div className="mb-2 flex items-center">
                        <p>{trail.name}</p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <Link 
                    href={`/dashboard/trails/${trail.id}/locations`}
                    className="flex-grow cursor-pointer"
                  >
                    <div>
                      <p className="text-xl font-medium">
                        {trail.description}
                      </p>
                      <p>
                        {trail.location_names.length > 0
                          ? `Locations: ${trail.location_names.join(', ')}`
                          : 'No locations available'}
                      </p>
                      <p>{formatDateToLocal(trail.created_at)}</p>
                    </div>
                  </Link>
                  <div className="flex justify-end gap-2">
                    <UpdateTrail id={trail.id} />
                    <DeleteTrail id={trail.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Trail name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Locations visited
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {trails?.map((trail) => (
                <tr
                  key={trail.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:bg-gray-50 group"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <Link href={`/dashboard/trails/${trail.id}/locations`} className="block w-full h-full">
                      <div className="flex items-center gap-3">
                        <p>{trail.name}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link href={`/dashboard/trails/${trail.id}/locations`} className="block w-full h-full">
                      {trail.description}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link href={`/dashboard/trails/${trail.id}/locations`} className="block w-full h-full">
                      {trail.location_names.length > 0
                        ? trail.location_names.join(', ')
                        : 'No locations available'}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link href={`/dashboard/trails/${trail.id}/locations`} className="block w-full h-full">
                      {formatDateToLocal(trail.created_at)}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateTrail id={trail.id} />
                      <DeleteTrail id={trail.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
