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

    if item == '1':
        title = 'The Art of Doing Science and Engineering'
        amount1 = 2300

    elif item == '2':
        title = 'The Making of Prince of Persia: Journals 1985-1993'
        amount1 = 2500

    elif item == '3':
        title = 'Working in Public: The Making and Maintenance of Open Source'
        amount1 = 2800

    else:
        # Included in layout view, feel free to assign error
        error = 'No item selected'

    # intent = stripe.PaymentIntent.create(
    #     amount=amount1,
    #     currency='usd',
    #     # Verify your integration in this guide by including this parameter
    #     metadata={'integration_check': 'accept_a_payment'},
    # )
    # id_seesion = jsonify(id=session.id)
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price': ,
            'quantity': 1,
        }],
        mode='payment',
        payment_intent_data={
            'capture_method': 'manual',
        },

        success_url=YOUR_DOMAIN + 'success.html=true',
        cancel_url=YOUR_DOMAIN + 'index.html=true',
    )

    return render_template('/checkout.html', title=title, amount=amount1, error=error), amount1


@src_blueprint.route('/create-payment-intent', methods=['POST'])
def create_payment():
    amount = checkout()
    print(amount)
    try:
        data = json.loads(request.data)
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd'
        )
        return jsonify({
            'clientSecret': intent['client_secret']
        })
    except Exception as e:
        return jsonify(error=str(e)), 403
# Success route
# def my_webhook_view(request):
#   payload = request.body
#   sig_header = request.META['HTTP_STRIPE_SIGNATURE']
#   event = None

#   try:
#     event = stripe.Webhook.construct_event(
#       payload, sig_header, endpoint_secret
#     )
#   except ValueError as e:
#     # Invalid payload
#     return HttpResponse(status=400)
#   except stripe.error.SignatureVerificationError as e:
#     # Invalid signature
#     return HttpResponse(status=400)

#   # Passed signature verification
#   return HttpResponse(status=200)


@src_blueprint.route('/success', methods=['GET'])
def success():
    # session = stripe.checkout.Session.retrieve(request.args.get('session_id'))
    # customer = stripe.Customer.retrieve(session.customer)
    # return render_template_string('<html><body><h1>Thanks for your order, {{customer.name}}!</h1></body></html>')

    return render_template('/success.html')


@ src_blueprint.route('/secret', methods=['POST'])
def secret():

    intent = stripe.PaymentIntent.create(
        amount=1099,
        currency='usd',
        # Verify your integration in this guide by including this parameter
        metadata={'integration_check': 'accept_a_payment'},
    )
    return jsonify(client_secret=intent.client_secret)


if __name__ == '__main__':
    src_blueprint.run(port=5000, host='0.0.0.0', debug=True)
