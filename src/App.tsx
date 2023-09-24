import { createEffect, createMemo } from "solid-js";
import TimeCounter from "./components/TimeCounter";
import { ClassContainer, TextColors } from "./style";
import { useAction, useTheme, useWorkType } from "./store/store";
import { DefaultWorkDuration, Keys, Tasks, dataJsonURL, diAudioPaths, endAudioPaths } from "./config";
import { resolveResource } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/api/fs";
import { getIntDefault, initItem } from "./store/local";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { addAudio, addEndAudio } from "./utils";
import AppBar from "./components/AppBar";
import FootBar from "./components/FootBar";

function App() {
  const [workType] = useWorkType()
  const [actions] = useAction()
  const [theme] = useTheme()

  // 字体和图标颜色
  const className = createMemo(() => {
    const arr = TextColors[workType()]??TextColors[1]
    const color = arr[theme()]??arr[0]
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
      <AppBar />
      <TimeCounter />
      <FootBar />
    </div>
  )
}

export default App;
