import Markdown from "markdown-to-jsx"
import { FunctionalComponent, h } from "preact"
import { useState } from "preact/hooks"
import { connect, ConnectedProps } from "react-redux"
import { Box, makeStyles } from "@material-ui/core"

import "./WComponentCanvasNode.css"
import {
    connection_terminal_attributes,
    connection_terminal_directions,
    WComponent,
    wcomponent_can_have_validity_predictions,
    wcomponent_has_legitimate_non_empty_state_VAP_sets,
    wcomponent_has_validity_predictions,
    wcomponent_is_action,
    wcomponent_is_goal,
    wcomponent_is_judgement_or_objective,
    wcomponent_is_statev2,
    wcomponent_is_sub_state,
    wcomponent_should_have_state_VAP_sets,
} from "../../wcomponent/interfaces/SpecialisedObjects"
import { ConnectableCanvasNode } from "../../canvas/ConnectableCanvasNode"
import { Terminal, get_top_left_for_terminal_type } from "../../canvas/connections/terminal"
import type { CanvasPoint } from "../../canvas/interfaces"
import { round_canvas_point } from "../../canvas/position_utils"
import { SCALE_BY } from "../../canvas/zoom_utils"
import { LabelsListV2 } from "../../labels/LabelsListV2"
import type { KnowledgeViewWComponentEntry } from "../../shared/interfaces/knowledge_view"
import { get_title } from "../../wcomponent_derived/rich_text/get_rich_text"
import { wcomponent_type_to_text } from "../../wcomponent_derived/wcomponent_type_to_text"
import { MARKDOWN_OPTIONS } from "../../sharedf/RichMarkDown"
import { WarningTriangle } from "../../sharedf/WarningTriangle"
import { ACTIONS } from "../../state/actions"
import { is_on_current_knowledge_view, get_wcomponent_from_state } from "../../state/specialised_objects/accessors"
import type { RootState } from "../../state/State"
import { get_store } from "../../state/store"
import { calc_wcomponent_should_display, calc_display_opacity } from "../calc_should_display"
import { factory_on_pointer_down } from "../canvas_common"
import { WComponentJudgements } from "./WComponentJudgements"
import { NodeValueAndPredictionSetSummary } from "./NodeValueAndPredictionSetSummary"
import { WComponentValidityValue } from "./WComponentValidityValue"
import { Handles } from "./Handles"
import { NodeSubStateSummary } from "./NodeSubStateSummary"
import { get_wc_id_to_counterfactuals_v2_map } from "../../state/derived/accessor"
import { NodeSubStateTypeIndicators } from "./NodeSubStateTypeIndicators"



interface OwnProps
{
    id: string
    on_graph?: boolean
}



const map_state = (state: RootState, own_props: OwnProps) =>
{
    const shift_or_control_keys_are_down = state.global_keys.derived.shift_or_control_down

    const on_current_knowledge_view = is_on_current_knowledge_view(state, own_props.id)
    const { current_composed_knowledge_view } = state.derived


    const wc_id_map = current_composed_knowledge_view?.composed_wc_id_map || {}
    const judgement_or_objective_ids = [
        ...(state.derived.judgement_or_objective_ids_by_target_id[own_props.id] || []),
        ...(state.derived.judgement_or_objective_ids_by_goal_id[own_props.id] || []),
    ]
    .filter(id => !!wc_id_map[id])


    return {
        force_displaying: state.filter_context.force_display,
        on_current_knowledge_view,
        current_composed_knowledge_view,
        wcomponent: get_wcomponent_from_state(state, own_props.id),
        wc_id_to_counterfactuals_map: get_wc_id_to_counterfactuals_v2_map(state),
        wcomponents_by_id: state.specialised_objects.wcomponents_by_id,
        is_current_item: state.routing.item_id === own_props.id,
        is_selected: state.meta_wcomponents.selected_wcomponent_ids_set.has(own_props.id),
        is_highlighted: state.meta_wcomponents.highlighted_wcomponent_ids.has(own_props.id),
        shift_or_control_keys_are_down,
        created_at_ms: state.routing.args.created_at_ms,
        sim_ms: state.routing.args.sim_ms,
        is_editing: !state.display_options.consumption_formatting,
        validity_filter: state.display_options.derived_validity_filter,
        certainty_formatting: state.display_options.derived_certainty_formatting,
        focused_mode: state.display_options.focused_mode,
        have_judgements: judgement_or_objective_ids.length > 0,
    }
}



const map_dispatch = {
    clicked_wcomponent: ACTIONS.specialised_object.clicked_wcomponent,
    clear_selected_wcomponents: ACTIONS.specialised_object.clear_selected_wcomponents,
    change_route: ACTIONS.routing.change_route,
    set_highlighted_wcomponent: ACTIONS.specialised_object.set_highlighted_wcomponent,
    upsert_knowledge_view_entry: ACTIONS.specialised_object.upsert_knowledge_view_entry,
    pointerupdown_on_connection_terminal: ACTIONS.specialised_object.pointerupdown_on_connection_terminal,
}


