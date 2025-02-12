'use strict'
import { helpers } from '@remix-project/remix-lib'
const { ui } = helpers

// vmTraceIndex has to point to a CALL, CODECALL, ...
export function resolveCalledAddress (vmTraceIndex, trace) {
  const step = trace[vmTraceIndex]
  if (isCreateInstruction(step)) {
    return contractCreationToken(vmTraceIndex)
  } else if (isCallInstruction(step)) {
    const stack = step.stack // callcode, delegatecall, ...
    return ui.normalizeHexAddress(stack[stack.length - 2])
  }
  return undefined
}

export function isCallInstruction (step) {
  return ['CALL', 'STATICCALL', 'CALLCODE', 'CREATE', 'DELEGATECALL', 'AUTHCALL'].includes(step.op)
}

export function isCreateInstruction (step) {
  return step.op === 'CREATE'
}

export function isReturnInstruction (step) {
  return step.op === 'RETURN'
}

export function isJumpDestInstruction (step) {
  return step.op === 'JUMPDEST'
}

export function isStopInstruction (step) {
  return step.op === 'STOP'
}

export function isRevertInstruction (step) {
  return step.op === 'REVERT'
}

export function isSSTOREInstruction (step) {
  return step.op === 'SSTORE'
}

export function isSHA3Instruction (step) {
  return step.op === 'SHA3'
}

export function newContextStorage (step) {
  return ['CREATE', 'CALL', 'AUTHCALL'].includes(step.op)
}

export function isCallToPrecompiledContract (index, trace) {
  // if stack empty => this is not a precompiled contract
  const step = trace[index]
  if (this.isCallInstruction(step)) {
    return index + 1 < trace.length && trace[index + 1].stack.length !== 0
  }
  return false
}

export function contractCreationToken (index) {
  return '(Contract Creation - Step ' + index + ')'
}

export function isContractCreation (address) {
  return address.indexOf('(Contract Creation - Step') !== -1
}
