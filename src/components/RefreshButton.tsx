import { Status, WorkType } from "../config"
import { Refresh } from "../icons/refresh"
import store, { reset } from "../store/store"

function RefreshButton() {
    return (
      <button class="flex flex-row justify-end basis-1/4" title="Reset" onClick={reset}>
      {
        store.status === Status.Pause || store.workType === WorkType.Break ? <Refresh width={16} height={16} /> : ""
      }
      </button>
    )
}

export default RefreshButton