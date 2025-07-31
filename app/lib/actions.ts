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
    let newLocationId;
    try {
        const result = await sql`
            INSERT INTO locations (trail_id, name)
            VALUES (${trail_id}, ${name})
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
        type?: string[];
        beerType?: string[];
        cocktailType?: string[];
        softDrinkType?: string[];
    };
    message: string | null;
};

const DrinkFormSchema = z.object({
    trail_id: z.string(),
    location_id: z.string(),
    size: z.enum(["0.2L", "0.33L", "0.5L", "1L"], { invalid_type_error: 'Please select a size.' }),
    type: z.enum(["beer", "cocktail", "soft-drink"], { invalid_type_error: 'Please select a type.' }),
    beerType: z.preprocess(val => val === null ? undefined : val, z.string().optional()),
    cocktailType: z.preprocess(val => val === null ? undefined : val, z.string().optional()),
    softDrinkType: z.preprocess(val => val === null ? undefined : val, z.string().optional()),
    isAlcoholic: z.preprocess((val) => val === 'on' || val === true, z.boolean()),
});

// Modified to ensure consistent return type
export async function createDrink(prevState: DrinkState, formData: FormData): Promise<DrinkState> {
    // Get form data values for validation
    const typeValue = formData.get('type') as string;
    const beerTypeValue = formData.get('beerType') as string;
    const cocktailTypeValue = formData.get('cocktailType') as string;
    const softDrinkTypeValue = formData.get('softDrinkType') as string;
    
    // Custom validation for drink type specific fields
    const errors: DrinkState['errors'] = {
        size: undefined,
        type: undefined,
        beerType: undefined,
        cocktailType: undefined,
        softDrinkType: undefined
    };
    
    let hasErrors = false;
    
    // Check if the specific type field is required based on selected drink type
    if (typeValue === 'beer' && (!beerTypeValue || beerTypeValue.trim() === '')) {
        errors.beerType = ['Please select a beer type.'];
        hasErrors = true;
    }
    
    if (typeValue === 'cocktail' && (!cocktailTypeValue || cocktailTypeValue.trim() === '')) {
        errors.cocktailType = ['Please select a cocktail type.'];
        hasErrors = true;
    }
    
    if (typeValue === 'soft-drink' && (!softDrinkTypeValue || softDrinkTypeValue.trim() === '')) {
        errors.softDrinkType = ['Please select a soft drink type.'];
        hasErrors = true;
    }
    
    // Validate form fields using Zod
    const validatedFields = DrinkFormSchema.safeParse({
        trail_id: formData.get('trail_id'),
        location_id: formData.get('location_id'),
        size: formData.get('size'),
        type: typeValue,
        beerType: beerTypeValue,
        cocktailType: cocktailTypeValue,
        softDrinkType: softDrinkTypeValue,
        isAlcoholic: formData.get('isAlcoholic'),
    });

    // Combine Zod validation errors with our custom errors
    if (!validatedFields.success || hasErrors) {
        const zodErrors = validatedFields.success ? {} : validatedFields.error.flatten().fieldErrors;
        
        // Merge Zod errors with our custom errors
        return {
            errors: {
                ...errors,
                size: zodErrors.size || errors.size,
                type: zodErrors.type || errors.type,
            },
            message: 'Missing Fields. Failed to Create Drink.',
        };
    }

    const validData = validatedFields.data;
    const { trail_id, location_id, size, type, beerType, cocktailType, softDrinkType, isAlcoholic } = validData;

    // Build drink_type JSON for DB
    let drink_type: any = {};
    if (type === 'beer') drink_type.beerType = beerType;
    if (type === 'cocktail') drink_type.cocktailType = cocktailType;
    if (type === 'soft-drink') drink_type.softDrinkType = softDrinkType;

    try {
        await sql`
      INSERT INTO drinks (location_id, drink_type, size, type, is_alcoholic, beer_type, cocktail_type, soft_drink_type)
      VALUES (
        ${location_id},
        ${drink_type},
        ${size},
        ${type},
        ${isAlcoholic},
        ${beerType || null},
        ${cocktailType || null},
        ${softDrinkType || null}
      )
    `;
    }
    catch (error) {
        console.error(error);
        return {
            errors: { 
                size: undefined,
                type: undefined, 
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
            type: undefined, 
            beerType: undefined, 
            cocktailType: undefined, 
            softDrinkType: undefined 
        } 
    };
}
