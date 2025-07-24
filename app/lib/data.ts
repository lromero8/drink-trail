import postgres from 'postgres';
import { Trail } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredTrails(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const trails = await sql<Trail[]>`
      SELECT
        trails.id,
        trails.name,
        trails.description,
        trails.locations,
        trails.created_at
      FROM trails
      WHERE
        trails.name ILIKE ${`%${query}%`} OR
        trails.description ILIKE ${`%${query}%`} OR
        trails.created_at::text ILIKE ${`%${query}%`}
      ORDER BY trails.created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return trails;
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
        trails.locations,
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