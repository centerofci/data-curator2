import { Box, FormControl, FormLabel, Slider } from "@mui/material"
import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { MoveToWComponentButton } from "../../canvas/MoveToWComponentButton"
import { grid_small_step, h_step, v_step } from "../../canvas/position_utils"
import { ConfirmatoryDeleteButton } from "../../form/ConfirmatoryDeleteButton"
import { SelectKnowledgeView } from "../../knowledge_view/SelectKnowledgeView"
import type { KnowledgeViewWComponentEntry } from "../../shared/interfaces/knowledge_view"
import { Button } from "../../sharedf/Button"
import { ColorPicker } from "../../sharedf/ColorPicker"
import { ACTIONS } from "../../state/actions"
import { get_middle_of_screen } from "../../state/display_options/display"
import {
    get_current_knowledge_view_from_state,
    get_current_composed_knowledge_view_from_state,
} from "../../state/specialised_objects/accessors"
import type { RootState } from "../../state/State"
import { ExploreButtonHandle } from "../../wcomponent_canvas/node/ExploreButtonHandle"
import { WComponentBackReferences } from "../../wcomponent_ui/WComponentBackReferences"
import { AlignComponentForm } from "../AlignComponentForm"
import { default_frame_color } from "./default_frame_color"
import { WComponentPresenceInOtherKVs } from "./WComponentPresenceInOtherKVs"
import { WComponentStatusInKnowledgeView, get_wcomponent_status_in_knowledge_view } from "./get_wcomponent_status_in_knowledge_view"
import { ComposedWcIdMapsObject, get_composed_wc_id_maps_object } from "../../state/derived/knowledge_views/get_composed_wc_id_maps_object"
import { get_foundational_knowledge_views } from "../../state/derived/knowledge_views/knowledge_views_derived_reducer"



interface OwnProps
{
    wcomponent_id: string
    editing_allowed: boolean
}


const map_state = (state: RootState, own_props: OwnProps) =>
{
    const { wcomponent_id } = own_props
    const current_knowledge_view = get_current_knowledge_view_from_state(state)

    const knowledge_view_entry = current_knowledge_view && current_knowledge_view.wc_id_map[wcomponent_id]
    const current_composed_knowledge_view = get_current_composed_knowledge_view_from_state(state)
    const composed_knowledge_view_entry = current_composed_knowledge_view && current_composed_knowledge_view.composed_wc_id_map[wcomponent_id]
    const middle_position = get_middle_of_screen(state)

    return {
        knowledge_view: current_knowledge_view,
        composed_knowledge_view_entry,
        knowledge_view_entry,
        middle_position_left: middle_position.left,
        middle_position_top: middle_position.top,
        knowledge_views_by_id: state.specialised_objects.knowledge_views_by_id,
        wcomponents_by_id: state.specialised_objects.wcomponents_by_id,
    }
}


const map_dispatch = {
    upsert_knowledge_view_entry: ACTIONS.specialised_object.upsert_knowledge_view_entry,
    bulk_remove_from_knowledge_view: ACTIONS.specialised_object.bulk_remove_from_knowledge_view,
}

const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps



