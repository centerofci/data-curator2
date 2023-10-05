import { FunctionalComponent } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { WComponent, wcomponent_is_statev2, wcomponent_is_state_value } from "../wcomponent/interfaces/SpecialisedObjects"
import type { HasVAPSetsAndMaybeValuePossibilities } from "../wcomponent/interfaces/state"
import type { RootState } from "../state/State"
import { get_wcomponent_VAPs_represent } from "../wcomponent/get_wcomponent_VAPs_represent"
import { WComponentCalculatonsForm } from "./calculations/WComponentCalculatonsForm"
import { update_VAPSets_with_possibilities } from "../wcomponent/CRUD_helpers/update_VAPSets_with_possibilities"
import { VAPsType } from "../wcomponent/interfaces/VAPsType"
import { ValuePossibilitiesComponent } from "./value_possibilities/ValuePossibilitiesComponent"
import { EasyActionValueAndPredictionSets } from "./values_and_predictions/EasyActionValueAndPredictionSets"
import { ValueAndPredictionSets } from "./values_and_predictions/ValueAndPredictionSets"



interface OwnProps
{
    force_editable: boolean
    wcomponent: WComponent & HasVAPSetsAndMaybeValuePossibilities
    upsert_wcomponent: (partial_wcomponent: Partial<WComponent>) => void
}


const map_state = (state: RootState) =>
{
    return {
        wcomponents_by_id: state.specialised_objects.wcomponents_by_id,
    }
}


const map_dispatch = {
}


const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps


function _WComponentStateForm (props: Props)
{
    const {
        force_editable, wcomponent, upsert_wcomponent,
        wcomponents_by_id,
    } = props

    const VAPs_represent = get_wcomponent_VAPs_represent(wcomponent, wcomponents_by_id)
    const orig_values_and_prediction_sets = wcomponent.values_and_prediction_sets || []
    const orig_value_possibilities = wcomponent.value_possibilities


    return <>
        {wcomponent_is_statev2(wcomponent) &&
        (force_editable || (wcomponent.calculations?.length || 0) > 0) &&
        <WComponentCalculatonsForm
            wcomponent={wcomponent}
            upsert_wcomponent={upsert_wcomponent}
        />}

        {(orig_values_and_prediction_sets !== undefined && (force_editable || orig_values_and_prediction_sets.length > 0)) && <div>
            <p>
                {VAPs_represent === VAPsType.undefined && <div>
                    {wcomponent.type === "state_value"
                        ? "Set subtype of target 'state' component to show Value Predictions on this 'state value' component"
                        : "Set subtype to show Value Predictions"
                    }
                </div>}
                {VAPs_represent === VAPsType.action && <EasyActionValueAndPredictionSets
                    VAPs_represent={VAPs_represent}
                    base_id={wcomponent.base_id}
                    existing_value_possibilities={orig_value_possibilities}
                    values_and_prediction_sets={orig_values_and_prediction_sets}
                    update_VAPSets_and_value_possibilities={({ value_possibilities, values_and_prediction_sets }) =>
                    {
                        upsert_wcomponent({ value_possibilities, values_and_prediction_sets })
                    }}
                    force_editable={force_editable}
                />}
                {VAPs_represent !== VAPsType.undefined && <ValueAndPredictionSets
                    wcomponent_id={wcomponent.id}
                    VAPs_represent={VAPs_represent}
                    existing_value_possibilities={orig_value_possibilities}
                    values_and_prediction_sets={orig_values_and_prediction_sets}
                    update_VAPSets_and_value_possibilities={({ value_possibilities, values_and_prediction_sets }) =>
                    {
                        upsert_wcomponent({ value_possibilities, values_and_prediction_sets })
                    }}
                    force_editable={force_editable}
                />}
            </p>

            <hr />
            <br />
        </div>}

        {VAPs_represent !== VAPsType.undefined
            && orig_values_and_prediction_sets !== undefined
            && (force_editable || (Object.keys(orig_value_possibilities || {}).length > 0))
            && <>
            <ValuePossibilitiesComponent
                editing={force_editable}
                attribute_wcomponent={wcomponents_by_id[(wcomponent_is_state_value(wcomponent) && wcomponent.attribute_wcomponent_id) || ""]}
                VAPs_represent={VAPs_represent}
                value_possibilities={orig_value_possibilities}
                values_and_prediction_sets={orig_values_and_prediction_sets}
                update_value_possibilities={value_possibilities =>
                {
                    const values_and_prediction_sets = update_VAPSets_with_possibilities(orig_values_and_prediction_sets, value_possibilities)
                    upsert_wcomponent({ value_possibilities, values_and_prediction_sets })
                }}
            />
            <br />
        </>}
    </>
}

export const WComponentStateForm = connector(_WComponentStateForm) as FunctionalComponent<OwnProps>
