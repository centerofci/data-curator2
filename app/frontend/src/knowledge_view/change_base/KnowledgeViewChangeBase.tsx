import type { PostgrestResponse } from "@supabase/postgrest-js"
import { FunctionalComponent, h } from "preact"
import { useState } from "preact/hooks"
import { connect, ConnectedProps } from "react-redux"

import { ConfirmatoryButton } from "../../form/ConfirmatoryButton"
import type { KnowledgeView } from "../../shared/interfaces/knowledge_view"
import { Button } from "../../sharedf/Button"
import type { RootState } from "../../state/State"
import { get_supabase } from "../../supabase/get_supabase"
import { calc_ids_to_move_and_conflicts, WComponentMoveBaseConflicts } from "./calc_ids_to_move_and_conflicts"
import { SelectBaseToMoveTo } from "./SelectBaseToMoveTo"
import { WComponentMoveConflicts } from "./WComponentMoveConflicts"



interface OwnProps
{
    knowledge_view: KnowledgeView
}


const map_state = (state: RootState) =>
({
    nested_knowledge_view_ids_map: state.derived.nested_knowledge_view_ids.map,
    knowledge_views_by_id: state.specialised_objects.knowledge_views_by_id,
    wcomponents_by_id: state.specialised_objects.wcomponents_by_id,
    chosen_base_id: state.user_info.chosen_base_id,
})


const connector = connect(map_state)
type Props = ConnectedProps<typeof connector> & OwnProps



function _KnowledgeViewChangeBase (props: Props)
{
    const { knowledge_view, nested_knowledge_view_ids_map, knowledge_views_by_id, wcomponents_by_id, chosen_base_id } = props

    const [wcomponents_move_conflicts, set_wcomponents_move_conflicts] = useState<WComponentMoveBaseConflicts | undefined>(undefined)
    const [ids_to_move, set_ids_to_move] = useState<string[] | undefined>(undefined)
    const [base_id_to_move_to, set_base_id_to_move_to] = useState<number | undefined>(undefined)

    const [result, set_result] = useState<PostgrestResponse<{}> | undefined>(undefined)


    if (chosen_base_id === undefined) return <div>
        <h4>Change base of knowledge view</h4>

        Need to select a base first
    </div>


    if (!wcomponents_move_conflicts || !ids_to_move) return <div>
        <h4>Change base of knowledge view</h4>

        <Button
            value="Check if safe to move"
            onClick={() =>
            {
                const { ids_to_move, wcomponents_move_conflicts } = calc_ids_to_move_and_conflicts({
                    knowledge_view, nested_knowledge_view_ids_map, knowledge_views_by_id, wcomponents_by_id,
                })
                set_wcomponents_move_conflicts(wcomponents_move_conflicts)
                set_ids_to_move(ids_to_move)
            }}
        />
    </div>


    // TODO: calculate which components and knowledge views are currently selected which belong to a base id
    // that's different to the current chosen_base_id
    const wcomponent_conflict_number = Object.keys(wcomponents_move_conflicts).length
    const ids_to_move_without_conflict = ids_to_move.filter(id => !wcomponents_move_conflicts[id])


    return <div>
        <h4>Change base of knowledge view</h4>

        {wcomponent_conflict_number > 0 && <p>
            There are other knowledge views which are not nested under this knowledge view and that
            contain <span style={{ color: "darkred" }}>{wcomponent_conflict_number} non-deleted,
            and therefore conflicting, component</span> entries.  These entries
            will not be moved to the new base because the knowledge view that contain them will not be moved.
            {/* If these components are moved to the new base then their entries in the other knowledge views
            will be <span style={{ fontSize: 11, color: "darkred" }}>PERMANENTLY</span> removed.
            In the future it will be possible to blend components from multiple bases so this warning will not apply
            but we have not yet implemented that functionality. */}
        </p>}

        {wcomponent_conflict_number > 0 && <p>
            <i><b>{wcomponent_conflict_number} component(s) in other knowledge views:</b></i>

            <WComponentMoveConflicts
                wcomponents_move_conflicts={wcomponents_move_conflicts}
            />
        </p>}


        <p>
            <i><b>Select base to move to</b></i>

            <SelectBaseToMoveTo
                base_id_to_move_to={base_id_to_move_to}
                on_change={new_base_id_to_move_to => set_base_id_to_move_to(new_base_id_to_move_to)}
            />
        </p>


        {base_id_to_move_to !== undefined && <div>
            <ConfirmatoryButton
                disabled={ids_to_move.length === 0}
                button_text={`Move all ${ids_to_move.length} to new base (including conflicted)`}
                on_click={() =>
                {
                    move_ids_to_new_base(ids_to_move, chosen_base_id, base_id_to_move_to, set_result)
                }}
            />
            <ConfirmatoryButton
                disabled={ids_to_move_without_conflict.length === 0}
                button_text={`Move ${ids_to_move_without_conflict.length} (no conflicts) to new base`}
                on_click={() =>
                {
                    move_ids_to_new_base(ids_to_move_without_conflict, chosen_base_id, base_id_to_move_to, set_result)
                }}
            />
        </div>}


        {result && <p>
            {result.error && <div style={{ backgroundColor: "pink" }}>
                Got error whilst trying to change base id of components <br />
                <pre>{JSON.stringify(result.error, null, 2)}</pre>
            </div>}

            {result.data && <div style={{ backgroundColor: "lightgreen" }}>
                Successfully changed base id of {result.data} components &amp; knowledge views.  Reloading page in {RELOAD_PAGE_DELAY_IN_SECONDS} seconds
            </div>}
        </p>}

    </div>
}

export const KnowledgeViewChangeBase = connector(_KnowledgeViewChangeBase) as FunctionalComponent<OwnProps>



const RELOAD_PAGE_DELAY_IN_SECONDS = 2
async function move_ids_to_new_base (ids: string[], from_base_id: number, base_id_to_move_to: number, set_result: (result: PostgrestResponse<{}>) => void)
{
    const supabase = get_supabase()
    const result = await supabase.rpc("move_ids_to_new_base", { ids, from_base_id, to_base_id: base_id_to_move_to })

    set_result(result)

    // This is a simple solution to clear the application state and return it to being valid
    // This can be improved on to improve user experience.  e.g. we could navigate to the new base
    // or if we want to keep on this base, we could clear the data and refetch it to get the correct
    // list of which wcomponents and knowledge views remain
    if (!result.error) setTimeout(() => document.location.reload(), RELOAD_PAGE_DELAY_IN_SECONDS * 1000)
}