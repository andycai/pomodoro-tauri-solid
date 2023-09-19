import { createSignal, createContext, useContext, createEffect } from "solid-js";
import { DefaultBreakDuration, DefaultWorkDuration, INTERVAL, Keys, Status, Tasks, WorkType } from "../config";
import { getIntDefault, saveItem } from "./local";
import { createStore } from "solid-js/store";
import { playAudio, playEndAudio } from "../utils";

// const StoreContext = createContext();

// type State = {
//   count: number
//   status: Status
//   workType: WorkType
//   daykey: string
//   today: number // 当天番茄钟
//   total: number // 总番茄钟
// }

// type Actions = {
//   initData: (today: number, total: number, count: number) => void
//   updateDaykey: (key: string) => void
//   updateToday: (count: number) => void
//   countdown: () => void // 倒计时
//   tick: () => void
//   reset: () => void
// }

// const [store, setStore] = createStore({
//   count: 0,
//   status: Status.Idle,
//   workType: WorkType.Work,
//   daykey: "",
//   today: 2,
//   total: 0
// })

const [count, setCount] = createSignal(0)
export const useCount = () => [count] 

const [status, setStatus] = createSignal(Status.Idle)
export const useStatus = () => [status]

const [workType, setWorkType] = createSignal(WorkType.Work)
export const useWorkType = () => [workType]

const [daykey, setDaykey] = createSignal("")
export const useDaykey = () => [daykey]

const [today, setToday] = createSignal(0)
export const useToday = () => [today]

const [total, setTotal] = createSignal(0)
export const useTotal = () => [total]

let id: any;
createEffect(() => {
  clearInterval(id)
  if (status() === Status.Tick) {
    id = setInterval(action.countdown, INTERVAL)
  }
  playAudio(status() === Status.Tick)
  playEndAudio(status() === Status.Idle)
})

const [action, setAction] = createStore({
  initData: (today: number, total: number, count: number) => {
    setCount(count)
    setToday(today)
    setTotal(total)
  },
  updateDaykey: (daykey: string) => {
    setDaykey(daykey)
  },
  updateToday: (count: number) => {
    setToday(count)
  },
  countdown: () => {
    if (count() === 0) {
      setStatus(Status.Idle)
      if (workType() === WorkType.Work) {
        setToday(t => t + 1)
        setTotal(t => t + 1)
        setWorkType(WorkType.Break)
        setCount(getIntDefault(Keys.defaultBreakDuration, DefaultBreakDuration))
        // 当天数量本地保存
        if (daykey() === Keys.today()) { // 当天
          saveItem(daykey(), today().toString())
        } else {
          setDaykey(Keys.today())
          setToday(1) // 隔天更新
        }
        // 总数本地保存
        saveItem(Keys.total(Tasks.default), total().toString())
      } else {
        setWorkType(WorkType.Work)
        setCount(getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration))
      }
      return
    }
    setCount(c => c - 1);
  },
  tick: () => {
    if (status() !== Status.Tick) {
      setStatus(Status.Tick)
    } else {
      setStatus(Status.Pause)
    }
  },
  reset: () => {
    setCount(getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration))
    setStatus(Status.Idle)
    setWorkType(WorkType.Work)
  }
})
export const useAction = () => [action]

// export function StoreProvider(props: any) {
//   const [count, setCount] = createSignal(0)
//   const [status, setStatus] = createSignal(Status.Idle)
//   const [workType, setWorkType] = createSignal(WorkType.Work)
//   const [daykey, setDaykey] = createSignal("")
//   const [today, setToday] = createSignal(0)
//   const [total, setTotal] = createSignal(0)
//   const store: State & Actions = {
//       count: count(),
//       status: status(),
//       workType: workType(),
//       daykey: daykey(),
//       today: today(),
//       total: total(),
//         initData: (today: number, total: number, count: number) => {
//           setCount(count)
//           setToday(today)
//           setTotal(total)
//         },
//         updateDaykey: (daykey: string) => {
//           setDaykey(daykey)
//         },
//         updateToday: (count: number) => {
//           setToday(count)
//         },
//         countdown: () => {
//           if (count() === 0) {
//             setStatus(Status.Idle)
//             if (workType() === WorkType.Work) {
//               setToday(t => t + 1)
//               setTotal(t => t + 1)
//               setWorkType(WorkType.Break)
//               setCount(getIntDefault(Keys.defaultBreakDuration, DefaultBreakDuration))
//             } else {
//               setWorkType(WorkType.Work)
//               setCount(getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration))
//             }
//             return
//           }
//           setCount(c => c - 1);
//         },
//         tick: () => {
//           if (status() !== Status.Tick) {
//             setStatus(Status.Tick)
//           } else {
//             setStatus(Status.Pause)
//           }
//         },
//         reset: () => {
//           setCount(getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration))
//           setStatus(Status.Idle)
//           setWorkType(WorkType.Work)
//         }
//     }

//   return (
//     <StoreContext.Provider value={store}>
//       {props.children}
//     </StoreContext.Provider>
//   )
// }

// export function useStore() { return useContext(StoreContext) }