import styled from 'styled-components'
import clsx from 'clsx'
import { useDrag } from 'react-dnd'
import { ItemTypes } from '../constants'

const SoundInner = styled.button`
  border: solid 1px #333;
  padding: .5rem;
  cursor: move;

  &.active {
    background: green;
  }

  &.isDragging {
    opacity: 0.5;
    background: red;
  }
`

export const Sound = ({text, active, soundIndex}) => {
  const [{isDragging}, drag] = useDrag(() => ({
    type: ItemTypes.SOUND,
    item: { soundIndex },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <SoundInner
      ref={drag}
      className={clsx({active, isDragging})}
    >
      {text}
    </SoundInner>
  )
}
