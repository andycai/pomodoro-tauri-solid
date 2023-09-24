import { appWindow } from '@tauri-apps/api/window'
import { Status } from '../config'
import { Close } from '../icons/close'
import { Volume } from '../icons/volume'
import { VolumeMute } from '../icons/volume-mute'
import { changeAudio, playAudio } from '../utils'
import { createSignal } from 'solid-js'
import { useStatus, useToday, useTotal } from '../store/store'

function AppBar() {
  const [musicOff, setMusicOff] = createSignal(false)
  const [status] = useStatus()
  const [today] = useToday()
  const [total] = useTotal()

  const onClick = () => {
    if (status() === Status.Tick) {
      setMusicOff(!changeAudio())
      playAudio(!musicOff())
    }
  }

  return (
    <div class="flex flex-row justify-between space-x-1 pt-1 px-1">
      <button title="Change Audio or Mute" onClick={onClick}>
        {
          musicOff() ? <VolumeMute width={16} height={16} /> : <Volume width={16} height={16} />
        }
      </button>
      <span class="text-xs" >{total()}/{today()}</span>
      <button title="Close Window" onClick={() => appWindow.close()}>
        <Close />
      </button>
    </div>
  )
}

export default AppBar
