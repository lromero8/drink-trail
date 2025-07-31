'use client';

import { useActionState, useState } from 'react';
import { createDrink, DrinkState } from '@/app/lib/actions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { BeerType, CocktailType, DrinkSize, SoftDrinkType } from '@/app/lib/definitions';

const DRINK_SIZES: DrinkSize[] = ['0.2L', '0.33L', '0.5L', '1L'];
const DRINK_TYPES = ['beer', 'cocktail', 'soft-drink'];
const BEER_TYPES: BeerType[] = [
  'Agustiner',
  'Berliner Kindl',
  'Bitburger',
  'Kölsch',
  'Erdinger',
  'Franziskaner',
  'Krombacher',
  'Paulaner',
  'Warsteiner',
];
const COCKTAIL_TYPES: CocktailType[] = [
  'Mojito',
  'Margarita',
  'Aperol Spritz',
  'Limoncello Spritz',
  'Pina Colada',
  'Cosmopolitan',
  'Old Fashioned',
  'Negroni',
];
const SOFTDRINK_TYPES: SoftDrinkType[] = [
  'Cola',
  'Sprite',
  'Orange Juice',
  'Apple Juice',
];

interface FormProps {
  trail_id: string;
  location_id: string;
}

export default function Form({ trail_id, location_id }: FormProps) {
  const initialState: DrinkState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createDrink, initialState);
  const [selectedType, setSelectedType] = useState<string>("");
  const [isAlcoholic, setIsAlcoholic] = useState<boolean>(true);

  // If soft-drink is selected, always uncheck and disable isAlcoholic
  const isSoftDrink = selectedType === 'soft-drink';
  return (
    <form action={formAction}>
      <input type="hidden" name="trail_id" value={trail_id} />
      <input type="hidden" name="location_id" value={location_id} />
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Drink type */}
        <div className="mb-4">
          <label htmlFor="type" className="mb-2 block text-sm font-medium">
            Type
          </label>
          <select
            id="type"
            name="type"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            aria-describedby="type-error"
          >
            <option value="">Select type</option>
            {DRINK_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div id="type-error" aria-live="polite" aria-atomic="true">
            {state.errors?.type &&
              state.errors.type.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Conditionally show type-specific dropdown */}
        {selectedType === 'beer' && (
          <div className="mb-4">
            <label htmlFor="beerType" className="mb-2 block text-sm font-medium">
              Beer Type
            </label>
            <select
              id="beerType"
              name="beerType"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
              defaultValue=""
              aria-describedby="beerType-error"
            >
              <option value="">Select beer type</option>
              {BEER_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div id="beerType-error" aria-live="polite" aria-atomic="true">
              {state.errors?.beerType &&
                state.errors.beerType.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        )}
        {selectedType === 'cocktail' && (
          <div className="mb-4">
            <label htmlFor="cocktailType" className="mb-2 block text-sm font-medium">
              Cocktail Type
            </label>
            <select
              id="cocktailType"
              name="cocktailType"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
              defaultValue=""
              aria-describedby="cocktailType-error"
            >
              <option value="">Select cocktail type</option>
              {COCKTAIL_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div id="cocktailType-error" aria-live="polite" aria-atomic="true">
              {state.errors?.cocktailType &&
                state.errors.cocktailType.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        )}

        {selectedType === 'soft-drink' && (
          <div className="mb-4">
            <label htmlFor="softDrinkType" className="mb-2 block text-sm font-medium">
              Soft Drink Type
            </label>
            <select
              id="softDrinkType"
              name="softDrinkType"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
              defaultValue=""
              aria-describedby="softDrinkType-error"
            >
              <option value="">Select soft drink type</option>
              {SOFTDRINK_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div id="softDrinkType-error" aria-live="polite" aria-atomic="true">
              {state.errors?.softDrinkType &&
                state.errors.softDrinkType.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        )}

        {/* Drink size */}
        <div className="mb-4">
          <label htmlFor="size" className="mb-2 block text-sm font-medium">
            Size
          </label>
          <select
            id="size"
            name="size"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
            defaultValue=""
            aria-describedby="size-error"
          >
            <option value="">Select size</option>
            {DRINK_SIZES.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <div id="size-error" aria-live="polite" aria-atomic="true">
            {state.errors?.size &&
              state.errors.size.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Is Alcoholic */}
        <div className="mb-4 flex items-center">
          <input
            id="isAlcoholic"
            name="isAlcoholic"
            type="checkbox"
            checked={isSoftDrink ? false : isAlcoholic}
            disabled={isSoftDrink}
            onChange={e => setIsAlcoholic(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isAlcoholic" className="text-sm font-medium">
            Alcoholic
          </label>
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
        <Button type="submit">Create Drink</Button>
      </div>
    </form>
  );
}
