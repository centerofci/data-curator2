import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"
import Breadcrumbs from "@material-ui/core/Breadcrumbs"

import { AutocompleteText } from "../form/Autocomplete/AutocompleteText"
import { is_defined } from "../shared/utils/is_defined"
import { ACTIONS } from "../state/actions"
import type { NestedKnowledgeViewIdsEntry } from "../state/derived/State"
import type { ViewType } from "../state/routing/interfaces"
import type { RootState } from "../state/State"
import type { Color } from "../shared/interfaces"



const map_state = (state: RootState) =>
{
    const kv_id = state.routing.args.subview_id

    return {
        ready: state.sync.ready,
        presenting: state.display_options.consumption_formatting,
        view: state.routing.args.view,
        kv_id,
        nested_kv_ids_map: state.derived.nested_knowledge_view_ids,
    }
}

const map_dispatch = {
    toggle_consumption_formatting: ACTIONS.display.toggle_consumption_formatting,
    change_route: ACTIONS.routing.change_route,
}

const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector>



function navigate_view (event: h.JSX.TargetedEvent<HTMLSelectElement, Event>, props: Props)
{
    const select_el = event.currentTarget
    if (!select_el) return

    const view = select_el.value as ViewType
    props.change_route({ args: { view } })
}



function _ViewsBreadcrumb (props: Props)
{
    if (!props.ready) return null

    const { kv_id, nested_kv_ids_map } = props
    let nested_kv = nested_kv_ids_map.map[kv_id]

    const levels: { options: KnowledgeViewOption[], selected_id: string, allow_none: boolean }[] = []
    let deepest_level = true
    let last_parent_id = ""

    while (nested_kv)
    {
        const entries = nested_kv.child_ids
            .map(id => nested_kv_ids_map.map[id])
            .filter(is_defined)

        if (entries.length)
        {
            const options = entries.map(calc_if_is_hidden)

            levels.unshift({
                options,
                selected_id: last_parent_id,
                allow_none: deepest_level,
            })
        }
        deepest_level = false
        last_parent_id = nested_kv.id

        nested_kv = nested_kv.parent_id !== undefined ? nested_kv_ids_map.map[nested_kv.parent_id] : undefined
    }

    const top_level_options = nested_kv_ids_map.top_ids.map(id => nested_kv_ids_map.map[id])
        .filter(is_defined)
        .map(calc_if_is_hidden)
    levels.unshift({ options: top_level_options, selected_id: last_parent_id, allow_none: false  })

    return <Breadcrumbs aria-label="breadcrumb" style={{ margin: "auto 0 auto 10px" }}>
        <label>
            View Type:&nbsp;
            <select name="select_view" onChange={e => navigate_view(e, props) }>
                {view_options.map(opt =>
                    <option value={opt.id} selected={opt.id === props.view}>{opt.title}</option>
                )}
            </select>
        </label>
        {levels.map(level => <AutocompleteText
            allow_none={level.allow_none}
            selected_option_id={level.selected_id}
            options={level.options}
            on_change={subview_id => props.change_route({ args: { subview_id } })}
            on_choose_same={subview_id => props.change_route({ args: { subview_id } })}
            always_allow_editing={true}
        />
        )}
    </Breadcrumbs>
}

export const ViewsBreadcrumb = connector(_ViewsBreadcrumb) as FunctionalComponent<{}>



const view_options: { id: ViewType, title: string }[] = [
    { id: "knowledge", title: "Knowledge" },
    { id: "priorities", title: "Priorities" },
    { id: "priorities_list", title: "Priorities list" },
]



interface KnowledgeViewOption
{
    id: string
    title: string
    is_hidden: boolean
    color?: Color
}

function calc_if_is_hidden (entry: NestedKnowledgeViewIdsEntry): KnowledgeViewOption
{
    const is_hidden = entry.sort_type === "hidden" || entry.sort_type === "archived"
    const color = entry.ERROR_is_circular ? pink : undefined
    return { id: entry.id, title: entry.title, is_hidden, color }
}

const pink: Color = { r: 231, g: 190, b: 201, a: 1 }
