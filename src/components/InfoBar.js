import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const InfoBar = ({isWaiting, position}) => {

  return (
    <Container>
      <span>isWaiting: {isWaiting.toString()}</span>
      <span>Position (Bar:Beat): {position}</span>
      <span>Tracks trigger every 4 bars</span>
    </Container>
  )
}
