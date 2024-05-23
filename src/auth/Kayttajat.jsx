/* Käyttäjien listaus ja CRUD-toiminnot */
import { Error } from '../components/Styles'
import { urlRestapi, useGetData } from '../yhteydet'
import { useAuth } from './Auth'
// import User from '../components/User'
import UserPieChart from '../components/Pie'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-material.css';
import 'ag-grid-community/styles/ag-theme-alpine.css'
import ActionCellRenderer from '../components/ActionCellRenderer'


const Kayttajat = () => {
  const url = urlRestapi + '/users'
  const { authTokens } = useAuth()
  const { 
    dataLoading, 
    data,
    error } = useGetData({url, authTokens })
  
const columnDefs = [
    { field: 'username',flex: 1, filter: true },
    { field: 'email',flex: 1, filter: true },
    { field: 'active',flex: 1, filter: true, editable: true },
    { headerName: 'Toiminnot',
      field: 'toiminnot', 
      cellRenderer: ActionCellRenderer,
      flex: 1, 
      filter: false }
    ]  

const defaultColDef = {
    resizable: true
    }

return (
    <>
    <h1>Käyttäjät</h1>
    {dataLoading && <p>Käyttäjien haku on käynnissä...</p>}
    {error && <Error>{error}</Error>}
    {/*<ul style={{ }}>
    {data && data.map(user => <User key={user.id} user={user} />)}
    </ul>*/}

    <div className="ag-theme-alpine" style={{height: 400, width: '90vw'}}>
    <AgGridReact 
        rowData={data} 
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        />
    </div>
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