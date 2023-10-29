import { createEffect } from "solid-js"
import { DefaultBreakDuration, DefaultWorkDuration, INTERVAL, Keys, MagicNumber, Status, Tasks, WorkType } from "../config"
import { getIntDefault, saveItem } from "./local"
import { createStore } from "solid-js/store"
import { playAudio, playEndAudio } from "../utils"
import { themeNum } from "../style"

const [store, setStore] = createStore({
  count: 0,
  status: Status.Idle,
  workType: WorkType.Work,
  daykey: Keys.today(),
  today: 0,
  total: 0,
  theme: 0
})

export const initData = (td: number, tt: number, c: number) => {
  setStore('today', () => td)
  setStore('total', () => tt)
  setStore('count', () => c)
  setStore('theme', Math.floor(td / MagicNumber))
}

const countdown = () => {
  if (store.count === 0) {
    setStore('status', () => Status.Idle)
    if (store.workType === WorkType.Work) {
      setStore('today', (t: number) => t + 1)
      setStore('total', (t: number) => t + 1)
      if (store.today % MagicNumber === 0) {
        changeTheme()
      }
      setStore('workType', () => WorkType.Break)
      setStore('count', () => getIntDefault(Keys.defaultBreakDuration, DefaultBreakDuration))
      // 当天数量本地保存
      if (store.daykey === Keys.today()) { // 当天
        saveItem(store.daykey, store.today.toString())
      } else {
        setStore('daykey', () => Keys.today())
        setStore('today', () => 1) // 隔天更新
      }
      // 总数本地保存
      saveItem(Keys.total(Tasks.default), store.total.toString())
    } else {
      setStore('workType', () => WorkType.Work)
      setStore('count', () => getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration))
    }
    return
  }
  setStore('count', (c: number) => c - 1);
}

export const tick = () => {
  setStore(
    'status',
    (s) => {
      if (s !== Status.Tick) {
        return Status.Tick
      }
      return Status.Pause
    }
  )
}

export const reset = () => {
  setStore('status', () => Status.Idle)
  setStore('workType', () => WorkType.Work)
  setStore('count', () => getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration))
}

export const changeTheme = () => {
  setStore('theme', (t) => (t + 1) % themeNum)
}

export const updateDuration = () => {
  setStore('count', (c) => {
    if (store.status == Status.Idle) {
      if (store.workType == WorkType.Break) {
        return getIntDefault(Keys.defaultBreakDuration, DefaultBreakDuration)
      }
      return getIntDefault(Keys.defaultWorkDuration, DefaultWorkDuration)
    }
    return c
  })
}

let id: any;
createEffect(() => {
  clearInterval(id)
  if (store.status === Status.Tick) {
    id = setInterval(countdown, INTERVAL)
  }
  playAudio(store.status === Status.Tick)
  playEndAudio(store.status === Status.Idle)
})

export default store

/*
const [store, setStore] = createStore({ todos: [] })
const addTodo = (text) => {
  setStore("todos", todos => [...todos, { id: ++todoId, text, completed: false }]);
}
const toggleTodo = (id) => {
  setStore("todos", todo => todo.id === id, "completed", completed => !completed);
}

const addTodo = (text) => {
  setStore(
    'todos',
    produce((todos) => {
      todos.push({ id: ++todoId, text, completed: false });
    }),
  );
};
const toggleTodo = (id) => {
  setStore(
    'todos',
    todo => todo.id === id,
    produce((todo) => (todo.completed = !todo.completed)),
  );
};
*/