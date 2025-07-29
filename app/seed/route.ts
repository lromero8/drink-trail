import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}


async function createSchema() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  // Trails table
  await sql`
    CREATE TABLE IF NOT EXISTS trails (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL
    );
  `;

  // Locations table
  await sql`
    CREATE TABLE IF NOT EXISTS locations (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      trail_id UUID NOT NULL REFERENCES trails(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL
    );
  `;

  // Drinks table
  await sql`
    CREATE TABLE IF NOT EXISTS drinks (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
      drink_type JSONB NOT NULL,
      size VARCHAR(10) NOT NULL,
      type VARCHAR(50) NOT NULL,
      is_alcoholic BOOLEAN NOT NULL,
      beer_type VARCHAR(50),
      cocktail_type VARCHAR(50),
      soft_drink_type VARCHAR(50)
    );
  `;
}

export async function GET() {
  try {
    await sql.begin(async () => {
      await seedUsers();
      await createSchema();
    });
    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
