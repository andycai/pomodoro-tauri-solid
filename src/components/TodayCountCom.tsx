import { changeAudio, playAudio } from "../utils"
import { WorkType } from "../config"
import { AccessTime, CoffeeOutlined } from "@suid/icons-material"
import { useToday, useTotal, useWorkType } from "../store/store"

function TodayCountCom() {
  const [today] = useToday()
  const [total] = useTotal()
  const [workType] = useWorkType()

  // const className = "absolute bottom-1 left-1 flex align-bottom"
  const className = "flex flex-row flex-none ml-1"
  console.log("render today count: ", today(), total())

  const onClick = () => {
    playAudio(changeAudio())
  }

  return (
    <div class={className}>
      {
        workType() === WorkType.Work ? <AccessTime fontSize="medium" onclick={onClick} /> : <CoffeeOutlined onClick={onClick} />
      }
      <span class="text-xs pt-2" >{total()}/{today()}</span>
    </div>
  )
}

export default TodayCountCom