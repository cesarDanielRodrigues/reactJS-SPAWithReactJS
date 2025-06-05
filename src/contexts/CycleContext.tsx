import { createContext, ReactNode, useEffect, useReducer, useState } from "react"
import { Cycle, cyclesReducer } from "../reducers/cycles/reducers"
import {
  addNewCycleAction,
  interruptedCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from "../reducers/cycles/actions"
import { differenceInSeconds } from "date-fns"

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  secondsAmountPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptedCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CycleContextProvidersProps {
  children: ReactNode
}

export function CyclesContextProvider({ children }: CycleContextProvidersProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem("@ignite-timer:cycles-state-1.0.0")

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }

      return initialState
    }
  )

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [secondsAmountPassed, setSecondsAmountPassed] = useState(()=>{
    if(activeCycle){
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }
    return 0
  })

  useEffect(() => {

    const stateJSON = JSON.stringify(cyclesState)
    localStorage.setItem("@ignite-timer:cycles-state-1.0.0", stateJSON)

  }, [cyclesState])

  function setSecondsPassed(seconds: number) {
    setSecondsAmountPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id: id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    setSecondsAmountPassed(0)
  }

  function interruptedCycle() {
    dispatch(interruptedCurrentCycleAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        secondsAmountPassed,
        createNewCycle,
        interruptedCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
