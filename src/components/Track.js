import React, { useState, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import Spritesheet from 'react-responsive-spritesheet'
import styled, { keyframes } from 'styled-components'
import { useDrop } from 'react-dnd'

import { usePrevious } from '../hooks/usePrevious'
import sprite from '../assets/images/sprite-image-horizontal.png'
import { ItemTypes } from '../constants'

const waitingAnimation = keyframes`
  0% { background: white }
  50% { background: yellow }
  100% {background: white}
`

const Container = styled.div`
  position: relative;
  width: 14.2%;
  border: solid 1px #333;

  &.isOver {
    background: #ddd;
  }

  &.isWaiting {
    animation-name: ${waitingAnimation};
    animation-duration: .5s;
    animation-iteration-count: infinite;
  }
`

const InfoRow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  font-size: .8rem;
  font-weight: bold;
  padding: .5rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
  z-index: 1;
`

const ClearButton = styled.button`
  font-size: .8rem;
  padding: .25rem;
  border: solid 1px #333;
  cursor: pointer;
  font-weight: normal;

  &:hover {
    background: #ddd;
  }
`

export const Track = ({onDrop, active, activeSound, index, clearTrack, isWaiting, isPlaybackStarted}) => {
  const [spritesheetInstance, setSpritesheetInstance] = useState();

  const previousActiveSound = usePrevious(activeSound)
  
  const [{isOver}, drop] = useDrop(() => ({
    accept: ItemTypes.SOUND,
    drop: onDrop,
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    })
  }))

  useEffect(() => {
    if (spritesheetInstance) {
      if (active && !isWaiting) spritesheetInstance.play()
      if (previousActiveSound !== activeSound) spritesheetInstance.pause()
      if (!isPlaybackStarted) spritesheetInstance.pause()
    }
  }, [active, isWaiting, activeSound, isPlaybackStarted])

  const determineIfWaiting = useCallback(() => {
    return isPlaybackStarted && previousActiveSound !== activeSound
  }, [activeSound, isWaiting])


  return (
    <Container ref={drop} className={clsx({isOver, isWaiting: determineIfWaiting()})}>
      {active &&
        <InfoRow>
          <span>{activeSound.text}</span>
          <ClearButton onClick={() => clearTrack(index)}>Clear</ClearButton>
        </InfoRow>
      }
      <Spritesheet
        image={sprite}
        widthFrame={420}
        heightFrame={500}
        steps={14}
        fps={12}
        loop={true}
        autoplay={false}
        getInstance={spritesheet => setSpritesheetInstance(spritesheet)}
      />
    </Container>
  )
}
