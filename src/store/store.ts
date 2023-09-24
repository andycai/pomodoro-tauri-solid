import { createSignal, createEffect } from "solid-js";
import { DefaultBreakDuration, DefaultWorkDuration, INTERVAL, Keys, MagicNumber, Status, Tasks, WorkType } from "../config";
import { getIntDefault, saveItem } from "./local";
import { createStore } from "solid-js/store";
import { playAudio, playEndAudio } from "../utils";
import { themeNum } from "../style";

const [count, setCount] = createSignal(0)
export const useCount = () => [count] 

const [status, setStatus] = createSignal(Status.Idle)
export const useStatus = () => [status]

const [workType, setWorkType] = createSignal(WorkType.Work)
export const useWorkType = () => [workType]

const [daykey, setDaykey] = createSignal(Keys.today())
export const useDaykey = () => [daykey]

const [today, setToday] = createSignal(0)
export const useToday = () => [today]

const [total, setTotal] = createSignal(0)
export const useTotal = () => [total]

const [theme, setTheme] = createSignal(0)
export const useTheme = () => [theme]

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
        setToday((t: number) => t + 1)
        setTotal((t: number) => t + 1)
        if (today() % MagicNumber === 0) {
          setTheme((t) => (t + 1) % themeNum)
        }
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
    setCount((c: number) => c - 1);
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
  },
  changeTheme: () => {
    setTheme((t) => (t + 1) % themeNum)
  }
})
export const useAction = () => [action]