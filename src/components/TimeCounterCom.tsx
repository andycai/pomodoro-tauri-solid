import { useCount } from "../store/store";
import { convertMinuteString, convertSecondString } from "../utils";

function TimeCounterCom() {
  const [count] = useCount()
  console.log("render TimeCounter", count())
  // const className = "font-black";

  return (
    <div class="flex flex-col items-center font-black" data-tauri-drag-region>
      <h1 class="text-7xl" data-tauri-drag-region>{convertMinuteString(count())}</h1>
      <h4 class="text-7xl" data-tauri-drag-region>{convertSecondString(count())}</h4>
    </div>
  );
}

export default TimeCounterCom