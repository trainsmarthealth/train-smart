import { supabase } from './supabaseClient'

/**
 * Fetch all visible programs for the current user
 * - Unauthenticated: only free programs (is_free = true)
 * - Authenticated: free programs + entitled programs
 */
export async function getPrograms() {
    const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching programs:', error)
        return []
    }

    return data || []
}

/**
 * Fetch a single program by ID
 */
export async function getProgram(programId) {
    const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('id', programId)
        .single()

    if (error) {
        console.error('Error fetching program:', error)
        return null
    }

    return data
}

/**
 * Fetch exercises for a program
 */
export async function getExercises(programId) {
    const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('program_id', programId)
        .order('sort_order', { ascending: true })

    if (error) {
        console.error('Error fetching exercises:', error)
        return []
    }

    return data || []
}

/**
 * Fetch a single exercise by ID
 */
export async function getExercise(exerciseId) {
    const { data, error } = await supabase
        .from('exercises')
        .select('*, programs(*)')
        .eq('id', exerciseId)
        .single()

    if (error) {
        console.error('Error fetching exercise:', error)
        return null
    }

    return data
}

/**
 * Fetch user's entitlements
 */
export async function getUserEntitlements() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('entitlements')
        .select('*, programs(*)')
        .eq('user_id', user.id)

    if (error) {
        console.error('Error fetching entitlements:', error)
        return []
    }

    return data || []
}

/**
 * Check if user has access to a specific program
 */
export async function hasAccessToProgram(programId) {
    const { data: { user } } = await supabase.auth.getUser()

    // Check if program is free
    const program = await getProgram(programId)
    if (program?.is_free) return true

    if (!user) return false

    const { data, error } = await supabase
        .from('entitlements')
        .select('id, is_subscriber')
        .eq('user_id', user.id)
        .or(`program_id.eq.${programId},is_subscriber.eq.true`)
        .limit(1)

    if (error) {
        console.error('Error checking access:', error)
        return false
    }

    return data && data.length > 0
}

/**
 * Update user progress on an exercise
 */
export async function updateProgress(exerciseExerciseId, positionSeconds, completed = false) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('user_progress')
        .upsert({
            user_id: user.id,
            exercise_id: exerciseExerciseId,
            last_position_seconds: positionSeconds,
            completed
        }, {
            onConflict: 'user_id,exercise_id'
        })
        .select()

    if (error) {
        console.error('Error updating progress:', error)
        return null
    }

    return data
}

/**
 * Verify a purchase for error recovery
 * Placeholder for Stripe integration
 */
export async function verifyPurchase(programId) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return {
            success: false,
            message: 'Bitte melde dich zuerst an.'
        }
    }

    // Check if user already has entitlement
    const { data: existingEntitlement } = await supabase
        .from('entitlements')
        .select('id')
        .eq('user_id', user.id)
        .eq('program_id', programId)
        .single()

    if (existingEntitlement) {
        return {
            success: true,
            message: 'Du hast bereits Zugriff auf dieses Programm!'
        }
    }

    // TODO: Integrate with Stripe to verify payment
    // For now, return a placeholder response
    return {
        success: false,
        message: 'Kein Kauf gefunden. Bitte kontaktiere unseren Support für Hilfe.',
        supportEmail: 'support@trainsmart.de'
    }
}
