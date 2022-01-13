import { h } from "preact"
import TrendingUpIcon from "@material-ui/icons/TrendingUp"
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat"
import TrendingDownIcon from "@material-ui/icons/TrendingDown"
import { QuestionMarkIcon } from "../../sharedf/icons/QuestionMarkIcon"

import "./JudgementBadge.scss"
import type { JudgementValue } from "./calculate_judgement_value"
import { Link } from "../Link"
import type { CanvasPoint } from "../../canvas/interfaces"
import { lefttop_to_xy } from "../../state/display_options/display"
import type { RoutingStateArgs } from "../../state/routing/interfaces"
import type { JudgementTrend } from "../../wcomponent/interfaces/judgement"



interface OwnProps
{
    judgement: JudgementValue
    judgement_trend_manual: JudgementTrend | undefined
    judgement_or_objective_id?: string
    position?: CanvasPoint
    size: "small" | "medium"
}

// Refactor this to be hidden inside JudgementBadgeConnected?
export function JudgementBadge (props: OwnProps)
{
    const { judgement, judgement_trend_manual, size } = props
    const judgement_type = judgement ? "positive" : judgement === undefined ? "inactive" : "negative"
    const class_name = `judgement_badge ${size} ${judgement_type} ${judgement_trend_manual ?? ""}`

    const trend_icon = judgement_trend_manual === "improving" ? <TrendingUpIcon />
        : judgement_trend_manual === "stable" ? <TrendingFlatIcon />
        : judgement_trend_manual === "worsening" ? <TrendingDownIcon />
        : judgement_trend_manual === "unknown" ? <QuestionMarkIcon /> : <span />


    if (!props.judgement_or_objective_id) return <div className={class_name}>{trend_icon}</div>


    let args: Partial<RoutingStateArgs> | undefined = undefined
    if (props.position) args = lefttop_to_xy({ ...props.position, zoom: 100 }, true)


    return <Link
        route={undefined}
        sub_route={undefined}
        item_id={props.judgement_or_objective_id}
        args={args}
        extra_class_name={class_name}
    >
        {trend_icon}
    </Link>
}
