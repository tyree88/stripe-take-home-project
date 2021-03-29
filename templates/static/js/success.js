import React,{useState} from 'react';
import ReactDOM from 'react-dom';
import './cardSectionStyles.css'
import {
  CardElement,
  Elements,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";
import {loadStripe} from '@stripe/stripe-js';
//components
import {email,name,phone,CheckoutForm} from './components/CheckoutForm'

import './components/App.css'
const stripePromise = loadStripe('pk_test_51IW4PbInLj87z28QIe6fJXdQ6w6cAqd3tvPRMiXIs51J4T0lJQaxf1BCobZuiYLdHWzmEPUB3RVV6hizQaXSV4e400KmlZ32WK');
// data-description="A Flask Charge"
// data-amount="500"
// data-locale="auto"
// Dont call load stripe within the render method of the component
// dont load more then what you have to.


function Success(){

  return (
      <div>
        <h1>Hello World</h1>
      </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
export default Success;