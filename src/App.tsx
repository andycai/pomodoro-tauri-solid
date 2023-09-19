import { createEffect, createMemo } from "solid-js";
import { appWindow } from "@tauri-apps/api/window";
import TimeCounterCom from "./components/TimeCounterCom";
import TodayCountCom from "./components/TodayCountCom";
import RefreshCom from "./components/RefreshCom";
import OperactionCom from "./components/OperationCom";
import { CloseOutlined } from "@suid/icons-material";
import { ClassContainer, TextColors } from "./style";
import { useAction, useToday, useWorkType } from "./store/store";
import { DefaultWorkDuration, Keys, Tasks, dataJsonURL, diAudioPaths, endAudioPaths } from "./config";
import { resolveResource } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/api/fs";
import { getIntDefault, initItem } from "./store/local";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { addAudio, addEndAudio } from "./utils";

function App() {
  const [today] = useToday()
  const [workType] = useWorkType()
  const [actions] = useAction()

  // 字体和图标颜色
  const className = createMemo(() => {
    const index = Math.floor(today() / 4)
    const arr = TextColors[workType()]??TextColors[1]
    const color = arr[index]??arr[4]
    console.log("color", index, color)
    return ClassContainer + color 
  })

  createEffect(() => {
    actions.initData(
      getIntDefault(Keys.today(), 0),
      getIntDefault(Keys.total(Tasks.default), 0),
      getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration)
    )
    async function load() {
      const resourcePath = await resolveResource(dataJsonURL)
      const data = JSON.parse(await readTextFile(resourcePath))
      initItem(Keys.defaultWorkDuration, data.defaultWorkDuration.toString())
      initItem(Keys.defaultBreakDuration, data.defaultBreakDuration.toString())

      for (let v of diAudioPaths) {
        // console.log("path: ", v)
        const audioPath = await resolveResource(v)
        const audio = new Audio(convertFileSrc(audioPath))
        audio.loop = true
        addAudio(v, audio)
      }

      for (let v of endAudioPaths) {
        const audioPath = await resolveResource(v)
        addEndAudio(v, new Audio(convertFileSrc(audioPath)))
      }
    }
    load()
  })

  return (
      <div class={className()}>
        <CloseOutlined class="cursor-pointer absolute right-0" fontSize="inherit" onClick={() => appWindow.close()} />
        <div class="flex flex-col">
          <TimeCounterCom />
          <div class="flex flex-row justify-center mt-1">
            <TodayCountCom />
            <div class="flex flex-row flex-1 grow justify-end space-x-1 mr-1">
              <RefreshCom />
              <OperactionCom />
            </div>
          </div>
        </div>
      </div>
  )
}

export default App;
