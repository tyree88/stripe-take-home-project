'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { loadStripe } from '@stripe/stripe-js';
import { styles } from './public/css/style.css';
import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_51IW4PbInLj87z28QIe6fJXdQ6w6cAqd3tvPRMiXIs51J4T0lJQaxf1BCobZuiYLdHWzmEPUB3RVV6hizQaXSV4e400KmlZ32WK");

ReactDOM.render(<App />, document.getElementById('root'));
export class CheckoutButton extends React.Component {

  // Create an instance of the Stripe object with your publishable API key
  var stripe = Stripe(
    "pk_test_51IW4PbInLj87z28QIe6fJXdQ6w6cAqd3tvPRMiXIs51J4T0lJQaxf1BCobZuiYLdHWzmEPUB3RVV6hizQaXSV4e400KmlZ32WK"
  );
  var checkoutButton = document.getElementById(
    "checkout-button"
  );
  checkoutButton.addEventListener("click", function () {
    fetch("/create-checkout-session", {
      method: "POST",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (session) {
        return stripe.redirectToCheckout({
          sessionId: session.id,
        });
      })
      .then(function (result) {
        // If redirectToCheckout fails due to a browser or network
        // error, you should display the localized error message to your
        // customer using error.message.
        if (result.error) {
          alert(result.error.message);
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  });
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'Checkout';
    }

    return (
      <button style={styles.checkoutButton} onClick={() => this.setState({ liked: true }) }>
        Checkout Button for the CHECKOUT!!
      </button>
    );
  }
}
export default CheckoutButton;


ReactDOM.render(<CheckoutButton />, domContainer);

//const styles = Stylesheet