'use client';

import { useActionState, useState, useEffect } from 'react';
import { createDrink, DrinkState } from '@/app/lib/actions';
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
  // Simple state for the form
  const initialState: DrinkState = { 
    message: null, 
    errors: {
      size: undefined,
      category: undefined,
      specific_type: undefined,
      beerType: undefined,
      cocktailType: undefined,
      softDrinkType: undefined
    } 
  };
  
  const [state, formAction] = useActionState(createDrink, initialState);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [specificType, setSpecificType] = useState<string>("");
  const [isAlcoholic, setIsAlcoholic] = useState<boolean>(true);
  
  // Soft drinks are never alcoholic
  const isSoftDrink = selectedCategory === 'soft-drink';
  
  // Clear form on successful submission
  useEffect(() => {
    if (state.message && !state.message.includes('Failed')) {
      // Form was successfully submitted, reset the form
      setSelectedCategory("");
      setSelectedSize("");
      setSpecificType("");
      setIsAlcoholic(true);
    }
  }, [state.message]);
  
  // When category changes, reset the specific type
  useEffect(() => {
    setSpecificType("");
  }, [selectedCategory]);

  return (
    <form action={formAction}>
      <input type="hidden" name="trail_id" value={trail_id} />
      <input type="hidden" name="location_id" value={location_id} />
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Drink category */}
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Category *
          </label>
          <select
            id="category"
            name="category"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            aria-describedby="category-error"
            required
          >
            <option value="">Select category</option>
            {DRINK_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div id="category-error" aria-live="polite" aria-atomic="true">
            {state.errors?.category &&
              state.errors.category.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Specific type selector - changes based on category */}
        {selectedCategory && (
          <div className="mb-4">
            <label htmlFor="specific-type" className="mb-2 block text-sm font-medium">
              {selectedCategory === 'beer' 
                ? 'Beer Type *' 
                : selectedCategory === 'cocktail' 
                  ? 'Cocktail Type *' 
                  : 'Soft Drink Type *'
              }
            </label>
            <select
              id="specific-type"
              name={selectedCategory === 'beer' 
                ? 'beerType' 
                : selectedCategory === 'cocktail' 
                  ? 'cocktailType' 
                  : 'softDrinkType'
              }
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
              value={specificType}
              onChange={e => setSpecificType(e.target.value)}
              aria-describedby="specific-type-error"
              required
            >
              <option value="">
                {selectedCategory === 'beer'
                  ? 'Select beer type'
                  : selectedCategory === 'cocktail'
                    ? 'Select cocktail type'
                    : 'Select soft drink type'
                }
              </option>
              {selectedCategory === 'beer' && BEER_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
              {selectedCategory === 'cocktail' && COCKTAIL_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
              {selectedCategory === 'soft-drink' && SOFTDRINK_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div id="specific-type-error" aria-live="polite" aria-atomic="true">
              {state.errors?.[
                selectedCategory === 'beer' 
                  ? 'beerType' 
                  : selectedCategory === 'cocktail' 
                    ? 'cocktailType' 
                    : 'softDrinkType'
              ]?.map((error: string) => (
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
            Size *
          </label>
          <select
            id="size"
            name="size"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
            value={selectedSize}
            onChange={e => setSelectedSize(e.target.value)}
            aria-describedby="size-error"
            required
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

        {/* Is Alcoholic - automatically disabled for soft drinks */}
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

        {/* Form submission message */}
        <div aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className={`mt-2 text-sm ${state.message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
              {state.message}
            </p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button type="submit">Add Drink</Button>
      </div>
    </form>
  );
}
