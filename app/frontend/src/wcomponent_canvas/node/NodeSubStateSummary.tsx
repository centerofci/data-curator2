import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { wcomponent_should_have_state_VAP_sets } from "../../wcomponent/interfaces/SpecialisedObjects"
import type { WComponentSubState } from "../../wcomponent/interfaces/substate"
import type { RootState } from "../../state/State"
import { ConnectedValueAndPredictionSetSummary } from "./ConnectedValueAndPredictionSetSummary"
import { NodeValueAndPredictionSetSummary } from "./NodeValueAndPredictionSetSummary"



interface OwnProps
{
    wcomponent: WComponentSubState
    created_at_ms: number
    sim_ms: number
}


const map_state = (state: RootState, own_props: OwnProps) =>
{
    const { target_wcomponent_id } = own_props.wcomponent
    const maybe_target_wcomponent = state.specialised_objects.wcomponents_by_id[target_wcomponent_id || ""]
    const target_wcomponent = wcomponent_should_have_state_VAP_sets(maybe_target_wcomponent) && maybe_target_wcomponent

    return {
        target_wcomponent,
    }
}

const connector = connect(map_state)
type Props = ConnectedProps<typeof connector> & OwnProps


function _NodeSubStateSummary (props: Props)
{
    const { target_wcomponent } = props
    if (!target_wcomponent) return null

    const { selector } = props.wcomponent
    const { target_VAP_set_id, target_value_id_type, target_value } = selector || {}

    if (!target_VAP_set_id && (!target_value_id_type || !target_value))
    {
        return <NodeValueAndPredictionSetSummary
            wcomponent={target_wcomponent}
            created_at_ms={props.created_at_ms}
            sim_ms={props.sim_ms}
        />
    }

    const VAP_sets = target_wcomponent.values_and_prediction_sets || []
    const target_VAP_set = VAP_sets.find(({ id }) => id === target_VAP_set_id)
    // if (target_VAP_set_id && !target_VAP_set) return ""

    if (target_VAP_set) return <ConnectedValueAndPredictionSetSummary
        wcomponent={target_wcomponent}
        VAP_set={target_VAP_set}
    />


    // if (!VAP_set) return null

    return <div>Target: {target_wcomponent.title}</div>
}

export const NodeSubStateSummary = connector(_NodeSubStateSummary) as FunctionalComponent<OwnProps>