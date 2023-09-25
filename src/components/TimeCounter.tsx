import store from "../store/store";
import { convertMinuteString, convertSecondString } from "../utils";

function TimeCounter() {
  return (
    <div class="flex flex-col items-center font-black" data-tauri-drag-region>
      <h1 class="text-7xl" data-tauri-drag-region>{convertMinuteString(store.count)}</h1>
      <h4 class="text-7xl" data-tauri-drag-region>{convertSecondString(store.count)}</h4>
    </div>
  );
}

export default TimeCounter