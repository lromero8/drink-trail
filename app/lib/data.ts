import postgres from 'postgres';
import { Trail, TrailForm } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 6;

// Interface for the drink data returned from fetchDrinksByLocationId
export interface DrinkDisplay {
  id: string;
  location_id: string;
  type: string; // general category: beer, cocktail, soft-drink
  typeName: string; // specific type: Cola, Mojito, etc.
  size: string;
  isAlcoholic: boolean;
  created_at: string;
}



export interface TrailWithLocationNames extends Trail {
  location_names: string[];
}

export async function fetchTrailById(id: string) {
  try {
    const data = await sql<TrailForm[]>`
      SELECT
        trails.id,
        trails.name,
        trails.description
      FROM trails
      WHERE trails.id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch trail.');
  }
}

export async function fetchFilteredTrails(
  query: string,
  currentPage: number
): Promise<TrailWithLocationNames[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const trails = await sql`
      SELECT
        t.id,
        t.name,
        t.description,
        t.created_at,
        COALESCE(
          json_agg(l.name) FILTER (WHERE l.id IS NOT NULL), '[]'
        ) AS location_names
      FROM trails t
      LEFT JOIN locations l ON l.trail_id = t.id
      WHERE
        t.name ILIKE ${`%${query}%`} OR
        t.description ILIKE ${`%${query}%`} OR
        t.created_at::text ILIKE ${`%${query}%`}
      GROUP BY t.id, t.name, t.description, t.created_at
      ORDER BY t.created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    // Parse location_names from JSON for each trail
    return trails.map((trail: any) => ({
      ...trail,
      location_names: typeof trail.location_names === 'string' ? JSON.parse(trail.location_names) : trail.location_names,
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch trails.');
  }
}

export async function fetchTrailsPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM trails
    WHERE
      trails.name::text ILIKE ${`%${query}%`} OR
      trails.description::text ILIKE ${`%${query}%`} OR
      trails.created_at::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  }
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of trails.');
  }
}

export async function fetchLocationById(location_id: string) {
  try {
    const data = await sql`
      SELECT
        locations.id,
        locations.trail_id,
        locations.name,
        locations.created_at
      FROM locations
      WHERE locations.id = ${location_id};
    `;

    if (!data[0]) return null;
    return {
      id: data[0].id,
      trail_id: data[0].trail_id,
      name: data[0].name,
      created_at: data[0].created_at
    };
  }
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch location by ID.');
  }
}

export async function fetchDrinksByLocationId(location_id: string): Promise<DrinkDisplay[]> {
  try {
    // Direct query using the new flattened structure
    const data = await sql`
      SELECT
        id,
        location_id,
        category,
        specific_type,
        size,
        is_alcoholic,
        created_at
      FROM drinks
      WHERE location_id = ${location_id};
    `;

    // Log the first drink to see structure
    if (data.length > 0) {
      console.log('Sample drink data with new schema:', JSON.stringify(data[0], null, 2));
    }

    return data.map((drink: any) => {
      if (!drink) {
        console.error('Encountered null or undefined drink in result set');
        return {
          id: 'unknown',
          location_id: location_id,
          type: 'Unknown',
          typeName: 'Unknown',
          size: 'Unknown',
          isAlcoholic: false,
          created_at: new Date().toISOString().split('T')[0]
        };
      }

      // Much simpler mapping with the flattened structure
      return {
        id: drink.id,
        location_id: drink.location_id,
        type: drink.category,
        typeName: drink.specific_type,
        size: drink.size,
        isAlcoholic: drink.is_alcoholic,
        created_at: drink.created_at
      };
    });
  }
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch drinks by location ID.');
  } 
}

// Interface for location with its drinks
export interface LocationWithDrinks {
  id: string;
  trail_id: string;
  name: string;
  created_at: string;
  drinks: DrinkDisplay[];
}

// Fetch all locations with their drinks for a specific trail
export async function fetchLocationsWithDrinksByTrailId(trail_id: string): Promise<LocationWithDrinks[]> {
  try {
    // First, fetch all locations for the trail
    const locations = await sql`
      SELECT id, trail_id, name, created_at
      FROM locations
      WHERE trail_id = ${trail_id}
      ORDER BY name
    `;
    
    // For each location, fetch its drinks
    const locationsWithDrinks = await Promise.all(
      locations.map(async (location: any) => {
        const drinks = await fetchDrinksByLocationId(location.id);
        return {
          id: location.id,
          trail_id: location.trail_id,
          name: location.name,
          created_at: location.created_at,
          drinks
        };
      })
    );
    
    return locationsWithDrinks;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch locations with drinks.');
  }
}