function _WComponentKnowledgeViewForm (props: Props)
{
    const { wcomponent_id, knowledge_view, composed_knowledge_view_entry,
        knowledge_view_entry, editing_allowed,
        knowledge_views_by_id, wcomponents_by_id,
    } = props

    if (!knowledge_view) return null


    const knowledge_views_stack = get_foundational_knowledge_views(knowledge_view, knowledge_views_by_id, true)
    const composed_wc_id_maps_object = get_composed_wc_id_maps_object(knowledge_views_stack, wcomponents_by_id)
    const wcomponent_status_in_knowledge_view = get_wcomponent_status_in_knowledge_view(editing_allowed, wcomponent_id, knowledge_view, composed_wc_id_maps_object)
    const {
        show_wcomponent_status_in_this_kv_section,
        wcomponent_status_in_this_kv_text,

        show_add_button,
        add_button_text,

        show_remove_button,
        remove_button_text,
        remove_button_tooltip,

        show_remove_and_block_button,
        remove_and_block_button_text,
        remove_and_block_button_tooltip,
    } = wcomponent_status_in_knowledge_view


    function upsert_entry (knowledge_view_id: string, new_entry_partial: Partial<KnowledgeViewWComponentEntry> = {})
    {
        const new_entry: KnowledgeViewWComponentEntry = {
            ...(composed_knowledge_view_entry || { left: props.middle_position_left, top: props.middle_position_top }),
            ...new_entry_partial,
        }

        props.upsert_knowledge_view_entry({
            wcomponent_id,
            knowledge_view_id,
            entry: new_entry,
        })
    }


    const can_delete_frame = (knowledge_view_entry?.frame_width !== undefined && knowledge_view_entry?.frame_height !== undefined)

    return <div>
        {(editing_allowed && knowledge_view_entry && !knowledge_view_entry.blocked) && <FormControl variant="standard" component="fieldset" fullWidth={true} margin="normal">
                <FormLabel component="legend">Size</FormLabel>
                <Slider
                    color="secondary"
                    defaultValue={1}
                    marks
                    min={0.25} max={2}
                    onChange={(e: Event, val: number | number[]) =>
                    {
                        const size = Array.isArray(val) ? val[0] : val
                        upsert_entry(knowledge_view.id, { s: size })
                    }}
                    step={0.25}
                    value={knowledge_view_entry.s ? knowledge_view_entry.s : 1}
                    valueLabelDisplay="on"
                />
            </FormControl>
        }

        {(editing_allowed && knowledge_view_entry && !knowledge_view_entry.blocked) && <FormControl variant="standard" component="fieldset" fullWidth={true} margin="normal">
                <FormLabel component="legend">Frame</FormLabel>
                <p>
                    <Button
                        value={can_delete_frame ? "Remove Frame" : "Add Frame"}
                        onClick={() =>
                        {
                            const args: Partial<KnowledgeViewWComponentEntry> = {}

                            if (can_delete_frame)
                            {
                                args.frame_color = undefined
                                args.frame_width = undefined
                                args.frame_height = undefined
                            }
                            else
                            {
                                args.frame_color = args.frame_color ?? default_frame_color
                                args.frame_width = args.frame_width ?? (h_step + grid_small_step) * 2
                                args.frame_height = args.frame_height ?? (v_step + grid_small_step) * 2
                            }

                            upsert_entry(knowledge_view.id, args)
                        }}
                    />
                </p>

                {/* <p style={{ display: "inline-flex" }}>
                    <EditableNumber
                        placeholder="Frame Width"
                        value={knowledge_view_entry.frame_width}
                        allow_undefined={true}
                        conditional_on_change={frame_width =>
                        {
                            const args: Partial<KnowledgeViewWComponentEntry> = { frame_width }
                            if (frame_width !== undefined) args.frame_color = default_frame_color
                            upsert_entry(knowledge_view_id, args)
                        }}
                    /> &nbsp;
                    <EditableNumber
                        placeholder="Frame Height"
                        value={knowledge_view_entry.frame_height}
                        allow_undefined={true}
                        conditional_on_change={frame_height =>
                        {
                            const args: Partial<KnowledgeViewWComponentEntry> = { frame_height }
                            if (frame_height !== undefined) args.frame_color = default_frame_color
                            upsert_entry(knowledge_view_id, args)
                        }}
                    />
                </p> */}
                <span className="description_label">Frame Color</span>
                <ColorPicker
                    color={knowledge_view_entry.frame_color}
                    conditional_on_blur={frame_color =>
                    {
                        upsert_entry(knowledge_view.id, { frame_color })
                    }}
                />
            </FormControl>
        }

        {editing_allowed && <p>
            <AlignComponentForm wcomponent_id={wcomponent_id} />
            <br />
        </p>}

        <div style={{ display: "inline-flex" }}>
            <MoveToWComponentButton
                wcomponent_id={wcomponent_id}
                // Maybe this should be true but I find it confusing behaviour when ... <todo fill in scenario>
                //
                // Maybe this should be false but I find it confusing behaviour when the component is not in the
                // current knowledge view, and you can press the button anyway and get taken to some random point with
                // other components... but then you (obviously) can not find this component so a user will be
                // left thinking: "Why did the button work?"  "What am I meant to see here?"  "Is this component
                // present I am just missing it?"  "Is the component perhaps hidden by another component?"
                disable_if_not_present={true}
            />

            <Box zIndex={10} m={4} class="node_handle">
                <ExploreButtonHandle
                    wcomponent_id={wcomponent_id}
                    wcomponent_current_kv_entry={composed_knowledge_view_entry}
                    is_highlighted={true}
                />
            </Box>
        </div>

        {/* {knowledge_view_entry && !wcomponent_is_plain_connection(wcomponent) && <div>
            Position:
            <EditablePosition point={knowledge_view_entry} on_update={update} />
        </div>} */}

        {show_wcomponent_status_in_this_kv_section && <div>
            {wcomponent_status_in_this_kv_text}
            <br />
            {show_add_button && <Button
                value={add_button_text}
                extra_class_names="left"
                onClick={() => upsert_entry(knowledge_view.id, { blocked: undefined, passthrough: undefined })}
            />}
        </div>}


        {show_remove_button && <p>
            <ConfirmatoryDeleteButton
                button_text={remove_button_text}
                tooltip_text={remove_button_tooltip}
                on_delete={() =>
                {
                    props.bulk_remove_from_knowledge_view({
                        wcomponent_ids: [wcomponent_id],
                        remove_type: "passthrough",
                    })
                }}
            />
        </p>}


        {show_remove_and_block_button && <div>
            <ConfirmatoryDeleteButton
                button_text={remove_and_block_button_text}
                tooltip_text={remove_and_block_button_tooltip}
                on_delete={() =>
                {
                    props.bulk_remove_from_knowledge_view({
                        wcomponent_ids: [wcomponent_id],
                        remove_type: "block",
                    })
                }}
            />
        </div>}


        {editing_allowed && <p>
            Add to knowledge view
            <SelectKnowledgeView
                on_change={knowledge_view_id =>
                {
                    if (!knowledge_view_id) return

                    upsert_entry(knowledge_view_id, { blocked: undefined, passthrough: undefined })
                }}
            />
        </p>}


        <p>
            <WComponentPresenceInOtherKVs wcomponent_id={wcomponent_id} />
        </p>


        <p>
            <WComponentBackReferences wcomponent_id={wcomponent_id} />
        </p>
    </div>
}

export const WComponentKnowledgeViewForm = connector(_WComponentKnowledgeViewForm) as FunctionalComponent<OwnProps>
