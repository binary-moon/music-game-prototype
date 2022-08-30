import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'

const Button = styled.button`
  padding: .5rem;
  border: solid 1px #333;
  cursor: pointer;

  &.isRecordedPlaying {
    background: green;
    color: white;
  }
`

export const PlayButton = ({isRecordedPlaying, onPlayClick}) => {

  return (
    <Button onClick={onPlayClick} className={clsx({isRecordedPlaying})}>Play</Button>
  )
}
