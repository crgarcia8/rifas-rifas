import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

export async function signInWithGoogle() {
  try {
    const k = process.env.NEXT_PUBLIC_SITE_URL;
    console.log("________________",k)
    debugger
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${k}/auth/callback`
      }
    })

    if (error) {
      console.error('Error:', error.message)
    }

    return { data, error }
  } catch (error) {
    console.error('Error:', error)
    return { data: null, error }
  }
}