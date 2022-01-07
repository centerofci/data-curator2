import { get_supabase } from "../../supabase/get_supabase"
import type { SupabaseUser } from "../../supabase/interfaces"
import { ACTIONS } from "../actions"
import { pub_sub } from "../pub_sub/pub_sub"
import type { StoreType } from "../store"
import { selector_chosen_base } from "./selector"
import { refresh_bases_for_current_user } from "./utils"



export function user_info_subscribers (store: StoreType)
{
    if (!store.load_state_from_storage) return

    const starting_state = store.getState()
    const { users_by_id, bases_by_id } = starting_state.user_info
    if (!users_by_id) get_users(store)
    if (!bases_by_id) refresh_bases_for_current_user(store)


    pub_sub.user.sub("changed_user", () =>
    {
        // If we have signed out, at the moment we hard reload the page.
        // The following logic only applies when we were signed out and then sign in.
        // Under that scenario, we might have been looking at a public base, so leave all
        // the component data intact.  Otherwise clear it and load it properly
        if (!selector_chosen_base(store.getState())?.public_read)
        {
            store.dispatch(ACTIONS.specialised_object.clear_from_mem_all_specialised_objects())
        }

        pub_sub.user.pub("stale_users_by_id", true)
        pub_sub.user.pub("stale_bases", true)
    })


    pub_sub.user.sub("stale_users_by_id", full_reload =>
    {
        if (full_reload) store.dispatch(ACTIONS.user_info.set_users({ users: undefined }))
        get_users(store)
    })


    pub_sub.user.sub("stale_bases", full_reload =>
    {
        if (full_reload) store.dispatch(ACTIONS.user_info.update_bases({ bases: undefined }))
        refresh_bases_for_current_user(store)
    })
}



async function get_users (store: StoreType)
{
    const supabase = get_supabase()
    const { data, error } = await supabase.from<SupabaseUser>("users").select("*")
    // set_postgrest_error(error)

    if (data) store.dispatch(ACTIONS.user_info.set_users({ users: data }))
}
