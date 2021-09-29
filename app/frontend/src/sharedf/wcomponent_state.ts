import { percentage_to_string } from "../shared/UI/percentages"
import { VAPsType } from "../shared/wcomponent/interfaces/generic_value"
import type { StateValueAndPredictionsSet } from "../shared/wcomponent/interfaces/state"
import { get_VAPs_ordered_by_prob } from "../shared/wcomponent/value_and_prediction/utils"



export function get_probable_VAP_set_values (VAP_set: StateValueAndPredictionsSet, VAPs_represent: VAPsType)
{
    const VAPs = get_VAPs_ordered_by_prob(VAP_set.entries, VAPs_represent)
    const first_VAP = VAPs[0]
    if (VAPs_represent === VAPsType.boolean && first_VAP) return first_VAP.probability > 0.5 ? "True" : "False"

    const probable_VAPS = VAPs.filter(({ probability }) => probability > 0)

    return probable_VAPS.map(e => e.value).join(", ") || "-"
}


export function get_VAP_set_prob (VAP_set: StateValueAndPredictionsSet, VAPs_represent: VAPsType)
{
    const VAPs = get_VAPs_ordered_by_prob(VAP_set.entries, VAPs_represent)
    const first_VAP = VAPs[0]
    if (VAPs_represent === VAPsType.boolean && first_VAP) return percentage_to_string(first_VAP.probability)

    const probable_VAPS = VAPs.filter(({ probability }) => probability > 0)

    return probable_VAPS.map(e => percentage_to_string(e.probability)).join(", ")
}


export function get_VAP_set_conviction (VAP_set: StateValueAndPredictionsSet, VAPs_represent: VAPsType)
{
    const VAPs = get_VAPs_ordered_by_prob(VAP_set.entries, VAPs_represent)
    const first_VAP = VAPs[0]
    if (VAPs_represent === VAPsType.boolean && first_VAP) return percentage_to_string(first_VAP.conviction)

    const probable_VAPS = VAPs.filter(({ probability }) => probability > 0)

    const convictions = new Set<number>()
    probable_VAPS.forEach(({ conviction }) => convictions.add(conviction))
    const same_convictions = convictions.size <= 1

    return probable_VAPS.slice(0, same_convictions ? 1 : undefined)
        .map(e => percentage_to_string(e.conviction)).join(", ")
}
