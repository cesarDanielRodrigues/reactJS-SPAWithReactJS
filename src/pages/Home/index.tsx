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

const newCycleFormSchema = z.object({
  task: z.string().min(1, "Digite o nome do projeto"),
  minutesAmount: z.number().min(5).max(60, "O valor informado não está entre 5 e 60 minutos"),
})

export function Home() {
  const { handleSubmit, register, watch} = useForm({
    resolver: zodResolver(newCycleFormSchema),
  })

  function handleCreateNewCycle(data: any) {
    console.log(data)
  }
  

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
