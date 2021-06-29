import { h } from "preact"

import { EditableTextSingleLine } from "../form/editable_text/EditableTextSingleLine"
import { ExpandableListWithAddButton } from "../form/editable_list/ExpandableListWithAddButton"
import { factory_render_list_content } from "../form/editable_list/render_list_content"
import { KnowledgeView, KnowledgeViewSortType, knowledge_view_sort_types } from "../shared/wcomponent/interfaces/knowledge_view"
import { get_today_str } from "../shared/utils/date_helpers"
import { Link } from "../sharedf/Link"
import { create_new_knowledge_view } from "./create_new_knowledge_view"
import { FoundationKnowledgeViewsList } from "./FoundationKnowledgeViewsList"
import { optional_view_type } from "../views/optional_view_type"
import type { ViewType } from "../state/routing/interfaces"
import { EditableCheckbox } from "../form/EditableCheckbox"
import { AutocompleteText } from "../form/Autocomplete/AutocompleteText"
import { is_defined } from "../shared/utils/is_defined"
import { ExpandableList, ExpandedListStates } from "../form/editable_list/ExpandableList"
import { sentence_case } from "../shared/utils/sentence_case"
import type { KnowledgeViewListCoreProps } from "./interfaces"
import { KnowledgeViewListsSet } from "./KnowledgeViewListsSet"



interface OwnProps extends KnowledgeViewListCoreProps
{
    sort_type: KnowledgeViewSortType
}

export function KnowledgeViewList (props: OwnProps)
{
    const { parent_knowledge_view_id, knowledge_views, current_view, sort_type } = props


    if (!props.editing && knowledge_views.length === 0) return null


    const render_list_content = factory_render_list_content({
        items: knowledge_views,
        get_id: kv => kv.id,
        update_items: new_kvs =>
        {
            const changed_kv = new_kvs.find((new_kv, index) => knowledge_views[index] !== new_kv)
            if (!changed_kv) return

            props.upsert_knowledge_view(changed_kv)
        },

        item_top_props: {
            get_summary: factory_get_summary(current_view),
            get_details: factory_get_details(props),
            get_details3,
            calc_initial_custom_expansion_state: factory_calc_initial_custom_expansion_state(props),
        },

        debug_item_descriptor: "Knowledge View",
    })


    const expanded_initial_state = calc_expanded_initial_state(props)


    if (sort_type === "hidden" || sort_type === "archived")
    {
        return <ExpandableList
            items_count={knowledge_views.length}
            content={render_list_content}
            item_descriptor={sentence_case(sort_type) + " " + (props.item_descriptor || "Knowledge View")}
            disable_collapsed={false}
            expanded_initial_state={expanded_initial_state}
        />
    }


    const item_descriptor = (sort_type === "priority" ? "Priority " : "") + (props.item_descriptor || "Knowledge View")


    return <ExpandableListWithAddButton
        items_count={knowledge_views.length}
        on_click_new_item={() =>
        {
            create_new_knowledge_view({
                knowledge_view: {
                    title: make_default_title(),
                    parent_knowledge_view_id,
                    sort_type,
                },
                creation_context: props.creation_context,
            })
        }}
        content={render_list_content}
        item_descriptor={item_descriptor}
        disable_collapsed={true}
        expanded_initial_state={expanded_initial_state}
    />
}



function factory_get_summary (current_view: ViewType)
{
    const view = optional_view_type(current_view)

    return (knowledge_view: KnowledgeView, on_change: (new_kv: KnowledgeView) => void) => <Link
        route={undefined}
        sub_route={undefined}
        item_id={undefined}
        args={{ view, subview_id: knowledge_view.id }}
        selected_on={new Set(["route", "args.subview_id"])}
    >
        {get_knowledge_view_title(knowledge_view)}
    </Link>
}


function get_knowledge_view_title (knowledge_view: KnowledgeView)
{
    if (!knowledge_view.is_base) return knowledge_view.title
    return knowledge_view.title !== "Base"
        ? `Base (${knowledge_view.title})`
        : "Base"
}


