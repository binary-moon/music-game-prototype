import React from 'react'
import styled, { keyframes } from 'styled-components'
import clsx from 'clsx'

const waitingAnimation = keyframes`
  0% { background: white }
  50% { background: #DC1619 }
  100% {background: white}
`

const Button = styled.button`
  padding: .5rem;
  border: solid 1px #333;
  cursor: pointer;

  &.isRecording {
    background: #DC1619;
    color: white;
  }

  &.isRecording.isWaiting {
    animation-name: ${waitingAnimation};
    animation-duration: .5s;
    animation-iteration-count: infinite;
  }
`

export const RecordButton = ({isRecording, onRecordClick, isWaiting}) => {

  return (
    <Button onClick={onRecordClick} className={clsx({isRecording})}>Record</Button>
  )
}
