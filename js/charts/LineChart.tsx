/* LineChart.tsx
 * ================
 *
 * A standard line chart.
 *
 */

import * as React from 'react'
import * as _ from 'lodash'
import * as $ from 'jquery'
import * as d3 from 'd3'
import {computed, action, observable} from 'mobx'
import {observer} from 'mobx-react'
import ChartConfig from './ChartConfig'
import Bounds from './Bounds'
import LineType from './LineType'
import {defaultTo} from './Util'
import AxisBox from './AxisBox'
import StandardAxisBoxView from './StandardAxisBoxView'
import Lines from './Lines'
import {preInstantiate} from "./Util"
import Paragraph from './Paragraph'
import Text from './Text'
import ColorLegend, {ColorLegendView} from './ColorLegend'
import Vector2 from './Vector2'
import {getRelativeMouse} from './Util'
import {HoverTarget} from './Lines'
import Tooltip from './Tooltip'

export interface LineChartValue {
    x: number,
    y: number,
    time: number,
    gapYearsToNext: number
}

export interface LineChartSeries {
    key: string,
    color: string,
    label: string
    values: LineChartValue[],
    classed?: string 
}

@observer
export default class LineChart extends React.Component<{ bounds: Bounds, chart: ChartConfig, localData: LineChartSeries[] }, undefined> {
    base: SVGGElement
    @observable.ref tooltip: React.ReactNode|null

    @computed get chart() { return this.props.chart }
    @computed get bounds() { return this.props.bounds }

    @computed get localData(): LineChartSeries[] {
        return this.props.localData
    }

    @computed get focusData(): LineChartSeries[] {
        return this.localData.filter(d => _.includes(this.chart.selectedEntities, d.key))
    }

    @computed get allValues(): LineChartValue[] {
        return _.flatten(_.map(this.localData, series => series.values))
    }

    @computed get xDomainDefault(): [number, number] {
        return (d3.extent(this.allValues.map(function(d) { return d.x; })) as [number, number])
    }

    @computed get yDomainDefault(): [number, number] {
        return (d3.extent(this.allValues.map(function(d) { return d.y; })) as [number, number])
    }

    @computed get legend() {
        const _this = this
        return new ColorLegend({
            maxWidth: 300,
            get items() { return _this.focusData }
        })
    }

    @action.bound onHoverPoint(target: HoverTarget) {
        const tooltipDatum = { entity: target.series.key, year: target.value.x, value: target.value.y }
        this.tooltip = <Tooltip x={target.pos.x} y={target.pos.y} datum={tooltipDatum}/>
    }

    @action.bound onHoverStop() {
        this.tooltip = null
    }

    render() {
        const {chart, bounds, localData, focusData, xDomainDefault, yDomainDefault, legend, tooltip} = this

        const xAxis = chart.xAxis.toSpec({ defaultDomain: xDomainDefault })
        const yAxis = chart.yAxis.toSpec({ defaultDomain: yDomainDefault })
        const axisBox = new AxisBox({bounds: bounds.padRight(10).padRight(legend.width), xAxis, yAxis})

        return <g className="LineChart">
            <ColorLegendView x={bounds.right-legend.width} y={bounds.top} legend={legend}/>
            <StandardAxisBoxView axisBox={axisBox} chart={chart}/>
            <Lines xScale={axisBox.xScale} yScale={axisBox.yScale} data={localData} onHoverPoint={this.onHoverPoint} onHoverStop={this.onHoverStop}/>
            {tooltip}
        </g>
    }
}