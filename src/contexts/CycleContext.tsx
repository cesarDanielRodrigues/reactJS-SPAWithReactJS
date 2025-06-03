import { createContext, ReactNode, useReducer, useState } from "react"

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  secondsAmountPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData)=> void
  interruptedCycle: ()=>void

}

export const CyclesContext = createContext({} as CyclesContextType)

interface CycleContextProvidersProps {
  children: ReactNode
}

export function CyclesContextProvider({ children }: CycleContextProvidersProps) {
  const [cycles, dispatch] = useReducer((state: Cycle[], action: any)=>{
    if(action.type === 'ADD_NEW_CYCLE'){
      return [...state, action.payload.newCycle]
    }

    return state
  }, [])
  const [activeCycleId, setActiveCycleID] = useState<string | null>(null)
  const [secondsAmountPassed, setSecondsAmountPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setSecondsAmountPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId
      }
    })
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, finishedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   })
    // )
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
      type: 'ADD_NEW_CYCLE',
      payload:{
        newCycle
      }
    })

    // setCycles((state) => [...state, newCycle])
    setActiveCycleID(id)
    setSecondsAmountPassed(0)

  }

  function interruptedCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload:{
        activeCycleId
      }
    })

    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id == activeCycleId) {
    //       return { ...cycle, interruptedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   })
    )
    setActiveCycleID(null)
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
        interruptedCycle
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
