import { h } from "preact"

import { Button } from "../sharedf/Button"
import {
    conditionally_expand_selected_components,
    conditionally_contract_selected_components,
    conditionally_select_all_components,
    conditionally_select_forward_causal_components,
    conditionally_select_source_causal_components,
    conditionally_select_interconnections,
} from "../state/specialised_objects/meta_wcomponents/selecting/helpers"
import { get_store } from "../state/store"



export function SelectionControlSidePanel (props: {})
{
    const store = get_store()

    return <div className="side_panel">
        <h3>Selection</h3>


        <p className="section">
            <Button
                value="Expand towards causes (backwards)"
                fullWidth={true}
                onClick={() => conditionally_select_source_causal_components(store)}
            />

            <div className="description">ctrl + s + c</div>
        </p>


        <p className="section">
            <Button
                value="Expand towards effects (forwards)"
                fullWidth={true}
                onClick={() => conditionally_select_forward_causal_components(store)}
            />

            <div className="description">ctrl + s + f</div>
        </p>


        <p className="section">
            <Button
                value="Select all components"
                fullWidth={true}
                onClick={() => conditionally_select_all_components(store)}
            />

            <div className="description">ctrl + a</div>
        </p>


        <p className="section">
            <Button
                value="Expand selection (in all directions)"
                fullWidth={true}
                onClick={() => conditionally_expand_selected_components(store)}
            />

            <div className="description">ctrl + s + e</div>
        </p>


        <p className="section">
            <Button
                value="Contract selection (in all directions)"
                fullWidth={true}
                onClick={() => conditionally_contract_selected_components(store)}
            />

            <div className="description">ctrl + s + d</div>
        </p>


        <p className="section">
            <Button
                value="Select components inbetween"
                fullWidth={true}
                onClick={() => conditionally_select_interconnections(store)}
            />

            <div className="description">ctrl + s + i</div>
        </p>
    </div>
}