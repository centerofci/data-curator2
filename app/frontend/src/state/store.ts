import { createStore, Action, Store } from "redux"

import { toggle_rich_text_formatting_on_key_press } from "./display/display"
import { record_keyupdown_activity } from "./global_keys/record_keyupdown_activity"
import { render_all_objects, render_all_objects_and_update_store } from "./objects/rendering"
import { root_reducer } from "./reducer"
import { periodically_change_display_at_created_datetime } from "./routing/datetime/display_at_created"
import { factory_location_hash } from "./routing/factory_location_hash"
import { specialised_objects_subscribers } from "./specialised_objects/subscribers/subscribers"
import { get_starting_state } from "./starting_state"
import type { RootState } from "./State"
import { load_state } from "./sync_utils/load_state"
import { save_state } from "./sync_utils/save_state"



let cached_store: Store<RootState, Action<any>>

interface ConfigStoreArgs
{
    use_cache?: boolean
    override_preloaded_state?: Partial<RootState> | undefined
    load_state_from_server?: boolean
}
export function config_store (args: ConfigStoreArgs = {})
{
    const {
        use_cache = true,
        override_preloaded_state = {},
        load_state_from_server = false,
    } = args

    if (cached_store && use_cache) return cached_store


    const preloaded_state: RootState = render_all_objects({
        ...get_starting_state(),
        ...override_preloaded_state,
    })
    const store = createStore<RootState, Action, {}, {}>(root_reducer as any, preloaded_state)
    cached_store = store


    if (load_state_from_server) load_state(store.dispatch)


    const save = () =>
    {
        const state = store.getState()
        ;(window as any).debug_state = state

        // for now, very simple logic for when to save
        if (!state.sync.ready || !load_state_from_server) return

        save_state(store.dispatch, state)
    }
    store.subscribe(save)
    window.onbeforeunload = save


    store.subscribe(render_all_objects_and_update_store(store))

    store.subscribe(factory_location_hash(store))

    store.subscribe(specialised_objects_subscribers(store))

    store.subscribe(toggle_rich_text_formatting_on_key_press(store))

    periodically_change_display_at_created_datetime(store)

    record_keyupdown_activity(store)

    return store
}
