import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Dashboard from './Components/Dashboard';
import './App.css'
import Event from './Components/Events/Event';
import EventForm from './Components/Events/EventForm';
import BloodDonation from './Components/BloodDonation/BloodDonation';
import Signup from './Components/Signup'
import Hostelvacc from './Components/Hostelvacc'
import Vacancyform from './Components/Vacancyform'
import MyPosts from './Components/MyPosts'
import Login from './Components/Login'


function App() {
  return (
    <div >
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path='/Dashboard' element={<Dashboard/>}/>
        <Route path='/Event' element={<Event/>}/>
        <Route path='/EventForm' element={<EventForm/>}/>
        <Route path='/BloodDonation' element={<BloodDonation/>}></Route>
        <Route path='/Signup' element={<Signup/>}/>
        
                
        <Route path="/Hostelvacc" element={<Hostelvacc/>} />
        <Route path="/Vacancyform" element={<Vacancyform/>} />
        <Route path="/myposts" element={<MyPosts/>}/>

      </Routes>
      </BrowserRouter>
    
    </div>
  );
}

export default App;
