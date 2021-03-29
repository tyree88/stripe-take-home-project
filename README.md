## About

This project is using the best of both worlds. The first is a python Flask backend which renders the Stripe APIs to start a purchase. Then a React front end that fetches from the Flask backend to complete and Post a purchase. 

This process starts when a user clicks a book to purchase and routes to the checkout page rendering the React file index.jsx. This uses the Stripe Elements from the @stripe/react-stripe-js package. Which gathers a stripePromise variable from loadStripe that inserts my stripe API publishible key into the main Wrapper Element. This Element contains the Checkout Form. The Checkout form gets a clientSceret key from the PaymentIntent API in Flask. This form gather the user credentials and does a "POST" to Flask checkout function after a submit with a handleSubmit async function. The Flask checkout function uses the stripe checkout session Api which routes to a success or cancel url based on success of purchase. The success Url shows a Congrats of purchase and the total amount of the charge. 

## How I approached the problem
I focused on the python project since my strengths gravitate toward python. However, I do not have much Flask experience. This required me to make a decision and determine how do I connect the backend to the front. My most previous front end experience is in React Native so the connection to Reach is predominatly seemless. Now Im thinking, "I have never connected python and react, where do I start". Research phase begins. 

First, I watch multiple tutorials on how a Flask, React, HTML project works and the structure for a setup. In addition, how does stripe fit into this. Luckily there are multiple docs using both flask and react. Furthermore, reading the accept a payment doc, sample integration doc, payment intent, building with stripe - React Stripe.js. Challenges arrose from unfamiliar errors within the stripe APIs, HTML not finding JS files, overall from lack of experience. the Stripe API errors I ran into was mostly due knowledge gaps on the React side. The success page was not able to pick my success.js which I think my webpack.config may have been the problem. This required a workaround in python using a render_template_string and inserting the book charge with a global varaible. Nevertheless, this project allowed me to connecting my two strengths in a way I have never done before.

## Extending the application
To Extend the application the focus would be with user interaction. I would want to build a webhook to constantly listen for trigger reactions. Also, show more warnings and alerts for edge cases. Include a cancel html file that still contains the cart data. Also send an email invoice. These are the next stages I would focus on for this application. 

## Instructions

Below are the installing and running procedues

### Installing

1. make sure you have python, npm, and pip installed on your machine.
   For this project, I used : **npm v7.5.3**, **pip v20.0**, **python v3.9.2**
2. Enter in to the directary templates/static/_ and run the command `npm install`. This will download and install all the dependencies listed in _package.json_.
3. In the static directory, start the npm watcher to build the front end code with the command `npm run watch`
4. Create a python virtualenv(Optional)
5. Install flask with the command `$ pip install flask`
6. Install Reactjs with the command `$ npm i react react-dom --save-dev`

### Running

1. Go to the root directory and start the server with `python run.py`
2. If all is working correctly, you will be given an address http://127.0.0.1:5000/ which you can open in your favorite browser and see our application running and displaying “Hello React!”
