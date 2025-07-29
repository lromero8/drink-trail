import postgres from 'postgres';
import { Trail } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 6;



export interface TrailWithLocationNames extends Trail {
  location_names: string[];
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

export async function fetchTrailById(trail_id: string) {
  try {
    const trail = await sql<Trail[]>`
      SELECT
        trails.id,
        trails.name,
        trails.description,
        trails.created_at
      FROM trails
      WHERE trails.id = ${trail_id}
    `;

    return trail[0] || null;
  }
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch trail by ID.');
  }
}