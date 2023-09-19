import { RefreshOutlined } from "@suid/icons-material"
import { Status, WorkType } from "../config"
import { useAction, useStatus, useWorkType } from "../store/store"

function RefreshCom() {
    console.log("render refresh")
    const [status] = useStatus()
    const [workType] = useWorkType()
    const [actions] = useAction()

    function reset() {
      actions.reset()
    }

    return (
      <>
      {
        status() === Status.Pause || workType() === WorkType.Break ? <RefreshOutlined class="cursor-pointer" onClick={reset} /> : ""
      }
      </>
    )
}

export default RefreshCom