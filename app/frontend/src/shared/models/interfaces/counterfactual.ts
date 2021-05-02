import type { Base } from "./base"



export interface CounterfactualLayer extends Base
{
    title: string
    description: string
    inherits_from_id?: string
}


// export interface UINestedCounterfactualLayer extends CounterfactualLayer
// {
//     child_layers: CounterfactualLayer[]
// }