const make_default_title = () => get_today_str(false)


const factory_get_details = (props: OwnProps) => (knowledge_view: KnowledgeView, on_change: (new_kv: KnowledgeView) => void) =>
{
    const { editing, nested_knowledge_view_ids } = props
    const nested_kv = nested_knowledge_view_ids.map[knowledge_view.id]
    const children = (nested_kv?.child_ids || []).map(id => props.knowledge_views_by_id[id])
        .filter(is_defined)

    return <div style={{ backgroundColor: "white", border: "thin solid #aaa", borderRadius: 3, padding: 5, margin: 5 }}>
        <p style={{ display: "inline-flex" }}>
            <span className="description_label">Title</span> &nbsp; <EditableTextSingleLine
                placeholder="Title..."
                value={knowledge_view.title}
                conditional_on_blur={new_title => {
                    const default_title = knowledge_view.is_base ? "Base" : make_default_title()
                    on_change({ ...knowledge_view, title: new_title || default_title })
                }}
            />
        </p>

        <div>
            <span className="description_label">Allow counterfactuals</span>
            <EditableCheckbox
                disabled={knowledge_view.is_base || !editing}
                value={knowledge_view.allows_assumptions}
                on_change={() =>
                {
                    const allows_assumptions = knowledge_view.allows_assumptions ? undefined : true
                    on_change({ ...knowledge_view, allows_assumptions })
                }}
            />
        </div>

        <p>
            <FoundationKnowledgeViewsList
                owner_knowledge_view={knowledge_view}
                on_change={foundation_knowledge_view_ids =>
                {
                    on_change({ ...knowledge_view, foundation_knowledge_view_ids })
                }}
            />
        </p>


        {(editing || nested_kv?.ERROR_is_circular) && <p>
            <span className="description_label">Nest under</span>

            {nested_kv?.ERROR_is_circular && <div style={{ backgroundColor: "pink" }}>
                Is circularly nested
            </div>}

            <AutocompleteText
                selected_option_id={knowledge_view.parent_knowledge_view_id}
                allow_none={true}
                options={props.possible_parent_knowledge_view_options.filter(({ id }) => id !== knowledge_view.id)}
                on_change={parent_knowledge_view_id =>
                {
                    on_change({ ...knowledge_view, parent_knowledge_view_id })
                }}
            />
        </p>}


        {editing && <p>
            <span className="description_label">Sort status</span>
            <AutocompleteText
                selected_option_id={knowledge_view.sort_type}
                options={knowledge_view_sort_types.map(type => ({ id: type, title: type }))}
                allow_none={false}
                on_change={sort_type => sort_type && on_change({ ...knowledge_view, sort_type })}
            />
        </p>}


        {(editing || children.length > 0) && <p>
            <KnowledgeViewListsSet
                {...props}
                parent_knowledge_view_id={knowledge_view.id}
                knowledge_views={children}
                item_descriptor="Nested"
            />
        </p>}


        <br />
    </div>
}



function get_details3 ()
{
    return <div><br /><br /></div>
}



function calc_expanded_initial_state (props: OwnProps): ExpandedListStates | undefined
{
    const { current_kv_parent_ids, knowledge_views, current_subview_id } = props

    const knowledge_views_contain_current_kv = !!knowledge_views.find(({ id }) =>
    {
        return (
            // this item in the list is the current knowledge view
            id === current_subview_id
            // this item in the list has the current knowledge view nested under it
            || current_kv_parent_ids.has(id)
        )
    })

    return knowledge_views_contain_current_kv ? ExpandedListStates.partial_expansion : undefined
}



function factory_calc_initial_custom_expansion_state (props: OwnProps)
{
    return (item: KnowledgeView) =>
    {
        return props.current_kv_parent_ids.has(item.id)
            // this item has the current knowledge view nested under it so expand it
            ? true
            : undefined
    }
}
