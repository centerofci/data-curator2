import { pick } from "../../shared/utils/pick"
import type { RootState } from "../State"
import { get_persisted_state_object, persist_state_object } from "../utils/persistence_utils"
import type { SyncState } from "./state"



export function sync_persist (state: RootState)
{
    const to_persist = pick([
        "storage_type",
    ], state.sync)

    persist_state_object("sync", to_persist)
}



export function sync_starting_state (): SyncState
{
    const obj = get_persisted_state_object<SyncState>("sync")

    const state: SyncState = {
        ready: false,
        saving: false,
        status: undefined,
        error_message: "",
        storage_type: undefined,
        ...obj,
    }

    return state
}
