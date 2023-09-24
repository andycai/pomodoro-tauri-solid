import { Status, WorkType } from "../config"
import { Refresh } from "../icons/refresh"
import { useAction, useStatus, useWorkType } from "../store/store"

function RefreshButton() {
    console.log("render refresh")
    const [status] = useStatus()
    const [workType] = useWorkType()
    const [actions] = useAction()

    function reset() {
      actions.reset()
    }

    return (
      <button class="flex flex-row justify-end basis-1/4" title="Reset" onClick={reset}>
      {
        status() === Status.Pause || workType() === WorkType.Break ? <Refresh width={16} height={16} /> : ""
      }
      </button>
    )
}

export default RefreshButton