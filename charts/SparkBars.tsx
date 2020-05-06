import * as React from "react"
import { computed } from "mobx"
import { observer } from "mobx-react"
import { scaleLinear } from "d3-scale"
import { bind } from "decko"

import { max, keyBy } from "charts/Util"

export enum BarState {
    highlighted = "highlighted",
    current = "current",
    normal = "normal",
    faint = "faint"
}

export interface SparkBarsProps<T> {
    data: T[]
    x: (d: T) => number
    y: (d: T) => number | undefined
    xDomain: [number, number]
    currentX?: number
    highlightedX?: number
    renderValue?: (d: T | undefined) => JSX.Element | undefined
}

export interface SparkBarsDatum {
    year: number
    value: number
}

@observer
export class SparkBars<T> extends React.Component<SparkBarsProps<T>> {
    static defaultProps = {
        onHover: () => undefined
    }

    @computed get barHeightScale() {
        const maxY = max(
            this.props.data
                .map(this.props.y)
                .filter(d => d !== undefined) as number[]
        )
        return scaleLinear()
            .domain([0, maxY !== undefined && maxY > 0 ? maxY : 1])
            .range([0, 1])
    }

    @bind barHeight(d: T | undefined) {
        if (d !== undefined) {
            const value = this.props.y(d)
            if (value !== undefined) {
                const ratio = this.barHeightScale(value)
                return `${ratio * 100}%`
            }
        }
        return "0%"
    }

    @bind barState(d: number): BarState {
        if (d === this.props.highlightedX) return BarState.highlighted
        if (d === this.props.currentX) return BarState.current
        if (this.props.highlightedX !== undefined) return BarState.faint
        return BarState.normal
    }

    @computed get bars(): (T | undefined)[] {
        const indexed = keyBy(this.props.data, this.props.x)
        const [start, end] = this.props.xDomain
        const result = []
        for (let i = start; i <= end; i++) {
            result.push(indexed[i])
        }
        return result
    }

    render() {
        return (
            <div className="spark-bars">
                {this.bars.map((d, i) => (
                    <div key={i} className="bar-wrapper">
                        {this.props.highlightedX === i &&
                            d !== undefined &&
                            this.props.renderValue && (
                                <div className="hanging-value highlighted highlighted-color">
                                    {this.props.renderValue(d)}
                                </div>
                            )}
                        <div
                            className={`bar ${this.barState(i)}`}
                            style={{
                                height: this.barHeight(d)
                            }}
                        ></div>
                    </div>
                ))}
            </div>
        )
    }
}
