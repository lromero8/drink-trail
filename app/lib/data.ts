import postgres from 'postgres';
import { Trail, TrailForm } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 6;



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

export interface TrailWithLocationsAndDrinks extends Trail {
  location_names: string[];
  drink_names: string[];
}

export async function fetchTrailWithLocationsById(trail_id: string): Promise<TrailWithLocationsAndDrinks | null> {
  try {
    const result = await sql`
      SELECT
        t.id,
        t.name,
        t.description,
        t.created_at,
        COALESCE(json_agg(DISTINCT l.name) FILTER (WHERE l.id IS NOT NULL), '[]') AS location_names,
        COALESCE(json_agg(DISTINCT d.drink_type->>'name') FILTER (WHERE d.id IS NOT NULL), '[]') AS drink_names
      FROM trails t
      LEFT JOIN locations l ON l.trail_id = t.id
      LEFT JOIN drinks d ON d.location_id = l.id
      WHERE t.id = ${trail_id}
      GROUP BY t.id, t.name, t.description, t.created_at
    `;

    if (!result[0]) return null;
    const trail = result[0];
    return {
      id: trail.id,
      name: trail.name,
      description: trail.description,
      created_at: trail.created_at,
      location_names: typeof trail.location_names === 'string' ? JSON.parse(trail.location_names) : trail.location_names,
      drink_names: typeof trail.drink_names === 'string' ? JSON.parse(trail.drink_names) : trail.drink_names,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch trail by ID.');
  }
}