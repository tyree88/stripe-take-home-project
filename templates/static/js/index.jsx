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
import CheckoutForm,{email,name,phone,success} from './components/CheckoutForm'

import './components/App.css'
const stripePromise = loadStripe('pk_test_51IW4PbInLj87z28QIe6fJXdQ6w6cAqd3tvPRMiXIs51J4T0lJQaxf1BCobZuiYLdHWzmEPUB3RVV6hizQaXSV4e400KmlZ32WK');
// data-description="A Flask Charge"
// data-amount="500"
// data-locale="auto"
// Dont call load stripe within the render method of the component
// dont load more then what you have to.
declare var Success;

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {
        color: "#fce883"
      },
      "::placeholder": {
        color: "#87bbfd"
      }
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee"
    }
  }
};

function App() {
  const [status,setStatus] = React.useState("ready");

  if (status ==="success"){
    return <div>Congrats on your Purchase!</div>
  }
  return (
      <Elements stripe ={stripePromise} >
              <CheckoutForm options={CARD_OPTIONS} success={() => {
                setStatus("success");
              }}/>
      </Elements>
  );

}
console.log(email);
function Success(){

  return (
      <div>
        <h1>Hello World</h1>
      </div>
  );
}
console.log('success?',success);
if (success ==="undefined"){
  ReactDOM.render(<Success />, document.getElementById('root'));
}
else{
  ReactDOM.render(<App />, document.getElementById('root'));

}
//ReactDOM.render(<App />, document.getElementById('root'));

  // Prepare the styles for Elements.
  const style = {
    base: {
      iconColor: '#666ee8',
      color: '#31325f',
      fontWeight: 400,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '15px',
      '::placeholder': {
        color: '#aab7c4',
      },
      ':-webkit-autofill': {
        color: '#666ee8',
      },
    },
  };
  export default window.Success;