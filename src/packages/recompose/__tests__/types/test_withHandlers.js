/* eslint-disable no-unused-vars, no-unused-expressions */
/* @flow */

import React from 'react'
import { compose, withProps, withHandlers } from '../..'

import type { HOC } from '../..'

type EnhancedCompProps = {
  value: number,
  onChange: (value: number) => void,
  onOtherChange: (value: { id: string }) => void,
}

const enhancer: HOC<*, EnhancedCompProps> = compose(
  withHandlers({
    onValueChange: props => value => {
      props.onChange(value)
      return true
    },
    onOtherValueChange: props => value => {
      props.onOtherChange(value)
      return true
    },
  }),
  // here props itself will not be infered without explicit handler args types
  withProps(props => ({
    valueClone: (props.value: number),
    resType: (props.onValueChange(0): boolean),
    ee: props.onOtherValueChange({ id: 'aa' }),

    // $FlowExpectedError (...) - result is not any or number
    resTypeErr: (props.onValueChange(0): number),
    // $FlowExpectedError (...) - property not found
    err: props.iMNotExists,
  }))
)

// check that factory init works as expected
const enhancer2: HOC<*, EnhancedCompProps> = compose(
  withHandlers(() => ({
    onValueChange: props => value => {
      props.onChange(value)
      return true
    },
  })),
  // here props itself will not be infered without explicit handler args types
  withProps(props => ({
    valueClone: (props.value: number),
    resType: (props.onValueChange(0): boolean),

    // $FlowExpectedError (...) - result is not any or number
    resTypeErr: (props.onValueChange(0): number),
    // $FlowExpectedError (...) - property not found
    err: props.iMNotExists,
  }))
)

// $FlowFixMe[missing-local-annot]
const BaseComp = ({ value, onValueChange }) => (
  <div
    onClick={() => {
      const res = onValueChange(1)
      ;(res: boolean)
      // $FlowExpectedError (...)
      ;(res: number)
    }}
  >
    {(value: number)}
    {
      // $FlowExpectedError (...) - value is not any or string
      (value: string)
    }
  </div>
)

const Enhanced = enhancer(BaseComp)
