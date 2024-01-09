import React, { Fragment } from 'react';
import logo from './logo.png';
import './App.css';
import axios from 'axios';
import Sentence  from './Sentencebased';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
function App() {
 


  return (


    
    <Router>
  
  
     
         
        <Route exact path='/' component={Sentence} />
    
       
       
        
      
      </Router>

 
  );
}

export default App;
