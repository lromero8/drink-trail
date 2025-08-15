import Link from 'next/link';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteTrail } from '@/app/lib/actions';

export function CreateTrail() {
  return (
    <Link
      href="/dashboard/trails/create"
      className="flex h-10 items-center rounded-lg bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
    >
      <span className="hidden md:block">Create Trail</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateTrail({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/trails/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteTrail({ id }: { id: string }) {
  const deleteTrailWithId = deleteTrail.bind(null, id);

  return (
    <form action={deleteTrailWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}