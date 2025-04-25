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
import {useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"

const newCycleFormSchema = z.object({
  task: z.string().min(1, "Digite o nome do projeto"),
  minutesAmount: z.number().min(5).max(60, "O valor informado não está entre 5 e 60 minutos"),
})

type NewCycleFormData = z.infer<typeof newCycleFormSchema>

interface Cycles{
  id: string,
  task: string,
  minutesAmount: number
}

export function Home() {
  const [cycles,setCycles] = useState<Cycles[]>([])
  const [activeCycleID,setActiveCycleID] = useState<string | null>(null)




  const { handleSubmit, register, watch, reset} = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormSchema),
    defaultValues:{
      task: '',
      minutesAmount: 0
      }
  })
 
  function handleCreateNewCycle(data: NewCycleFormData) {
    
    const  id = String(new Date().getTime())

    const newCycle: Cycles = {
      id: id,
      task: data.task,
      minutesAmount: data.minutesAmount
    }

    setCycles(state => [...state,newCycle])
    setActiveCycleID(id)

    reset()
  }
  
  const activeCycle = cycles.find(cycle => cycle.id === activeCycleID)

  console.log(activeCycle)


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
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
