"""
We can identify a circular import between hello_template/templates/__init__.py and hello_template/templates/hello/views.py,
where, in the former, we import views from the later, and in the latter, we import the app from the former.
So, this actually makes the two modules depend on each other.
"""
import os
import stripe
import json
from flask import render_template, Blueprint, Flask, request, jsonify, url_for, render_template_string

src_blueprint = Blueprint('src', __name__)

# Keys
stripe_keys = {
    "secret_key": "sk_test_51IW4PbInLj87z28QPPK0w2f19hbZYh08YbiYihpgR1Xs5BlcTKl2CcOpALSnXZEMZ8HsWcm4wAxb7DLDQOlpHfPv00PKwV8FOL",
    "publishable_key": "pk_test_51IW4PbInLj87z28QIe6fJXdQ6w6cAqd3tvPRMiXIs51J4T0lJQaxf1BCobZuiYLdHWzmEPUB3RVV6hizQaXSV4e400KmlZ32WK"
}
stripe.api_key = stripe_keys["secret_key"]

# Checkout route
YOUR_DOMAIN = 'http://localhost:5000/'

user_info = {}
endpoint_secret = 'whsec_nkPu31wk3sWLPJdM8Ms1uLsDr6EdUIAm'


@src_blueprint.route('/')
@src_blueprint.route('/src')
@src_blueprint.route('/views')
@src_blueprint.route('/', methods=['GET'])
def index():
    return render_template("/index.html", key=stripe_keys['publishable_key'])


global_amount = int()
# Checkout route


@src_blueprint.route('/checkout', methods=['GET', 'POST'])
def checkout():

    stripe.Token.create(
        card={
            "number": "4242424242424242",
            "exp_month": 3,
            "exp_year": 2022,
            "cvc": "314",
            "address_zip": "78741"
        }
    )

    # Just hardcoding amounts here to avoid using a database
    item = request.args.get('item')
    title = None
    amount1 = None
    error = None
    price_id = None
    if item == '1':
        title = 'The Art of Doing Science and Engineering'
        amount1 = 2300
        price_id = 'price_1IZjI2InLj87z28Q5sFQIcT3'
    elif item == '2':
        title = 'The Making of Prince of Persia: Journals 1985-1993'
        amount1 = 2500
        price_id = 'price_1IZjH7InLj87z28QyGkqXpi6'
    elif item == '3':
        title = 'Working in Public: The Making and Maintenance of Open Source'
        amount1 = 2800
        price_id = 'price_1IZjI2InLj87z28Q5sFQIcT3'

    else:
        # Included in layout view, feel free to assign error
        error = 'No item selected'
    amount = amount1
    global global_amount
    global_amount = amount
    print(price_id)
    try:
        if price_id == None:
            return render_template('/index.html', title=title, amount=amount, error=error)
        else:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price': price_id,
                    'quantity': 1,
                }],
                mode='payment',
                success_url=YOUR_DOMAIN +
                '/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=YOUR_DOMAIN + '/index.html',
            )
            checkout = render_template(
                '/checkout.html', title=title, amount=amount, error=error)

            return render_template('/checkout.html', title=title, amount=amount, error=error)

    except Exception as e:
        print(f'price_id:{price_id}')
        return jsonify(error=str(e)), 403

    except Exception as e:
        return jsonify(error=str(e)), 403


@src_blueprint.route('/secret', methods=['GET', 'POST'])
def secret():
    print(f'global_amount is {global_amount}')
    intent = stripe.PaymentIntent.create(
        amount=global_amount,
        currency='usd'
    )
    print(intent)
    print(intent['client_secret'])
    return jsonify({
        'clientSecret': intent['client_secret']
    })

# @src_blueprint.route('/webhook', methods=['GET', 'POST'])
# def my_webhook_view(request):
#     sig_header = request.META['HTTP_STRIPE_SIGNATURE']
#     payload = request.body
#     event = None

#     try:
#         event = stripe.Webhook.construct_event(
#             payload, sig_header, endpoint_secret
#         )
#     except ValueError as e:
#         # Invalid payload
#         return print('status=400')

#     # Handle the event
#     if event.type == 'payment_intent.succeeded':
#         payment_intent = event.data.object  # contains a stripe.PaymentIntent
#         print('PaymentIntent was successful!')
#     elif event.type == 'payment_method.attached':
#         payment_method = event.data.object  # contains a stripe.PaymentMethod
#         print('PaymentMethod was attached to a Customer!')
#     # ... handle other event types
#     else:
#         print('Unhandled event type {}'.format(event.type))

#     return render_template('/success.html')
# Success route


@src_blueprint.route('/success', methods=['GET'])
def success():
    #session = stripe.checkout.Session.retrieve(request.args.get('session_id'))
    #customer = stripe.Customer.retrieve(session.customer)
    amount = str(global_amount)
    amount = '$'+amount[:2] + '.' + amount[2:]
    print(amount)
    return render_template_string(
        '''<html>
    <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta name="theme-color" content="#000000" />
    <!-- Latest compiled and minified bootstrap CSS -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
      integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
      crossorigin="anonymous"
    />
    <link
      rel="stylesheet"
      href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
      integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
      crossorigin="anonymous"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Roboto:300,400"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="public/css/custom.css" />

    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />
    <script src="https://js.stripe.com/v3/"></script>
    <script src="https://polyfill.io/v3/polyfill.min.js?version=3.52.1&features=fetch"></script>

    <title>Buy cool new product</title>
  </head>
  <body>
    {% extends 'views/layouts/main.html' %} {% block content %}
    <div class="mt-40 text-center text-success">
      <h1>
        <i class="far fa-check-circle"></i>
        Success!
      </h1>
    </div>
    <div class="mt-40 text-center">
      <div class="mt-20 text-center text-secondary border-placeholder">
        Congratulations your payments was successful!
        You purchased a book for ''' + amount + '''
        <div id="app"></div>
      </div>
    </div>
    {% endblock %}
    <!-- ... other HTML ... -->

    <!-- Load React. -->
    <!-- Note: when deploying, replace "development.js" with "production.min.js". -->
    <script
      src="https://unpkg.com/react@17/umd/react.development.js"
      crossorigin
    ></script>
    <script
      src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"
      crossorigin
    ></script>

    <!-- Load our React component. -->
    <script src="success.js"></script>

    <script src="public/bundle.js" type="text/javascript"></script>
  </body>
</html>''')

    # return render_template('/success.html')


if __name__ == '__main__':
    src_blueprint.run(port=5000, host='0.0.0.0', debug=True)
