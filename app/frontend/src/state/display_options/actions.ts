import type { Action, AnyAction } from "redux"

import type { TimeResolution } from "../../shared/utils/datetime"
import type { ValidityFilterTypes, CertaintyFormattingTypes } from "./state"



interface ActionToggleConsumptionFormatting extends Action {}

const toggle_consumption_formatting_type = "toggle_consumption_formatting"

const toggle_consumption_formatting = (args: {}): ActionToggleConsumptionFormatting =>
{
    return { type: toggle_consumption_formatting_type, ...args }
}

export const is_toggle_consumption_formatting = (action: AnyAction): action is ActionToggleConsumptionFormatting => {
    return action.type === toggle_consumption_formatting_type
}



interface ActionToggleFocusedMode extends Action {}

const toggle_focused_mode_type = "toggle_focused_mode"

const toggle_focused_mode = (args: {}): ActionToggleFocusedMode =>
{
    return { type: toggle_focused_mode_type, ...args }
}

export const is_toggle_focused_mode = (action: AnyAction): action is ActionToggleFocusedMode => {
    return action.type === toggle_focused_mode_type
}



interface SetTimeResolutionArgs
{
    time_resolution: TimeResolution
}
interface ActionSetTimeResolution extends Action, SetTimeResolutionArgs {}

const set_time_resolution_type = "set_time_resolution"

const set_time_resolution = (args: SetTimeResolutionArgs): ActionSetTimeResolution =>
{
    return { type: set_time_resolution_type, ...args }
}

export const is_set_time_resolution = (action: AnyAction): action is ActionSetTimeResolution => {
    return action.type === set_time_resolution_type
}



interface SetValidityFilterArgs
{
    validity_filter: ValidityFilterTypes
}
interface ActionSetValidityFilter extends Action, SetValidityFilterArgs {}

const set_validity_filter_type = "set_validity_filter"

const set_validity_filter = (args: SetValidityFilterArgs): ActionSetValidityFilter =>
{
    return { type: set_validity_filter_type, ...args }
}

export const is_set_validity_filter = (action: AnyAction): action is ActionSetValidityFilter => {
    return action.type === set_validity_filter_type
}



interface SetCertaintyFormattingArgs
{
    certainty_formatting: CertaintyFormattingTypes
}
interface ActionSetCertaintyFormatting extends Action, SetCertaintyFormattingArgs {}

const set_certainty_formatting_type = "set_certainty_formatting"

const set_certainty_formatting = (args: SetCertaintyFormattingArgs): ActionSetCertaintyFormatting =>
{
    return { type: set_certainty_formatting_type, ...args }
}

export const is_set_certainty_formatting = (action: AnyAction): action is ActionSetCertaintyFormatting => {
    return action.type === set_certainty_formatting_type
}



interface SetDisplayBySimulatedTimeArgs
{
    display_by_simulated_time: boolean
}
interface ActionSetDisplayBySimulatedTime extends Action, SetDisplayBySimulatedTimeArgs {}

const set_display_by_simulated_time_type = "set_display_by_simulated_time"

const set_display_by_simulated_time = (args: SetDisplayBySimulatedTimeArgs): ActionSetDisplayBySimulatedTime =>
{
    return { type: set_display_by_simulated_time_type, ...args }
}

export const is_set_display_by_simulated_time = (action: AnyAction): action is ActionSetDisplayBySimulatedTime => {
    return action.type === set_display_by_simulated_time_type
}



export const display_actions = {
    toggle_consumption_formatting,
    toggle_focused_mode,
    set_time_resolution,
    set_validity_filter,
    set_certainty_formatting,
    set_display_by_simulated_time,
}
