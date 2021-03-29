import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  CardElement,
  Elements,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";
import styled from "@emotion/styled";
import {loadStripe} from '@stripe/stripe-js';
import '../../js/cardSectionStyles.css';
export let name, email, phone ; // also var, const

 // also var, const
const stripePromise = loadStripe('pk_test_51IW4PbInLj87z28QIe6fJXdQ6w6cAqd3tvPRMiXIs51J4T0lJQaxf1BCobZuiYLdHWzmEPUB3RVV6hizQaXSV4e400KmlZ32WK');

const CheckoutForm = (props,{success})=>{
  const stripe = useStripe();
  const elements = useElements();
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    window
      .fetch("/secret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"

        },
        body: JSON.stringify({items: [{ id: "book"}]})
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setClientSecret(data.clientSecret);
      });
  }, []);

  const handleSubmit = async ev => {
    ev.preventDefault();
    setProcessing(true);
    var response = fetch('/secret').then(function(response) {
      return response.json();
    }).then(function(responseJson) {
      var clientSecret = responseJson.client_secret;
      // Render the form to collect payment details, then
      // call stripe.confirmCardPayment() with the client secret.
    });
    console.log(response)
    console.log("Test")
    console.log(clientSecret)
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: name,
        },
      }
    });

      if (result.error) {
        // Show error to your customer (e.g., insufficient funds)
        console.log(result.error.message);
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === 'succeeded') {
          // Show a success message to your customer
          // There's a risk of the customer closing the window before callback
          // execution. Set up a webhook or plugin to listen for the
          // payment_intent.succeeded event that handles any business critical
          // post-payment actions.
          //window.location.href = "/success"
          //success();
          console.log(success);
          window.location.href = "/success"

        }
      }

  }
    return (
    <div className = "AppWrapper">
    <form id="payment-form" className="Form" onSubmit={handleSubmit}>

      <fieldset className="FormGroup">
        <Field
          label="Name"
          id="name"
          type="text"
          placeholder="Jane Doe"
          required
          autoComplete="name"
          value = {name}
        />
        <Field
          label="Email"
          id="email"
          type="email"
          placeholder="janedoe@gmail.com"
          required
          autoComplete="email"
          value = {email}
        />
        <Field
          label="Phone"
          id="phone"
          type="tel"
          placeholder="(941) 555-0123"
          required
          autoComplete="tel"
          value = {phone}
        />
      </fieldset>
      <CardElementContainer>        
        <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS}/>
      </CardElementContainer>
      
      <button disabled={!stripe} onClick={handleSubmit} >Confirm order</button>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      {/* Show a success message upon completion */}
    </form>

    </div>
    );
};

const CardElementContainer = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  & .StripeElement {
    width: 100%;
    padding: 15px;
  }
`;
const CARD_ELEMENT_OPTIONS = {
  
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
const Field = ({
  label,
  id,
  type,
  placeholder,
  required,
  autoComplete,
  value,
  onChange
}) => (
  <div className="FormRow">
    <label htmlFor={id} className="FormRowLabel">
      {label}
    </label>
    <input
      className="FormRowInput"
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
    />
  </div>
);
export default CheckoutForm;