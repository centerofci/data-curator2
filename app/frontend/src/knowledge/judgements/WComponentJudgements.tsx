import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import "./WComponentJudgements.css"
import type { WComponent } from "../../shared/wcomponent/interfaces/SpecialisedObjects"
import type { RootState } from "../../state/State"
import { JudgementBadgeConnected } from "./JudgementBadgeConnected"
import type { ParsedValue, VAPsType } from "../../shared/wcomponent/interfaces/generic_value"
import { JudgementBadgeSimple } from "./JudgementBadgeSimple"



type OwnProps =
{
    wcomponent: WComponent
    target_VAPs_represent?: undefined
    value?: undefined
}
| {
    wcomponent: WComponent
    target_VAPs_represent: VAPsType
    value: ParsedValue
}



const map_state = (state: RootState, own_props: OwnProps) => {
    const judgement_or_objective_ids = [
        ...(state.derived.judgement_or_objective_ids_by_target_id[own_props.wcomponent.id] || []),
        ...(state.derived.judgement_or_objective_ids_by_goal_id[own_props.wcomponent.id] || []),
    ]

    return {
        judgement_or_objective_ids,
    }
}


const connector = connect(map_state)
type Props = ConnectedProps<typeof connector> & OwnProps


function _WComponentJudgements (props: Props)
{
    const { judgement_or_objective_ids: ids, target_VAPs_represent, value } = props
    const node_judgements_container_class_name = "node_judgements_container " + (ids.length ? "" : "empty")

    if (value === undefined || target_VAPs_represent === undefined)
    {
        return <div className={node_judgements_container_class_name}>
            {ids.map(id => <JudgementBadgeConnected judgement_or_objective_id={id} />)}
        </div>
    }

    return <div className={node_judgements_container_class_name}>
        {ids.map(id => <JudgementBadgeSimple
            judgement_or_objective_id={id}
            target_VAPs_represent={target_VAPs_represent}
            value={value}
        />)}
    </div>
}

export const WComponentJudgements = connector(_WComponentJudgements) as FunctionalComponent<OwnProps>
