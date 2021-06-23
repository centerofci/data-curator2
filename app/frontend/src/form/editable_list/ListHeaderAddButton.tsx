import { h } from "preact"
import { Button } from "../../sharedf/Button"

interface OwnProps {
    new_item_descriptor: string
    on_pointer_down_new_list_entry: () => void
}

export function ListHeaderAddButton (props: OwnProps)
{
    const {
        new_item_descriptor,
        on_pointer_down_new_list_entry
    } = props

    return (
        <Button onClick={on_pointer_down_new_list_entry}>
            {`New ${new_item_descriptor}`}
        </Button>
    )
}