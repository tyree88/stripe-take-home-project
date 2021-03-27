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





const CheckoutForm = (props)=>{
  const stripe = useStripe();
  const elements = useElements();


  const [paymentRequest, setPaymentRequest] = useState(null);
    useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    window
      .fetch("/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({items: [{ id: "xl-tshirt" }]})
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setClientSecret(data.clientSecret);
      });
    }, []);
  
  const handleSubmit = async () => {
    console.log(elements);
    console.log("HEEELO")
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    // setProcessing(true);

        
    return stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });

     
    paymentRequest.on('paymentmethod', async (ev) => {
    // Confirm the PaymentIntent without handling potential next actions (yet).
    const {paymentIntent, error: confirmError} = await stripe.confirmCardPayment(
      clientSecret,
      {payment_method: ev.paymentMethod.id},
      {handleActions: false}
    );
    console.log(paymentIntent,'This is payment intent');

    // window.location.href = "/success"



    if (confirmError) {
      // Report to the browser that the payment failed, prompting it to
      // re-show the payment interface, or show an error message and close
      // the payment interface.
      ev.complete('fail');
    } else {
      // Report to the browser that the confirmation was successful, prompting
      // it to close the browser payment method collection interface.
      ev.complete('success');
      // Check if the PaymentIntent requires any actions and if so let Stripe.js
      // handle the flow. If using an API version older than "2019-02-11" instead
      // instead check for: `paymentIntent.status === "requires_source_action"`.
      if (paymentIntent.status === "requires_action") {
        // Let Stripe.js handle the rest of the payment flow.
        const {error} = await stripe.confirmCardPayment(clientSecret);
        if (error) {
          // The payment failed -- ask your customer for a new payment method.
          console.log('NEW PAYMENT PLEASE')
          alert(paymentIntent.error.message);

        } else {
          // The payment has succeeded.
          window.location.href = '/success.html'
        }
      } else {
        con
        // The payment has succeeded.
      }
    }
  });
    console.log(error)
    console.log(paymentMethod)
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

        />
        <Field
          label="Email"
          id="email"
          type="email"
          placeholder="janedoe@gmail.com"
          required
          autoComplete="email"

        />
        <Field
          label="Phone"
          id="phone"
          type="tel"
          placeholder="(941) 555-0123"
          required
          autoComplete="tel"
        />
      </fieldset>
      <CardElementContainer>        
        <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS}/>
      </CardElementContainer>
      
      <button disabled={!stripe} onClick={handleSubmit}>Confirm order</button>
      {/* {error && <ErrorMessage>{error.message}</ErrorMessage>} */}

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