const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps


function _WComponentCanvasNode (props: Props)
{
    const [node_is_moving, set_node_is_moving] = useState<boolean>(false)

    const {
        id, on_graph = true,
        force_displaying,
        is_editing,
        current_composed_knowledge_view: composed_kv, wcomponent, wc_id_to_counterfactuals_map, wcomponents_by_id,
        is_current_item, is_selected, is_highlighted,
        shift_or_control_keys_are_down,
        created_at_ms, sim_ms, validity_filter, certainty_formatting,
        clicked_wcomponent, clear_selected_wcomponents,
    } = props
    const { change_route, set_highlighted_wcomponent } = props

    if (!composed_kv) return <div>No current knowledge view</div>
    if (!wcomponent) return <div>Could not find component of id {id}</div>


    let kv_entry_maybe = composed_kv.composed_wc_id_map[id]
    if (!kv_entry_maybe && on_graph) return <div>Could not find knowledge view entry for id {id}</div>
    // Provide a default kv_entry value for when this node is being in a different context e.g.
    // when prioritisation nodes are being rendered on the Priorities list
    const kv_entry = kv_entry_maybe || { left: 0, top: 0 }
    if (kv_entry.deleted) return null


    const { wc_ids_excluded_by_filters } = composed_kv.filters
    const validity_value = calc_wcomponent_should_display({
        is_editing, force_displaying, is_selected, wcomponent, created_at_ms, sim_ms, validity_filter, wc_ids_excluded_by_filters,
    })
    if (!validity_value) return null


    const validity_opacity = calc_display_opacity({
        is_editing,
        certainty: validity_value.display_certainty,
        is_highlighted,
        is_selected,
        is_current_item,
        certainty_formatting,
        focused_mode: props.focused_mode,
    })


    const on_pointer_down = factory_on_pointer_down({
        wcomponent_id: id,
        clicked_wcomponent,
        clear_selected_wcomponents,
        shift_or_control_keys_are_down,
        change_route,
        is_current_item,
    })


    const update_position = (new_position: CanvasPoint) =>
    {
        const new_entry: KnowledgeViewWComponentEntry = {
            ...kv_entry,
            ...new_position,
        }
        props.upsert_knowledge_view_entry({
            wcomponent_id: props.id,
            knowledge_view_id: composed_kv.id,
            entry: new_entry,
        })

        set_node_is_moving(false)
        return
    }


    const children: h.JSX.Element[] = [
        <Handles
            set_node_is_moving={(!on_graph || !is_editing || !is_highlighted) ? undefined : (() => set_node_is_moving(true))}
            wcomponent_id={wcomponent.id}
            wcomponent_current_kv_entry={kv_entry}
            is_highlighted={is_highlighted}
        />
    ]


    const title = get_title({ wcomponent, rich_text: true, wcomponents_by_id, wc_id_to_counterfactuals_map, created_at_ms, sim_ms })


    const show_all_details = is_editing || is_current_item

    const use_styles = makeStyles(theme => ({
        sizer: {
            transform: `scale(${kv_entry.s ? kv_entry.s : 1 })`,
            // @NOTE: The transformOrigin defaults to center center (50% 50%), but this may not be
            // best for determining position of connectors, values can be set
            // with keywords left/right/center or top/center/bottom
            // or percents, and the order is x-axis, y-axis

            // transformOrigin: "center center"
            transformOrigin: "left top",
        }
    }))
    const classes = use_styles()
    const extra_css_class = (
        ` wcomponent_canvas_node `
        + (is_editing ? (props.on_current_knowledge_view ? " node_on_kv " : " node_on_foundational_kv ") : "")
        + (node_is_moving ? " node_is_moving " : "")
        + (is_highlighted ? " node_is_highlighted " : "")
        + (is_current_item ? " node_is_current_item " : "")
        + (is_selected ? " node_is_selected " : "")
        + ` node_is_type_${wcomponent.type} `
        + (show_all_details ? " compact_title " : "") + classes.sizer
    )
    const glow = is_highlighted ? "orange" : ((is_selected || is_current_item) && "blue")
    const color = get_wcomponent_color(wcomponent)


    const show_validity_value = (wcomponent_can_have_validity_predictions(wcomponent) && is_editing) || (wcomponent_has_validity_predictions(wcomponent) && is_current_item)
    const show_state_value = (is_editing && wcomponent_should_have_state_VAP_sets(wcomponent))
        || wcomponent_has_legitimate_non_empty_state_VAP_sets(wcomponent)
        || wcomponent_is_judgement_or_objective(wcomponent)
        || (wcomponent_is_goal(wcomponent) && wcomponent.objective_ids.length > 0)
        // || is_highlighted
        // || is_current_item
        || props.have_judgements
    const sub_state_wcomponent = wcomponent_is_sub_state(wcomponent) && wcomponent

    const terminals = get_terminals({ on_graph, is_editing, is_highlighted })

    const show_judgements_when_no_state_values = (wcomponent_is_statev2(wcomponent) && (!wcomponent.values_and_prediction_sets || wcomponent.values_and_prediction_sets.length === 0))


    return <ConnectableCanvasNode
        position={on_graph ? kv_entry : undefined}
        cover_image={wcomponent.summary_image}
        node_main_content={<div>
            <img className={"background_image " + wcomponent.type} />

            <div className="node_title">
                {kv_entry_maybe === undefined && <span>
                    <WarningTriangle message="Missing from this knowledge view" />
                    &nbsp;
                </span>}
                {(is_editing || !wcomponent.hide_title) && <Markdown options={{ ...MARKDOWN_OPTIONS, forceInline: true }}>{title}</Markdown>}
            </div>

            {show_validity_value && <div className="node_validity_container">
                {is_editing && <div className="description_label">validity</div>}
                <WComponentValidityValue wcomponent={wcomponent} />
            </div>}

            {show_state_value && <Box display="flex" maxWidth="100%" overflow="hidden">
                {is_editing && <Box pr={2}>state</Box>}
                {show_judgements_when_no_state_values && <WComponentJudgements wcomponent={wcomponent} />}
                <Box flexGrow={1} flexShrink={1} overflow="hidden">
                    <NodeValueAndPredictionSetSummary
                        wcomponent={wcomponent}
                        created_at_ms={created_at_ms}
                        sim_ms={sim_ms}
                    />
                </Box>
            </Box>}

            {sub_state_wcomponent && <Box display="flex" maxWidth="100%" overflow="hidden">
                <Box flexGrow={1} flexShrink={1} overflow="hidden">
                    <NodeSubStateSummary
                        wcomponent={sub_state_wcomponent}
                        created_at_ms={created_at_ms}
                        sim_ms={sim_ms}
                    />
                </Box>
            </Box>}

            {sub_state_wcomponent && <NodeSubStateTypeIndicators wcomponent={sub_state_wcomponent} />}

            {is_editing && <div className="description_label">
                {wcomponent_type_to_text(wcomponent.type)}
            </div>}

            <LabelsListV2 label_ids={wcomponent.label_ids} />
        </div>}
        extra_css_class={extra_css_class}
        opacity={validity_opacity}
        unlimited_width={false}
        glow={glow}
        color={color}
        on_pointer_down={on_pointer_down}
        on_pointer_enter={() => set_highlighted_wcomponent({ id, highlighted: true })}
        on_pointer_leave={() => set_highlighted_wcomponent({ id, highlighted: false })}
        terminals={terminals}
        pointerupdown_on_connection_terminal={(connection_location, up_down) => props.pointerupdown_on_connection_terminal({ terminal_type: connection_location, up_down, wcomponent_id: id })}
        extra_args={{
            // draggable: node_allowed_to_move && node_is_moving,
            draggable: node_is_moving,
            onDragStart: e =>
            {
                // Prevent green circle with white cross "copy / add" cursor icon
                // https://stackoverflow.com/a/56699962/539490
                e.dataTransfer!.dropEffect = "move"
            },

            onDragEnd: e => {
                const store = get_store()
                const zoom = store.getState().routing.args.zoom
                const scale = zoom / SCALE_BY
                const top_fudge = -8 * (scale / 2)
                const left_fudge = 6 / (scale / 2)
                // maybe explore using e.currentTarget.offsetLeft?
                const node_size_fudge = (kv_entry.s || 1)
                const top = kv_entry.top + (e.offsetY * node_size_fudge) + top_fudge
                const left = kv_entry.left + (e.offsetX * node_size_fudge) + left_fudge
                // console .log(`${kv_entry.top} ${e.offsetY} ${e.y}  =  ${top}`);
                // console .log(`${kv_entry.left} ${e.offsetX} ${e.x} =  ${left}`);
                update_position(round_canvas_point({
                    top: top,
                    left: left,
                }))
            }
        }}
        other_children={children}
    />
}

export const WComponentCanvasNode = connector(_WComponentCanvasNode) as FunctionalComponent<OwnProps>



const no_terminals: Terminal[] = []
const terminals_with_label: Terminal[] = []

connection_terminal_attributes.forEach(attribute =>
{
    connection_terminal_directions.forEach(direction =>
    {
        const type = { attribute, direction }
        const connection_style: h.JSX.CSSProperties = get_top_left_for_terminal_type(type)
        const label = type.attribute.slice(0, 1).toUpperCase()

        terminals_with_label.push({ type, style: connection_style, label })
    })
})



function get_terminals (args: { on_graph: boolean; is_editing: boolean; is_highlighted: boolean })
{
    if (!args.on_graph) return no_terminals
    if (!args.is_editing) return no_terminals
    if (!args.is_highlighted) return no_terminals

    return terminals_with_label
}



function get_wcomponent_color (wcomponent: WComponent)
{
    return wcomponent_is_action(wcomponent) ? "rgb(255, 238, 198)"
        : ((wcomponent_is_goal(wcomponent)
        // || wcomponent_is_judgement_or_objective(wcomponent)
        ) ? "rgb(207, 255, 198)" : "")
}