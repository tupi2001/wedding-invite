import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

function createSupabaseClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    // Return a dummy client that will throw on use - allows build to succeed
    // without env vars configured (they're required at runtime)
    return new Proxy({} as SupabaseClient<Database>, {
      get(_, prop) {
        if (prop === "from") {
          return () => {
            throw new Error(
              "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables."
            )
          }
        }
        return undefined
      },
    })
  }

  return createClient<Database>(url, key)
}

export const supabase = createSupabaseClient()
