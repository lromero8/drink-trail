'use server'

import { signIn } from '../../auth';
import { AuthError } from 'next-auth';
import postgres from 'postgres';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    }
    catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export interface TrailState {
    errors?: {
        name?: string[];
        description?: string[];
    };
    message?: string | null;
};

const TrailFormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please enter a name.',
    }).min(1, { message: 'Field is required.' }),
    description: z.string({
        invalid_type_error: 'Please enter a description.',
    }).min(1, { message: 'Field is required.' }),
    locations: z.array(z.string()).optional(),
    created_at: z.string()
});

const CreateTrail = TrailFormSchema.omit({ id: true, locations: true, created_at: true });

export async function createTrail(prevState: TrailState, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateTrail.safeParse({
        name: formData.get('name'),
        description: formData.get('description')
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Trail.',
        };
    }
    
    // Prepare data for insertion into the database
    const { name, description } = validatedFields.data;
    const created_at = new Date().toISOString().split('T')[0];
    let newTrailId;
    try {
        const result = await sql`
            INSERT INTO trails (name, description, locations, created_at)
            VALUES (${name}, ${description}, ${[]}, ${created_at})
            RETURNING id
        `;
        newTrailId = result[0].id;
    }
    catch (error) {
        console.error(error);
    }
    revalidatePath(`/dashboard/trails/${newTrailId}/locations`);
    redirect(`/dashboard/trails/${newTrailId}/locations`);
}
