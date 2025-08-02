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
    created_at: z.string()
});

const CreateTrail = TrailFormSchema.omit({ id: true, created_at: true });
const UpdateTrail = TrailFormSchema.omit({ id: true, created_at: true });

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
            INSERT INTO trails (name, description, created_at)
            VALUES (${name}, ${description}, ${created_at})
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

export async function updateTrail(id: string, prevState: TrailState, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = UpdateTrail.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Edit Invoice.',
        };
    }

    const { name, description } = validatedFields.data;

    try {
    
        await sql`
            UPDATE trails
            SET name = ${name}, description = ${description}
            WHERE id = ${id}
        `;
    }
    catch (error) {
        console.error(error);    
    }

    revalidatePath('/dashboard/trails');
    redirect('/dashboard/trails');
}

export interface LocationState {
    errors?: {
        name?: string[];
    };
    message?: string | null;
};

const LocationFormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please enter a name.',
    }).min(1, { message: 'Field is required.' })
});

const CreateLocation = LocationFormSchema.omit({ id: true });

export async function createLocation(prevState: LocationState, formData: FormData) {
    // Validate form fields using Zod (only name)
    const validatedFields = CreateLocation.safeParse({
        name: formData.get('name')
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Location.',
        };
    }
    
    // Get trail_id directly from formData (not validated)
    const trail_id = String(formData.get('trail_id'));
    const { name } = validatedFields.data;
    const created_at = new Date().toISOString().split('T')[0];
    let newLocationId;
    try {
        const result = await sql`
            INSERT INTO locations (trail_id, name, created_at)
            VALUES (${trail_id}, ${name}, ${created_at})
            RETURNING id
        `;
        newLocationId = result[0].id;
    }
    catch (error) {
        console.error(error);
    }

    revalidatePath(`/dashboard/trails/${trail_id}/locations/${newLocationId}`);
    redirect(`/dashboard/trails/${trail_id}/locations/${newLocationId}`);
}


export interface DrinkState {
    errors: {
        size?: string[];
        category?: string[];
        specific_type?: string[];
        beerType?: string[];
        cocktailType?: string[];
        softDrinkType?: string[];
    };
    message: string | null;
};

const DrinkFormSchema = z.object({
    trail_id: z.string(),
    location_id: z.string(),
    size: z.enum(["0.2L", "0.33L", "0.5L", "1L"], { 
        invalid_type_error: 'Please select a size.',
        required_error: 'Size is required.'
    }),
    category: z.enum(["beer", "cocktail", "soft-drink"], { 
        invalid_type_error: 'Please select a category.',
        required_error: 'Category is required.'
    }),
    specific_type: z.string({
        required_error: 'Please select a specific drink type.'
    }).min(1, 'Please select a specific drink type.'),
    isAlcoholic: z.preprocess((val) => val === 'on' || val === true, z.boolean()),
});

// Modified to ensure consistent return type
export async function createDrink(prevState: DrinkState, formData: FormData): Promise<DrinkState> {
    // Get form data values for validation
    const categoryValue = formData.get('category') as string;
    let specificType = '';
    
    // Determine the specific type based on the drink category
    if (categoryValue === 'beer') {
        specificType = formData.get('beerType') as string;
    } else if (categoryValue === 'cocktail') {
        specificType = formData.get('cocktailType') as string;
    } else if (categoryValue === 'soft-drink') {
        specificType = formData.get('softDrinkType') as string;
    }
    
    // Validate form fields using Zod
    const validatedFields = DrinkFormSchema.safeParse({
        trail_id: formData.get('trail_id'),
        location_id: formData.get('location_id'),
        size: formData.get('size'),
        category: categoryValue,
        specific_type: specificType,
        isAlcoholic: formData.get('isAlcoholic'),
    });

    // If form validation fails, return errors
    if (!validatedFields.success) {
        const zodErrors = validatedFields.error.flatten().fieldErrors;
        
        return {
            errors: {
                size: zodErrors.size,
                category: zodErrors.category,
                specific_type: zodErrors.specific_type,
                // Map specific_type errors to the appropriate type field
                beerType: categoryValue === 'beer' ? zodErrors.specific_type : undefined,
                cocktailType: categoryValue === 'cocktail' ? zodErrors.specific_type : undefined,
                softDrinkType: categoryValue === 'soft-drink' ? zodErrors.specific_type : undefined,
            },
            message: 'Missing Fields. Failed to Create Drink.',
        };
    }

    const { trail_id, location_id, size, category, specific_type, isAlcoholic } = validatedFields.data;
    const created_at = new Date().toISOString().split('T')[0];

    try {
        // Insert into our flattened database structure
        await sql`
      INSERT INTO drinks (
        location_id, 
        category, 
        specific_type, 
        size, 
        is_alcoholic,
        created_at
      )
      VALUES (
        ${location_id},
        ${category},
        ${specific_type},
        ${size},
        ${isAlcoholic},
        ${created_at}
      )
    `;
    }
    catch (error) {
        console.error(error);
        return {
            errors: { 
                size: undefined,
                category: undefined,
                specific_type: undefined,
                beerType: undefined, 
                cocktailType: undefined, 
                softDrinkType: undefined 
            },
            message: 'Database error. Failed to Create Drink.',
        };
    }

    // Revalidate the path but stay on the same page
    revalidatePath(`/dashboard/trails/${trail_id}/locations/${location_id}`);
    
    // Return a valid state object with success message
    return { 
        message: 'Drink added successfully.', 
        errors: { 
            size: undefined,
            category: undefined,
            specific_type: undefined,
            beerType: undefined, 
            cocktailType: undefined, 
            softDrinkType: undefined 
        } 
    };
}
