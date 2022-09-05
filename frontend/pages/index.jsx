import { useState } from "react"
import DataTable from "../components/data-table/index.component"
import Filters from "../components/filters/index.component"

const fetchLifterData = async (gender, start, stop) => {
  const bodyContent = JSON.stringify({
    "gender": gender || "male",
    "start": start || 0,
    "stop": stop || 500
  })

  const res = await fetch('https://owl-production-backend.herokuapp.com/api/leaderboard', {
    method: "POST",
    headers: {
      "Accept": "*/*",
      "Content-Type": "application/json"
    },
    body: bodyContent
  }).catch((error) => console.error(error))

  return await res.json()
}

const Home = ({ data }) => {
  const [currentGender, setCurrentGender] = useState("male")
  const [currentLifterList, setCurrentLifterList] = useState(data)

  const handleGenderChange = async (event) => {
    const newGender = event.target.value

    if (newGender !== currentGender) {
      setCurrentGender(newGender)

      const newLifters = await fetchLifterData(newGender, 0, 500)

      setCurrentLifterList(newLifters)
    }
  }

  return (
    <>
      <Filters currentGender={currentGender} handleGenderChange={handleGenderChange} />
      <div style={{ overflowX: "scroll" }}>
        {currentLifterList && <DataTable lifters={currentLifterList} />}
      </div>
    </>
  )
}


export async function getServerSideProps() {
  const data = await fetchLifterData()

  return { props: { data } }
}

export default Home
