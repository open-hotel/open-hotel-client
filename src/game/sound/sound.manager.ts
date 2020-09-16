import { GameSounds } from "./sounds"
import { Provider } from "injets"

@Provider()
export class SoundManager {
  sounds: Map<string, HTMLAudioElement> = new Map()

  constructor () {
    this
      .load(GameSounds.CREDITS)
      .load(GameSounds.PIXELS)
      .load(GameSounds.RECEIVE_MSG)
      .load(GameSounds.SENT_MSG)
  }

  add(id: string, audio: HTMLAudioElement) {
    this.sounds.set(id, audio)
    return this
  }

  register (id: string, url: string) {
    const audio = new Audio(url)
    this.sounds.set(id, audio)
    
    audio.load()

    return audio
  }

  load (sound: GameSounds) {
    this.register(sound, sound)
    return this
  }

  play (sound: string, loop = false) {
    const audio = this.sounds.get(sound)
    
    if (audio) {
      audio.loop = loop
      audio.play()
    }

    return this
  }
}