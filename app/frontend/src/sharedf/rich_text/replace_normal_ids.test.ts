import { test } from "../../shared/utils/test"
import { CreationContextState } from "../../state/creation_context/state"
import { uuid_v4_for_tests } from "../../utils/uuid_v4_for_tests"
import { prepare_new_wcomponent_object } from "../../wcomponent/CRUD_helpers/prepare_new_wcomponent_object"
import { WComponentsById } from "../../wcomponent/interfaces/SpecialisedObjects"
import { ReplaceNormalIdsInTextArgs } from "./interfaces"
import { get_double_at_mentioned_uuids_from_text, replace_normal_ids } from "./replace_normal_ids"



export function run_replace_normal_ids_tests ()
{
    test_replace_normal_ids()
    test_get_ids_from_text()
}


function test_replace_normal_ids ()
{
    console .group("running tests of replace_normal_ids")

    let input_text = ""
    let output_text = ""
    let expected_output_text = ""


    const id1 = uuid_v4_for_tests(1)
    const id9 = uuid_v4_for_tests(9)

    const creation_context: CreationContextState = {
        use_creation_context: false,
        creation_context: { label_ids: [] },
    }

    const wcomponents_by_id: WComponentsById = {
        [id1]: prepare_new_wcomponent_object({ base_id: -1, id: id1, title: `Title 1` }, creation_context),
        // [id9]: undefined, // id9 not added on purpose
    }


    console .group("render_links: true")
    let args: ReplaceNormalIdsInTextArgs = {
        wcomponents_by_id,
        depth_limit: 2,
        render_links: true,
        root_url: "http://datacurator.org",
        get_title: wc => wc.title,
    }

    input_text = ""
    expected_output_text = ""
    output_text = replace_normal_ids(input_text, 1, args)
    test(output_text, expected_output_text, "Should handle replacing ids in empty string")


    input_text = `Some text
with an @@id in
it: @@${id1}.
`
    expected_output_text = `Some text
with an @@id in
it: [Title 1](http://datacurator.org#wcomponents/10000000-0000-4000-a000-000000000000).
`
    output_text = replace_normal_ids(input_text, 1, args)
    test(output_text, expected_output_text, "Should replace id with component title")


    input_text = `An @@id to a component that's not found: @@${id9}.`
    expected_output_text = `An @@id to a component that's not found: ✗[@@90000000-0000-4000-a000-000000000000](http://datacurator.org#wcomponents/90000000-0000-4000-a000-000000000000) (not found).`
    output_text = replace_normal_ids(input_text, 1, args)
    test(output_text, expected_output_text, "Should handle missing components")


    input_text = `Out of depth @@${id1}.`
    expected_output_text = `Out of depth [@@10000000-0000-4000-a000-000000000000](http://datacurator.org#wcomponents/10000000-0000-4000-a000-000000000000).`
    output_text = replace_normal_ids(input_text, 2, args)
    test(output_text, expected_output_text, "Should not replace with component title when depth is exceeded")

    console .groupEnd()



    console .group("render_links: false")
    args = {
        wcomponents_by_id,
        depth_limit: 2,
        render_links: false,
        root_url: "http://datacurator.org",
        get_title: wc => wc.title,
    }

    input_text = `Some @@id: @@${id1}.`
    expected_output_text = `Some @@id: Title 1.`
    output_text = replace_normal_ids(input_text, 1, args)
    test(output_text, expected_output_text, "Should replace id with component title but no link when render_links is false")


    input_text = `An @@id to a component that's not found: @@${id9}.`
    expected_output_text = `An @@id to a component that's not found: ✗@@90000000-0000-4000-a000-000000000000 (not found).`
    output_text = replace_normal_ids(input_text, 1, args)
    test(output_text, expected_output_text, "Should handle missing components but not add link when render_links is false")


    input_text = `Out of depth @@${id1}.`
    expected_output_text = `Out of depth @@10000000-0000-4000-a000-000000000000.`
    output_text = replace_normal_ids(input_text, 2, args)
    test(output_text, expected_output_text, "Should not replace with component title when depth is exceeded and not add link when render_links is false")

    console .groupEnd()


    console .groupEnd()
}


function test_get_ids_from_text ()
{
    console .group("running tests of get_ids_from_text")

    let ids: string[] = []


    ids = get_double_at_mentioned_uuids_from_text("")
    test(ids, [], "Should find no IDs in empty string")


    ids = get_double_at_mentioned_uuids_from_text("asd @@wc123 asd name@example.com #label dfg @@345 sf")
    test(ids, [], `Should not find old ids of "wc123", "345"`)


    const id1 = uuid_v4_for_tests(1)
    const id2 = uuid_v4_for_tests(2)
    ids = get_double_at_mentioned_uuids_from_text(`asd @@${id1} asd name@example.com #label dfg @@${id2} sf`)
    test(ids, [id1, id2], `Should find uuid ids`)

    console .groupEnd()
}
