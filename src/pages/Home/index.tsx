import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles"
import { useContext } from "react"
import { Play, HandPalm } from "@phosphor-icons/react"
import { Countdown } from "./Components/Countdown"
import { NewCycleForm } from "./Components/NewCycleForm"
import { z } from "zod"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CyclesContext } from "../../contexts/CycleContext"


const newCycleFormSchema = z.object({
  task: z.string().min(1, "Digite o nome do projeto"),
  minutesAmount: z.number().min(5).max(60, "O valor informado não está entre 5 e 60 minutos"),
})

type NewCycleFormData = z.infer<typeof newCycleFormSchema>

export function Home() {
  const {createNewCycle, activeCycle, interruptedCycle} = useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch } = newCycleForm


  const task = watch("task")
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(createNewCycle)} action="">
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        {activeCycle ? (
          <StopCountdownButton type="button" onClick={interruptedCycle}>
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
