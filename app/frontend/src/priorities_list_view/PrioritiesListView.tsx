import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import "./PrioritiesListView.css"
import { WComponentCanvasNode } from "../knowledge/canvas_node/WComponentCanvasNode"
import { MainArea } from "../layout/MainArea"
import type { WComponentNodeGoal } from "../shared/wcomponent/interfaces/goal"
import {
    alert_wcomponent_is_goal,
} from "../shared/wcomponent/interfaces/SpecialisedObjects"
import { get_current_UI_knowledge_view_from_state } from "../state/specialised_objects/accessors"
import type { RootState } from "../state/State"
import { EditableNumber } from "../form/EditableNumber"
import type { WComponentPrioritisation } from "../shared/wcomponent/interfaces/priorities"
import { ListHeaderAddButton } from "../form/editable_list/ListHeaderAddButton"
import { create_wcomponent } from "../knowledge/create_wcomponent_type"
import { Prioritisation } from "./Prioritisation"



export function PrioritiesListView (props: {})
{
    return <MainArea
        main_content={<PrioritiesListViewContent />}
    />
}



const map_state = (state: RootState) =>
{
    const wcomponents_by_id = state.specialised_objects.wcomponents_by_id

    const knowledge_view = get_current_UI_knowledge_view_from_state(state)
    const goals: WComponentNodeGoal[] = []
    let prioritisations: WComponentPrioritisation[] = []

    if (knowledge_view)
    {
        knowledge_view.wc_ids_by_type.goal.forEach(id =>
        {
            const goal = wcomponents_by_id[id]

            if (!alert_wcomponent_is_goal(goal, id)) return

            goals.push(goal)
        })

        prioritisations = knowledge_view.prioritisations
    }


    const { item_id } = state.routing
    const selected_prioritisation_id = prioritisations.find(({ id }) => id === item_id) ? item_id : undefined

    return {
        knowledge_view_id: knowledge_view && knowledge_view.id,
        goals,
        prioritisations,
        editing: !state.display_options.consumption_formatting,
        creation_context: state.creation_context,
        selected_prioritisation_id,
    }
}


const connector = connect(map_state)
type Props = ConnectedProps<typeof connector>



function _PrioritiesListViewContent (props: Props)
{
    const { goals, prioritisations, editing, knowledge_view_id } = props

    return <div className="priorities_list_view_content">
        <div className="goals">
            <h1>Potential</h1>

            {goals.map(goal => <div style={{ display: "flex" }}>
                <WComponentCanvasNode id={goal.id} on_graph={false} />

                <div>
                    <br />
                    <span class="description_label">Effort</span> &nbsp;
                    <EditableNumber
                        placeholder="..."
                        allow_undefined={false}
                        value={0}
                        disabled={props.selected_prioritisation_id === undefined}
                        on_change={new_effort => {}}
                    />
                </div>

            </div>)}

            <h1>Prioritised</h1>
            <h1>Deprioritised</h1>
        </div>



        <div className="prioritisations">
            <div className="prioritisations_header">
                <h1>Prioritisations</h1>

                {editing && knowledge_view_id && <ListHeaderAddButton
                    new_item_descriptor="Prioritisation"
                    on_pointer_down_new_list_entry={() =>
                    {
                        create_wcomponent({
                            wcomponent: { type: "prioritisation" },
                            creation_context: props.creation_context,
                            add_to_knowledge_view: {
                                id: knowledge_view_id,
                                position: { left: 0, top: 0 },
                            }
                        })
                    }}
                />}
            </div>


            {prioritisations.map(p => <Prioritisation prioritisation={p}/>)}
        </div>
    </div>
}

const PrioritiesListViewContent = connector(_PrioritiesListViewContent) as FunctionalComponent<{}>