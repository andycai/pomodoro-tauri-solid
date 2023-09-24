import { playAudio, playEndAudio } from "../utils"
import { Status } from "../config"
import { createEffect } from "solid-js"
import { useAction, useStatus } from "../store/store"
import { Pause } from "../icons/pause"
import { Play } from "../icons/play"

function OperactionButton() {
  console.log("render Operaction")
  const [status] = useStatus()
  const [actions] = useAction()

  createEffect(() => {
    playAudio(status() === Status.Tick)
    playEndAudio(status() === Status.Idle)
  })

  function tick() {
    actions.tick()
  }

  return (
    <button class="flex flex-row justify-center basis-1/2" title="Play or Pause" onClick={tick} >
      {
        (status() === Status.Tick)  ? <Pause width={22} height={22} /> : <Play width={22} height={22} />
      }
    </button>
  )
}

export default OperactionButton