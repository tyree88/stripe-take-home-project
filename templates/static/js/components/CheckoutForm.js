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

   const handleSubmit = async () => {
    console.log(elements);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
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