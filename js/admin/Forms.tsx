/* Forms.tsx
 * ================
 *
 * Reusable React components to keep admin form code succint and consistent
 */

import * as React from 'react'
import { toString, numberOnly, pick } from '../charts/Util'
import { bind } from 'decko'

const Select = require('preact-material-components/Select').default
const FormField = require('preact-material-components/FormField').default
const MDTextField = require('preact-material-components/TextField').default

export interface TextFieldProps extends React.HTMLAttributes<HTMLLabelElement> {
    label?: string,
    value: string | undefined,
    onValue: (value: string | undefined) => void,
    onEnter?: () => void,
    onEscape?: () => void,
    placeholder?: string,
    title?: string,
    disabled?: boolean
}

export class TextField extends React.Component<TextFieldProps> {
    @bind onInput(ev: React.FormEvent<HTMLInputElement>) {
        const value = ev.currentTarget.value
        if (value === "") {
            this.props.onValue(undefined)
        } else {
            this.props.onValue(value)
        }
    }

    @bind onKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {
        if (ev.key === "Enter" && this.props.onEnter) {
            this.props.onEnter()
        } else if (ev.key === "Escape" && this.props.onEscape) {
            this.props.onEscape()
        }
    }

    render() {
        const { props } = this
        const passthroughProps = pick(props, ['title', 'disabled', 'helpText'])

        return <MDTextField label={props.label} value={props.value} onInput={this.onInput} {...passthroughProps}/>
        /*if (props.label) {
            return <label className="TextField" style={props.style}>
                {props.label}
                <input className="form-control" type="text" value={props.value} onInput={this.onInput} onKeyDown={this.onKeyDown} {...passthroughProps} />
            </label>
        } else {
            return <input style={props.style} className="TextField form-control" type="text" value={props.value} onInput={this.onInput} onKeyDown={this.onKeyDown} {...passthroughProps} />
        }*/
    }
}

export class TextAreaField extends React.Component<TextFieldProps> {
    @bind onInput(ev: React.FormEvent<HTMLTextAreaElement>) {
        const value = ev.currentTarget.value
        if (value === "") {
            this.props.onValue(undefined)
        } else {
            this.props.onValue(value)
        }
    }

    render() {
        const { props } = this
        const passthroughProps = pick(props, ['placeholder', 'title', 'disabled', 'label', 'helpText'])

        return <MDTextField fullwidth={true} value={props.value} onInput={this.onInput} {...passthroughProps}/>
        /*if (props.label) {
            return <label style={props.style} className="TextAreaField">
                {props.label}
                <textarea className="form-control" value={props.value} onInput={this.onInput} {...passthroughProps} />
            </label>
        } else {
            return <textarea className="TextAreaField form-control" style={props.style} value={props.value} onInput={this.onInput} {...passthroughProps} />
        }*/
    }
}

export interface NumberFieldProps {
    label?: string,
    value: number | undefined,
    onValue: (value: number | undefined) => void,
    min?: number,
    max?: number,
    placeholder?: string
    disabled?: boolean
}

export class NumberField extends React.Component<NumberFieldProps> {
    render() {
        const { props } = this
        const passthroughProps = pick(props, ['min', 'max', 'placeholder', 'disabled'])
        if (props.label) {
            return <label className="NumberField">
                {props.label} <input type="text" value={toString(props.value)} onChange={(ev) => props.onValue(numberOnly(ev.currentTarget.value))} {...passthroughProps} />
            </label>
        } else {
            return <input className="NumberField" type="text" value={toString(props.value)} onChange={(ev) => props.onValue(numberOnly(ev.currentTarget.value))} {...passthroughProps} />
        }
    }
}

export interface SelectFieldProps {
    label: string,
    value: string | undefined,
    onValue: (value: string | undefined) => void,
    options: string[],
    optionLabels?: string[]
}

export class SelectField extends React.Component<SelectFieldProps> {
    render() {
        const { props } = this
        return <label>
            {props.label}
            <Select selectedIndex={props.value ? props.options.indexOf(props.value) : undefined} onChange={(e: any) => props.onValue(props.options[e.selectedIndex])}>
                {props.options.map((value, i) =>
                    <Select.Item>{props.optionLabels ? props.optionLabels[i] : value}</Select.Item>
                )}
            </Select>
        </label>
    }
}

export interface NumericSelectFieldProps {
    label?: string,
    value?: number,
    onValue: (value: number) => void,
    options: number[],
    optionLabels: string[]
}

export class NumericSelectField extends React.Component<NumericSelectFieldProps> {
    onChange(ev: React.FormEvent<HTMLSelectElement>) {
        this.props.onValue(parseFloat(ev.currentTarget.value))
    }

    render() {
        const { props } = this
        return <label>
            {props.label}
            <select className="form-control" value={props.value}>
                {props.options.map((value, i) =>
                    <option value={value}>{props.optionLabels[i]}</option>
                )}
            </select>
        </label>
    }
}

export interface ToggleProps {
    label: string,
    value: boolean,
    onValue: (value: boolean) => void
}

export class Toggle extends React.Component<ToggleProps> {
    render() {
        const { props } = this
        /*return <div className="mdc-form-field">

        </div>*/

        return <div className="mdc-form-field">
            <div className="mdc-checkbox">
            <input type="checkbox"
                    className="mdc-checkbox__native-control"
                    onChange={(ev) => props.onValue(ev.target.checked)}/>
            <div className="mdc-checkbox__background">
                <svg className="mdc-checkbox__checkmark"
                    viewBox="0 0 24 24">
                <path className="mdc-checkbox__checkmark__path"
                        fill="none"
                        stroke="white"
                        d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                </svg>
                <div className="mdc-checkbox__mixedmark"></div>
            </div>
            </div>

            <label>My Checkbox Label</label>
        </div>
       /* return <FormField>
            <Checkbox checked={props.value} onChange={(ev) => props.onValue(ev.target.checked)}/> <label>{props.label}</label>
        </FormField>
        return <label className="Toggle clickable">
            <input type="checkbox" checked={props.value}  />
            {" " + props.label}
        </label>*/
    }
}
