import type { Action, AnyAction } from "redux"

import type { TimeResolution } from "../../shared/utils/datetime"
import type { BoundingRect, ValidityFilterTypes } from "./state"



interface ActionToggleConsumptionFormatting extends Action {}

const toggle_consumption_formatting_type = "toggle_consumption_formatting"

const toggle_consumption_formatting = (args: {}): ActionToggleConsumptionFormatting =>
{
    return { type: toggle_consumption_formatting_type, ...args }
}

export const is_toggle_consumption_formatting = (action: AnyAction): action is ActionToggleConsumptionFormatting => {
    return action.type === toggle_consumption_formatting_type
}



interface UpdateCanvasBoundingRectArgs
{
    bounding_rect: BoundingRect
}
interface ActionUpdateCanvasBoundingRect extends Action, UpdateCanvasBoundingRectArgs {}

const update_canvas_bounding_rect_type = "update_canvas_bounding_rect"

const update_canvas_bounding_rect = (args: UpdateCanvasBoundingRectArgs): ActionUpdateCanvasBoundingRect =>
{
    return { type: update_canvas_bounding_rect_type, ...args }
}

export const is_update_canvas_bounding_rect = (action: AnyAction): action is ActionUpdateCanvasBoundingRect => {
    return action.type === update_canvas_bounding_rect_type
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



export const display_actions = {
    toggle_consumption_formatting,
    update_canvas_bounding_rect,
    set_time_resolution,
    set_validity_filter,
}
