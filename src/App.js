import React, {useState} from 'react'
import * as Tone from 'tone'
import styled from 'styled-components'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { GlobalStyle } from './GlobalStyle'

import { Sound } from './components/Sound'
import { Track } from './components/Track'
import { InfoBar } from './components/InfoBar'
import { RecordButton } from './components/RecordButton'
import { PlayButton } from './components/PlayButton'

import { BPM, RECORD_LENGTH } from './constants'

import sound1 from './assets/sounds/1-Drum-Kit-1.wav'
import sound2 from './assets/sounds/2-Drum-Kit-2.wav'
import sound3 from './assets/sounds/3-Oxi-Bass-Rack.wav'
import sound4 from './assets/sounds/4-Three-Op-Bass.wav'
import sound5 from './assets/sounds/5-Deep-in-Dark.wav'
import sound6 from './assets/sounds/6-Crossover-Syn-Bass.wav'
import sound7 from './assets/sounds/7-Vocals-Group.wav'
import sound8 from './assets/sounds/12-Wavetable-Pads.wav'
import sound9 from './assets/sounds/13-Sidechain-Pad.wav'
import sound10 from './assets/sounds/15-A-Hornet-Pillow.wav'

import { useScheduleRepeat } from './hooks/useScheduleRepeat'

const sounds = [
  {
    url: sound1,
    text: "Drum Kit 1"
  },
  {
    url: sound2,
    text: "Drum Kit 2"
  },
  {
    url: sound3,
    text: "Oxi Bass Rack"
  },
  {
    url: sound4,
    text: "Three Op Bass"
  },
  {
    url: sound5,
    text: "Deep in Dark"
  },
  {
    url: sound6,
    text: "Crossover Syn Bass"
  },
  {
    url: sound7,
    text: "Vocals Group"
  },
  {
    url: sound8,
    text: "Wavetables Pad"
  },
  {
    url: sound9,
    text: "Sidechain Pad 1"
  },
  {
    url: sound10,
    text: "A Hornet Pillow"
  },
]

const Scene = styled.div`
  padding: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  > * + * {
    margin-top: 2rem;
  }
`

const Title = styled.span`
  font-size: 2rem;
  font-weight: 600;
`

const LoadButton = styled.button`
  padding: .5rem;
  border: solid 1px #333;
`

const TrackContainer = styled.div`
  display: flex;
  width: 100%;
`

const SoundContainer = styled.div`
  display: flex;
  padding: 0 -0.5rem;

  > * {
    margin: 0 0.5rem;
  }
`

const ButtonGroup = styled.div`
  display: flex;  
`

