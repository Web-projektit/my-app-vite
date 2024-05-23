/* Käyttäjien listaus ja CRUD-toiminnot */
import { Error } from '../components/Styles'
import { urlRestapi, useGetData } from '../yhteydet'
import { useAuth } from './Auth'
import User from '../components/User'
import UserPieChart from '../components/Pie'



const Kayttajat = () => {
  const url = urlRestapi + '/users'
  const { authTokens } = useAuth()
  const { 
    dataLoading, 
    data,
    error } = useGetData({url, authTokens })
  
  return (
    <>
    <h1>Käyttäjät</h1>
    {dataLoading && <p>Käyttäjien haku on käynnissä...</p>}
    {error && <Error>{error}</Error>}
    <ul style={{ }}>
    {data && data.map(user => <User key={user.id} user={user} />)}
    </ul>
    <div style={{ width: '25vw' }}>
    {data && <UserPieChart
    activeUsers={data.filter(user => user.active).length}
    inactiveUsers={data.filter(user => !user.active).length}
    />}
    </div>
    </>
    )  
  }

export default Kayttajat  