import { Play } from "@phosphor-icons/react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, TaskInput } from "./styles";


export function Home(){
    return(
        <HomeContainer>
            <form action="">

                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                        type="text" 
                        id="task" 
                        placeholder="Dê um nome para o seu projeto"
                        list="taskList"
                    />
                    <datalist id="taskList">
                        <option value="Projeto1"/>
                        <option value="Projeto2"/>
                        <option value="Projeto3"/>
                        <option value="Projeto4"/>
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput 
                        type="number" 
                        id="minutesAmount" 
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
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

                <StartCountdownButton type="submit" >
                    <Play/>
                    Começar
                </StartCountdownButton>
            </form>
        </HomeContainer>
    )
}