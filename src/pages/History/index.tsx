import { useContext } from "react"
import { HistoryContainer, HistoryList, Status } from "./styles"
import { CyclesContext } from "../../contexts/CycleContext"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export function History() {
  const { cycles } = useContext(CyclesContext)
  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>
      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => {
              return (
                <tr id={cycle.id}>
                  <td>{cycle.task}</td>
                  <td>{cycle.minutesAmount} minutos</td>
                  <td>
                    {formatDistanceToNow(cycle.startDate,{
                        locale: ptBR,
                        addSuffix: true
                    })}
                </td>
                  <td>
                    {cycle.finishedDate && <Status statusProps="green">Concluído</Status>}
                    {cycle.interruptedDate && <Status statusProps="red">Interrompido</Status>}
                    {!cycle.finishedDate && !cycle.interruptedDate && <Status statusProps="yellow">Em andamento</Status>}
                </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
