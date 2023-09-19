import { playAudio, playEndAudio } from "../utils"
import { Status } from "../config"
import { createEffect } from "solid-js"
import { PauseCircleOutline, PlayCircleOutline } from "@suid/icons-material"
import { useAction, useStatus } from "../store/store"

function OperactionCom() {
  console.log("render Operaction")
  const className = "cursor-pointer"
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
    <>
      {
        (status() === Status.Tick)  ?
          (<PauseCircleOutline class={className} onClick={tick} />)
        :
          (<PlayCircleOutline class={className} onClick={tick} />)
      }
    </>
  )
}

export default OperactionCom