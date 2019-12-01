import { GameSounds } from "./GameSounds"

export class SoundManager {
  sounds: Map<string, HTMLAudioElement> = new Map()

  constructor () {
    this
      .load(GameSounds.CREDITS)
      .load(GameSounds.PIXELS)
      .load(GameSounds.RECEIVE_MSG)
      .load(GameSounds.SENT_MSG)
  }

  register (id: string, url: string) {
    const audio = new Audio(url)
    audio.load()
    this.sounds.set(id, audio)

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