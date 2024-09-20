import { Model, ModelVariableConfig, SimulationError } from "simulation"

import { WComponentsById } from "../wcomponent/interfaces/SpecialisedObjects"
import { CalculationResult, PlainCalculationObject } from "./interfaces"
import { normalise_calculation_ids } from "./normalise_calculation_ids"
import { get_wcomponent_state_value_and_probabilities } from "../wcomponent_derived/get_wcomponent_state_value_and_probabilities"
import { get_double_at_mentioned_uuids_from_text } from "../sharedf/rich_text/replace_normal_ids"
import { normalise_calculation_numbers } from "./normalise_calculation_numbers"
import { convert_percentages } from "./convert_percentages"
import { hide_currency_symbols, unhide_currency_symbols } from "./hide_currency_symbols"
import { apply_units_from_component } from "./apply_units_from_component"



export function perform_calculations (calculations: PlainCalculationObject[], wcomponents_by_id: WComponentsById)
{
    const values: { [id: string]: CalculationResult } = {}

    const calculation_results: CalculationResult[] = calculations.map(calculation =>
    {
        const model = new Model({
            timeStart: 2020,
            timeLength: 1,
            timeUnits: "Years"
        })

        const uuid_v4s = get_double_at_mentioned_uuids_from_text(calculation.value)
        let converted_calculation = normalise_calculation_numbers(calculation.value)
        converted_calculation = convert_percentages(converted_calculation)
        converted_calculation = hide_currency_symbols(converted_calculation)

        let units: string | undefined = calculation.units
        units = apply_units_from_component(converted_calculation, units, wcomponents_by_id)
        units = hide_currency_symbols(units || "")

        converted_calculation = normalise_calculation_ids(converted_calculation, uuid_v4s)

        const model_config: ModelVariableConfig = {
            name: calculation.name,
            value: converted_calculation,
        }
        if (units !== undefined) model_config.units = units
        const model_component = model.Variable(model_config)

        const warnings = prepare_other_components(model, model_component, values, uuid_v4s, wcomponents_by_id)

        const calculation_result = run_model(model, calculation.units, model_component)
        if (warnings.length) calculation_result.warning = warnings.join(" ")

        // Store calculation value for use in future calculations
        values[calculation.name] = calculation_result

        return calculation_result
    })
    .map(calculation_result =>
    {
        calculation_result.units = unhide_currency_symbols(calculation_result.units)
        if (calculation_result.error)
        {
            calculation_result.error = unhide_currency_symbols(calculation_result.error)
        }

        return calculation_result
    })

    return calculation_results
}



function prepare_other_components (model: Model, model_component: SimulationComponent, values: { [id: string]: CalculationResult }, uuids: string[], wcomponents_by_id: WComponentsById): string[]
{
    const other_components: { [id: string]: SimulationComponent } = {}

    Object.entries(values).forEach(([name, calc_result]) =>
    {
        if (calc_result.value !== undefined) {
            const component = model.Variable({ name, value: calc_result.value, units: calc_result.units })
            other_components[name] = component
        }
    })

    const now_ms = new Date().getTime()
    const warnings: string[] = []

    const unsuccessfully_mapped_uuids: string[] = uuids.map(uuid =>
    {
        const wcomponent = wcomponents_by_id[uuid]
        if (!wcomponent)
        {
            // TODO make this into an error instead of a warning?
            warnings.push(`Could not find wcomponent with id: @@${uuid}.  Defaulting to value of 1.`)
            return uuid
        }

        const { most_probable_VAP_set_values: VAP_sets, not_allowed_VAP_set_values } = get_wcomponent_state_value_and_probabilities({
            wcomponent,
            VAP_set_id_to_counterfactual_v2_map: {},
            created_at_ms: now_ms,
            sim_ms: now_ms,
        })

        if (wcomponent.type === "action" || not_allowed_VAP_set_values)
        {
            warnings.push(`The wcomponent @@${uuid} is of type "${wcomponent.type}".  Defaulting to value of 1.`)
            return uuid
        }

        if (VAP_sets.length === 0)
        {
            warnings.push(`The wcomponent @@${uuid} is missing any value and prediction sets.  Defaulting to value of 1.`)
            return uuid
        }

        let value = VAP_sets[0]!.parsed_value

        if (value === null)
        {
            warnings.push(`The wcomponent @@${uuid} has an invalid number "${VAP_sets[0]!.original_value}".  Defaulting to value of 1.`)
            return uuid
        }

        if (Number.isNaN(value))
        {
            warnings.push(`The wcomponent @@${uuid} has an invalid number "${VAP_sets[0]!.original_value}".  Defaulting to value of 1.`)
            return uuid
        }

        // Note that the value of boolean's string of "True" or "False" has
        // already been converted to a boolean
        if (typeof value === "boolean") value = value ? 1 : 0

        const component = model.Variable({ name: uuid, value, units: "" })
        other_components[uuid] = component

        // Return an empty string as type guard to ensure `string[]` by filtering
        // out `undefined` is not working
        return ""
    }).filter(uuid => uuid.length > 0)

    unsuccessfully_mapped_uuids.forEach(uuid =>
    {
        const component = model.Variable({ name: uuid, value: 1, units: "" })
        other_components[uuid] = component
    })

    Object.values(other_components).forEach((other_component) =>
    {
        model.Link(other_component, model_component)
    })

    return warnings
}



function run_model (model: Model, initial_units: string | undefined, model_component: SimulationComponent, retrying_with_units = false): CalculationResult
{
    let value: number | undefined = undefined
    let error = ""
    let units = model_component._node.getAttribute("Units")

    try {
        const calculation_result = model.simulate()
        value = calculation_result!._data.data[0]![model_component!._node.id]
    }
    catch (e) {
        const err = e as SimulationError
        const units_error = (typeof err.message === "string") && err.message.startsWith("Wrong units generated for") && err.message.match(/and got (.+?)\.(?:$| Either)/)
        // If no units were initially specified and the error is about wrong
        // units then try to recompute using the units the model expects
        if (!initial_units && units_error && !retrying_with_units)
        {
            units = units_error[1]!
            model_component.units = units
            const second_attempt = run_model(model, initial_units, model_component, true)
            ;({ value, units } = second_attempt)
            if (second_attempt.error) error = second_attempt.error
        }
        else
        {
            // Defensive approach to ensure there's always some content in the
            // error in case err.message is ever undefined or an empty string
            error = `${err.message || "Unknown calculation error"}`
        }
    }

    const calculation_result: CalculationResult = { value, error, units }
    if (!calculation_result.error) delete calculation_result.error
    if (calculation_result.units === "Unitless") calculation_result.units = ""

    return calculation_result
}
