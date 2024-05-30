/* Käyttäjien listaus ja CRUD-toiminnot */
import { useRef,useState,useEffect } from 'react'
import { Error, Button } from '../components/Styles'
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { urlRestapi, useGetData, useSaveData } from '../yhteydet'
import { useAuth } from './Auth'
// import User from '../components/User'
import { UserPieChart,UserBarChart } from '../components/Pie'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-material.css';
import 'ag-grid-community/styles/ag-theme-alpine.css'
import ActionCellRenderer from '../components/ActionCellRenderer'


const Kayttajat = () => {
  const [gridHeight, setGridHeight] = useState(700);
  const rowHeight = 40; // Default row height in pixels
  const url = urlRestapi + '/users'
  const saveUrl = urlRestapi + '/save_active'
  const { authTokens } = useAuth()
  const gridRef = useRef()   

  const { 
    dataLoading, 
    data,
    error,
    clear:getClear } = useGetData({ url, authTokens })

  const { 
    dataLoading:saveLoading, 
    data:saveData,
    error:saveError,
    success:saveSuccess,
    clear:saveClear,
    tallenna } = useSaveData({'url':saveUrl,authTokens })

  console.log('Kayttajat,url:', url, 
  'saveData:', saveData, 
  'saveError:', saveError,
  'saveSuccess:', saveSuccess, 
  'saveLoading:', saveLoading, 
  'dataLoading:', dataLoading
  )

  useEffect(() => {
 /* Ag-Gridin korkeus täytyy määrittää rivien lukumäärästä. 
    Reunat näyttävät vievän 2 px. */   
    if (data && data.length) {
      const height = data.length * (rowHeight + 2);
      console.log('Kayttajat,height:',height,'riveja:', data.length);
      setGridHeight(height);
      }
  }, [data]);

  useEffect(() => {
    console.log('Kayttajat,useEffect timeout saveData:', saveData);
    const timer = setTimeout(() => {
      getClear();
      saveClear();
      }, 10000);
    /* Huom. palautetaan komponenttia purettaessa (unmount) ja myös
       ennen useEffectia suoritettava funktio. */
    return () => clearTimeout(timer);
    /* Huom. Linting vaatii myös käytetyt funktiot riippuvuuksiksi
       Toisalta ilman useCallbackia funktio uusitaan jokaisessa renderöinnissä,
       mikä myöskin vaatisi sen lisäämistä riippuvuudeksi. 
    */ 
    }, [saveClear,getClear,saveData]);

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

  const tallennaData = () => {
    const data = [];
    gridRef.current.api.forEachNode(node => {
      data.push({ 'id': node.data.id, 'active': node.data.active });
      });
    console.log('Generated data:', JSON.stringify(data, null, 2));
    tallenna(data)
    }

return (
    <>
    <h1>Käyttäjät</h1>
    {dataLoading && <p>Käyttäjien haku on käynnissä...</p>}
    {saveLoading && <p>Tietoja tallennetaan...</p>}
    {/*<ul style={{ }}>
    {data && data.map(user => <User key={user.id} user={user} />)}
    </ul>*/}

    <div className="ag-theme-alpine" style={{ height:gridHeight,width:'95vw',marginBottom:10 }}>
    <AgGridReact 
        ref={gridRef}
        rowData={data} 
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowHeight={rowHeight}
        />
    </div>
    <Button 
    variant="outlined"
    onClick={tallennaData}>
    Tallenna muutokset
    </Button>

    {error && <Error>{error}</Error>}
    {saveError && <Error>{saveError}</Error>}
    {saveSuccess &&
    <Alert 
    //variant='outlined'
    onClose={() => saveClear()}
    icon={<CheckIcon fontSize="inherit"/>} 
    severity="success">
    {saveSuccess}
    </Alert>}
    <div style={{ width:'60vw', display: 'flex',height:'200px', gap:'20px' }}>
    <div style={{ width: '25vw', flex:1 }}>
    {data && <UserPieChart
    activeUsers={data.filter(user => user.active).length}
    inactiveUsers={data.filter(user => !user.active).length}
    />}
    </div>
    <div style={{ width: '25vw',flex:1 }}>
    {data && <UserBarChart 
    activeUsers={data.filter(user => user.active).length}
    inactiveUsers={data.filter(user => !user.active).length}
    />}
    </div>
    </div>
    </>
    )  
  }

export default Kayttajat  