function App() {
  const [isPlaybackStarted, setIsPlaybackStarted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [position, setPosition] = useState('0:0')
  const [player, setPlayer] = useState()
  const [tracks, setTracks] = useState([
    {loadedSound: null},
    {loadedSound: null},
    {loadedSound: null},
    {loadedSound: null},
    {loadedSound: null},
    {loadedSound: null},
    {loadedSound: null},
  ])

  const [recordedSong, setRecordedSong] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [isRecordingDone, setIsRecordingDone] = useState(false)
  const [isRecordedPlaying, setIsRecordedPlaying] = useState(false)
  const [currentBar, setCurrentBar] = useState(0)

  const initLoad = async () => {
    await Tone.start();

    console.log('audio is ready')

    const playerInstance = new Tone.Players({
      urls: {
        sound0: sounds[0].url,
        sound1: sounds[1].url,
        sound2: sounds[2].url,
        sound3: sounds[3].url,
        sound4: sounds[4].url,
        sound5: sounds[5].url,
        sound6: sounds[6].url,
        sound7: sounds[7].url,
        sound8: sounds[8].url,
        sound9: sounds[9].url,
      }
    }).toDestination();

    setPlayer(playerInstance);
    
    Tone.Transport.bpm.value = BPM;
    setIsLoaded(true)
  }

  const mainTransportId = useScheduleRepeat(() => {
    setIsWaiting(false)
    tracks.forEach(track => {
      if (track.loadedSound !== null) {
        player.player(`sound${track.loadedSound}`).start();  
      }
    })

    if (isRecording) {
      if (recordedSong.length < RECORD_LENGTH) {
        const tempRecordedSong = JSON.parse(JSON.stringify(recordedSong))
        const tempTracks = JSON.parse(JSON.stringify(tracks))
        setRecordedSong([...tempRecordedSong, [...tempTracks]])
      } else {
        setIsRecording(false)
        setIsRecordingDone(true)
        setIsPlaybackStarted(false)
        setTracks([
          {loadedSound: null},
          {loadedSound: null},
          {loadedSound: null},
          {loadedSound: null},
          {loadedSound: null},
          {loadedSound: null},
          {loadedSound: null},
        ])
        Tone.Transport.stop()
        Tone.Transport.clear(mainTransportId)
        player.stopAll()
      }
    } 
  }, isPlaybackStarted ? '4m' : null)

  const recordedTransportId = useScheduleRepeat(() => {
    if (currentBar < recordedSong.length) {
      const currentTrack = recordedSong[currentBar]
      setTracks([...currentTrack])
      currentTrack.forEach(track => {
        if (track.loadedSound !== null) {
          player.player(`sound${track.loadedSound}`).start();  
        }
      })
      setCurrentBar(currentBar => currentBar + 1)
    } else {
      setIsRecordedPlaying(false)
      Tone.Transport.stop()
      Tone.Transport.clear(recordedTransportId)
    }
  }, isRecordedPlaying ? '4m' : null)

  useScheduleRepeat(() => {
    const rawPosition = Tone.Transport.position.split(':')
    setPosition(`${rawPosition[0]}:${rawPosition[1]}`)
  }, isPlaybackStarted ? '4n' : null)

  const toggleTrack = (index, sound) => {
    setIsWaiting(true)
    const tempTracksArray = tracks;
    tempTracksArray[index].loadedSound = sound.soundIndex
    setTracks([...tempTracksArray])
  }

  const clearTrack = (index) => {
    setIsWaiting(true)
    const tempTracksArray = tracks;
    tempTracksArray[index].loadedSound = null;
    setTracks([...tempTracksArray])
  }

  const handleDrop = (index, sound) => {
    toggleTrack(index, sound)

    if (!isPlaybackStarted) {
      Tone.Transport.start()
      setIsPlaybackStarted(true)
    }
  }

  const onRecordClick = () => {
    if (!isRecording) {
      setIsRecording(true)
    } else {
      setIsRecording(false)
    }
  }

  const onPlayClick = () => {
    setIsRecordedPlaying(true)
    Tone.Transport.start()
  }

  return (
    <>
      <GlobalStyle />
      <Scene>
        <Title>Music Game Prototype</Title>
        {!isLoaded && <LoadButton onClick={initLoad}>Start</LoadButton>}
        {isLoaded && (
          <>
            <InfoBar isWaiting={isWaiting} position={position} />
            <ButtonGroup>
              {!isRecordingDone && 
                <RecordButton 
                  isRecording={isRecording}
                  onRecordClick={onRecordClick}
                  isWaiting={isWaiting} 
                />
              }
              {isRecordingDone && 
                <PlayButton onPlayClick={onPlayClick} isRecordedPlaying={isRecordedPlaying} />
              }
            </ButtonGroup>
            <DndProvider backend={HTML5Backend}>
              <TrackContainer>
                {tracks.map((track, index) => (
                  <Track
                    onDrop={sound => handleDrop(index, sound)}
                    active={track.loadedSound !== null}
                    activeSound={sounds[track.loadedSound]}
                    index={index}
                    clearTrack={clearTrack}
                    isWaiting={isWaiting}
                    isPlaybackStarted={isPlaybackStarted}
                  />
                ))}
              </TrackContainer>
              <SoundContainer>
                {sounds.map((sound, index) => {
                  return (
                    <Sound 
                      soundIndex={index} 
                      text={sound.text} 
                      active={tracks.some(track => track.loadedSound === index)} 
                    />
                  )
                })}
              </SoundContainer>
            </DndProvider>
          </>
        )}
      </Scene>
    </>
  );
}

export default App;
