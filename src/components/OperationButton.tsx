import { playAudio, playEndAudio } from "../utils"
import { Status } from "../config"
import { createEffect } from "solid-js"
import { Pause } from "../icons/pause"
import { Play } from "../icons/play"
import store, { tick } from "../store/store"

function OperactionButton() {
  createEffect(() => {
    playAudio(store.status === Status.Tick)
    playEndAudio(store.status === Status.Idle)
  })

  return (
    <button class="flex flex-row justify-center basis-1/2" title="Play or Pause" onClick={tick} >
      {
        (store.status === Status.Tick)  ? <Pause width={22} height={22} /> : <Play width={22} height={22} />
      }
    </button>
  )
}

export default OperactionButton