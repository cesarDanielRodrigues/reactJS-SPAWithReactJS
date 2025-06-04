import { createContext, ReactNode, useReducer, useState } from "react"
import { ActionTypes, Cycle, cyclesReducer } from "../reducers/cycles"

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
  const [cyclesState, dispatch] = useReducer(cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    }
  )

  console.log(cyclesState)

  const [secondsAmountPassed, setSecondsAmountPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setSecondsAmountPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
      payload: {
        activeCycleId,
      },
    })
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id: id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    dispatch({
      type: ActionTypes.ADD_NEW_CYCLE,
      payload: {
        newCycle,
      },
    })
    setSecondsAmountPassed(0)
  }

  function interruptedCycle() {
    dispatch({
      type: "INTERRUPT_CURRENT_CYCLE",
      type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
      payload: {
        activeCycleId,
      },
    })
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
