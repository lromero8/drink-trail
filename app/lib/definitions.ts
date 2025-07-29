export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

// Lookup tables
const BEER_ALCOHOL_PERCENTAGE: Record<BeerType, number> = {
  'Agustiner': 0.052,
  'Berliner Kindl': 0.05,
  'Bitburger': 0.048,
  'Kölsch': 0.048,
  'Erdinger': 0.055,
  'Franziskaner': 0.054,
  'Krombacher': 0.049,
  'Paulaner': 0.051,
  'Warsteiner': 0.049,
};

const COCKTAIL_ALCOHOL_PERCENTAGE: Record<CocktailType, number> = {
  'Mojito': 0.13,
  'Margarita': 0.15,
  'Aperol Spritz': 0.11,
  'Limoncello Spritz': 0.12,
  'Pina Colada': 0.17,
  'Cosmopolitan': 0.2,
  'Old Fashioned': 0.32,
  'Negroni': 0.24,
};

type DrinkSize = '0.2L' | '0.33L' | '0.5L' | '1L';

interface BaseDrink {
  id: string;
  size: DrinkSize;
  type: string; // discriminant
  isAlcoholic: boolean;
}

type BeerType = 'Agustiner' | 'Berliner Kindl' | 'Bitburger' | 'Kölsch' | 'Erdinger' | 'Franziskaner' | 'Krombacher' | 'Paulaner' | 'Warsteiner';
interface Beer extends BaseDrink {
  type: 'beer';
  beerType: BeerType;
}

type CocktailType = 'Mojito' | 'Margarita' | 'Aperol Spritz' | 'Limoncello Spritz' | 'Pina Colada' | 'Cosmopolitan' | 'Old Fashioned' | 'Negroni';
interface Cocktail extends BaseDrink {
  type: 'cocktail';
  cocktailType: CocktailType;
}

type SoftDrinkType = 'Cola' | 'Sprite' | 'Orange Juice' | 'Apple Juice';
interface SoftDrink extends BaseDrink {
  type: 'soft-drink';
  isAlcoholic: false;
  softDrinkType: SoftDrinkType;
}

export type DrinkType = Beer | Cocktail | SoftDrink;

export interface Drink {
  id: string;
  location_id: string;
  drink_type: DrinkType;
}

export interface Location {
  id: string;
  trail_id: string;
  name: string;
}

export interface Trail {
  id: string;
  name: string;
  description: string;
  created_at: string;
}
