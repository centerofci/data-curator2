import { test } from "../utils/test"
import type { Base } from "../wcomponent/interfaces/base"
import { Tense } from "../wcomponent/interfaces/datetime"
import type { HasUncertainDatetime } from "../uncertainty/uncertainty"
import { get_uncertain_datetime } from "../uncertainty/datetime"
import { get_tense_of_uncertain_datetime } from "./get_tense_of_uncertain_datetime"



export function get_created_at_datetime (obj: { created_at: Date, custom_created_at?: Date }): Date
{
    return obj.custom_created_at || obj.created_at
}


export function get_created_at_ms (obj: { created_at: Date, custom_created_at?: Date }): number
{
    return get_created_at_datetime(obj).getTime()
}



export function get_sim_datetime (item: HasUncertainDatetime)
{
    return get_uncertain_datetime(item.datetime)
}

export function get_sim_datetime_ms (item: HasUncertainDatetime)
{
    const dt = get_sim_datetime(item)
    return dt === undefined ? undefined : dt.getTime()
}





interface PartitionItemsByCreatedAtDatetimeArgs<U>
{
    items: U[]
    created_at_ms: number
}
interface PartitionItemsByCreatedAtDatetimeReturn<U>
{
    invalid_future_items: U[]
    current_items: U[]
}
export function partition_items_by_created_at_datetime <U extends Base> (args: PartitionItemsByCreatedAtDatetimeArgs<U>): PartitionItemsByCreatedAtDatetimeReturn<U>
{
    const { items, created_at_ms } = args

    const invalid_future_items: U[] = []
    const current_items: U[] = []


    items.forEach(item =>
    {
        if (get_created_at_ms(item) > created_at_ms)
        {
            invalid_future_items.push(item)
        }
        else
        {
            current_items.push(item)
        }
    })


    return { invalid_future_items, current_items }
}



interface PartitionItemsByDatetimeArgs<U>
{
    items: U[]
    sim_ms: number
}
interface PartitionItemsByDatetimeReturn<U>
{
    past_items: U[]
    present_items: U[]
    future_items: U[]
}
export function partition_items_by_datetimes <U extends Base & HasUncertainDatetime> (args: PartitionItemsByDatetimeArgs<U>): PartitionItemsByDatetimeReturn<U>
{
    const { items, sim_ms } = args

    const past_items: U[] = []
    const present_items: U[] = []
    const future_items: U[] = []


    items.forEach(item =>
    {
        const tense = get_tense_of_uncertain_datetime(item, sim_ms)

        if (tense === Tense.past) past_items.push(item)
        else if (tense === Tense.future) future_items.push(item)
        else present_items.push(item)
    })


    return { past_items, present_items, future_items }
}



function test_partition_items_by_created_at_datetime ()
{
    console .log("running tests of partition_items_by_created_at_datetime")

    interface Simple extends Base {}

    function ids_partition_items_by_created_at_datetime (args: PartitionItemsByCreatedAtDatetimeArgs<Simple>): PartitionItemsByCreatedAtDatetimeReturn<string>
    {
        const result = partition_items_by_created_at_datetime(args)
        return {
            invalid_future_items: result.invalid_future_items.map(({ id }) => id),
            current_items: result.current_items.map(({ id }) => id),
        }
    }

    let items: Simple[]
    let result: PartitionItemsByCreatedAtDatetimeReturn<string>

    const date0 = new Date("2021-04-01 00:00")
    const date0_ms = date0.getTime()
    const date1 = new Date("2021-04-01 00:01")
    const date1_ms = date1.getTime()
    const date2 = new Date("2021-04-01 00:02")
    const date2_ms = date2.getTime()
    const date3 = new Date("2021-04-01 00:03")
    const date3_ms = date3.getTime()

    const c1: Simple = { id: "1", created_at: date1 }
    const c2: Simple = { id: "2", created_at: date2 }

    items = []
    result = ids_partition_items_by_created_at_datetime({ items, created_at_ms: date3_ms })
    test(result, {
        invalid_future_items: [],
        current_items: [],
    })

    items = [c1, c2]
    result = ids_partition_items_by_created_at_datetime({ items, created_at_ms: date3_ms })
    test(result, {
        invalid_future_items: [],
        current_items: [c1.id, c2.id],
    })

    result = ids_partition_items_by_created_at_datetime({ items, created_at_ms: date2_ms })
    test(result, {
        invalid_future_items: [],
        current_items: [c1.id, c2.id],
    })

    result = ids_partition_items_by_created_at_datetime({ items, created_at_ms: date1_ms })
    test(result, {
        invalid_future_items: [c2.id],
        current_items: [c1.id],
    })

    result = ids_partition_items_by_created_at_datetime({ items, created_at_ms: date0_ms })
    test(result, {
        invalid_future_items: [c1.id, c2.id],
        current_items: [],
    })
}



function test_partition_items_by_datetimes ()
{
    console .log("running tests of partition_items_by_datetimes")

    interface Simple extends Base, HasUncertainDatetime {}

    function ids_partition_items_by_datetimes (args: PartitionItemsByDatetimeArgs<Simple>): PartitionItemsByDatetimeReturn<string>
    {
        const result = partition_items_by_datetimes(args)
        return {
            past_items: result.past_items.map(({ id }) => id),
            present_items: result.present_items.map(({ id }) => id),
            future_items: result.future_items.map(({ id }) => id),
        }
    }


    let items: Simple[]
    let result: PartitionItemsByDatetimeReturn<string>

    const date0 = new Date("2021-04-01 00:00")
    const date0_ms = date0.getTime()
    const date1 = new Date("2021-04-01 00:01")
    const date1_ms = date1.getTime()
    const date2 = new Date("2021-04-01 00:02")
    const date2_ms = date2.getTime()
    const date3 = new Date("2021-04-01 00:03")
    const date3_ms = date3.getTime()

    const s1 = { id: "1", created_at: date1, datetime: { value: date1 } }
    const s2 = { id: "2", created_at: date1, datetime: { value: date2 } }
    const s_eternal = { id: "5", created_at: date2, datetime: {} }

    items = []
    result = ids_partition_items_by_datetimes({ items, sim_ms: date3_ms })
    test(result, {
        past_items: [],
        present_items: [],
        future_items: [],
    })

    items = [s1, s2, s_eternal]
    result = ids_partition_items_by_datetimes({ items, sim_ms: date3_ms })
    test(result, {
        past_items: [s1.id, s2.id],
        present_items: [s_eternal.id],
        future_items: [],
    })

    result = ids_partition_items_by_datetimes({ items, sim_ms: date2_ms })
    test(result, {
        past_items: [s1.id],
        present_items: [s2.id, s_eternal.id],
        future_items: [],
    })

    result = ids_partition_items_by_datetimes({ items, sim_ms: date1_ms })
    test(result, {
        past_items: [],
        present_items: [s1.id, s_eternal.id],
        future_items: [s2.id],
    })

    result = ids_partition_items_by_datetimes({ items, sim_ms: date0_ms })
    test(result, {
        past_items: [],
        present_items: [s_eternal.id],
        future_items: [s1.id, s2.id],
    })
}



function run_tests ()
{
    test_partition_items_by_created_at_datetime()
    test_partition_items_by_datetimes()
}

// run_tests()
