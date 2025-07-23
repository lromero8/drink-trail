'use server'

import { signIn } from '../../auth';
import { AuthError } from 'next-auth';
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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

export async function createTrail() {
    const newTrail = {
        id: generateRandomId(),
        name: '',
        locations: [],
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    try {
        await sql`
            INSERT INTO trails (id, name, locations, createdAt)
            VALUES (${newTrail.id}, ${newTrail.name}, ${newTrail.locations}, ${newTrail.createdAt})
        `;
    
    }
    catch (error) {
        console.error(error);
    }
    revalidatePath(`/dashboard/trail/${newTrail.id}`);
    redirect(`/dashboard/trail/${newTrail.id}`);
}

function generateRandomId() {
    return bcrypt.hashSync(Math.random().toString(), 10);
}