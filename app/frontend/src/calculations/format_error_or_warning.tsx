import { CSSProperties } from "preact/compat"

import { CalculationResult } from "./interfaces"
import { WarningTriangleV2 } from "../sharedf/WarningTriangleV2"



export interface CalculationErrorOrWarningMessage
{
    error_or_warning_message: string
    css: CSSProperties
}

export function get_error_or_warning_message(result: CalculationResult | undefined, common_css: CSSProperties = { display: "flex" }): CalculationErrorOrWarningMessage
{
    const css: CSSProperties = { ...common_css }

    let error_or_warning_message = ""

    if (result?.error) {
        // css.color = "red"
        error_or_warning_message = `Error: ${result.error}`
    }

    if (result?.warning) {

        if (result.error) error_or_warning_message += "\n----\n"
        else css.color = "lightgrey"

        error_or_warning_message += `Warning: ${result.warning}`
    }

    // error_or_warning_message = replace_ids_in_text({
    //     text: error_or_warning_message,
    //     text_type: RichTextType.rich,
    //     ...args,
    // })

    return { error_or_warning_message, css }
}


export function FormatCalculationErrorOrWarning (props: CalculationErrorOrWarningMessage)
{
    const { error_or_warning_message, css } = props

    return <div style={{
        ...css,
        maxHeight: error_or_warning_message.length ? 100 : 0,
        transition: "max-height 1s ease 0s",
    }}>
        <WarningTriangleV2 warning={error_or_warning_message} always_display={true} />
    </div>
}
