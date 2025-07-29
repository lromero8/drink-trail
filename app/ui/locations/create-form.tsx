'use client';

import { useActionState } from 'react';
import { createLocation, LocationState } from '@/app/lib/actions';
import Link from 'next/link';
import {
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { TrailWithLocationsAndDrinks } from '@/app/lib/data';

interface FormProps {
  trail: TrailWithLocationsAndDrinks;
}

export default function Form({ trail }: FormProps) {
  const initialState: LocationState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createLocation, initialState);
  return (
    <form action={formAction}>
      <input type="hidden" name="trail_id" value={trail.id} />
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Location name */}
        <div className="mb-4">
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Location name
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter location name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="name-error"
            />
            <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state.errors?.name &&
            state.errors.name.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true">
        {state.errors &&
          <p className="mt-2 text-sm text-red-500">
            {state.message}
          </p>
        }
      </div>
    </div>
    <div className="mt-6 flex justify-end gap-4">
      <Link
        href="/dashboard/trails"
        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
      >
        Cancel
      </Link>
      <Button type="submit">Create Location</Button>
    </div>
    </form>
  );
}
