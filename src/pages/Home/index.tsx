import {
  HomeContainer, StartCountdownButton, StopCountdownButton
} from "./styles"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { differenceInSeconds } from "date-fns"
import { Play, HandPalm } from "@phosphor-icons/react"
import { Countdown } from "./Components/Countdown"
import { NewCycleForm } from "./Components/NewCycleForm"

const newCycleFormSchema = z.object({
  task: z.string().min(1, "Digite o nome do projeto"),
  minutesAmount: z.number().min(5).max(60, "O valor informado não está entre 5 e 60 minutos"),
})

type NewCycleFormData = z.infer<typeof newCycleFormSchema>

interface Cycles {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycles[]>([])
  const [activeCycleID, setActiveCycleID] = useState<string | null>(null)
  const [secondsAmountPassed, setSecondsAmountPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleID)
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate)

        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleID) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            })
          )

          setSecondsAmountPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsAmountPassed(secondsDifference)
        }
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, activeCycleID, totalSeconds])

  const { handleSubmit, register, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  })

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())

    const newCycle: Cycles = {
      id: id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleID(id)
    setSecondsAmountPassed(0)

    reset()
  }

  function handleInterruptedCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id == activeCycleID) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      })
    )
    setActiveCycleID(null)
  }

  const currentSeconds = activeCycle ? totalSeconds - secondsAmountPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, "0")
  const seconds = String(secondsAmount).padStart(2, "0")

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds} - ${activeCycle.task}`
    }
  }, [minutes, seconds, activeCycle])

  const task = watch("task")
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <NewCycleForm/>

        <Countdown />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptedCycle}>
            <HandPalm />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
