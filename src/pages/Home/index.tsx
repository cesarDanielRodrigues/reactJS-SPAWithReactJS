import { Play } from "@phosphor-icons/react"
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from "./styles"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { differenceInSeconds } from "date-fns"

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
}

export function Home() {
  const [cycles, setCycles] = useState<Cycles[]>([])
  const [activeCycleID, setActiveCycleID] = useState<string | null>(null)
  const [secondsAmountPassed, setSecondsAmountPassed] = useState(0)
  
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleID)

  useEffect(()=>{
    if(activeCycle){
      setInterval(()=>{
        setSecondsAmountPassed(
          differenceInSeconds(new Date(), activeCycle.startDate)
        )
      }, 1000)
    }
  },[activeCycle])

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
      startDate: new Date()
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleID(id)

    reset()
  }


  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - secondsAmountPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  console.log(minutesAmount)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2,"0")
  const seconds = String(secondsAmount).padStart(2,"0")

  const task = watch("task")
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            placeholder="Dê um nome para o seu projeto"
            list="taskList"
            {...register("task")}
          />
          <datalist id="taskList">
            <option value="Projeto1" />
            <option value="Projeto2" />
            <option value="Projeto3" />
            <option value="Projeto4" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register("minutesAmount", { valueAsNumber: true })}
          />

          <span>minutes.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
