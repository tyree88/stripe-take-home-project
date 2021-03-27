"""
We can identify a circular import between hello_template/templates/__init__.py and hello_template/templates/hello/views.py,
where, in the former, we import views from the later, and in the latter, we import the app from the former.
So, this actually makes the two modules depend on each other.
"""
import os
import stripe

from flask import render_template, Blueprint, Flask, request, jsonify, url_for

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


@src_blueprint.route('/')
@src_blueprint.route('/src')
@src_blueprint.route('/views')
@src_blueprint.route('/', methods=['GET'])
def index():
    return render_template("/index.html")


# Checkout route


@src_blueprint.route('/checkout', methods=['GET'])
def checkout():
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': 'T-shirt',
                },
                'unit_amount': 2000,
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=YOUR_DOMAIN + '?success=true',
        cancel_url=YOUR_DOMAIN + '?index=true',
    )

    id_seesion = jsonify(id=session.id)

    # Just hardcoding amounts here to avoid using a database
    item = request.args.get('item')
    title = None
    amount = None
    error = None

    if item == '1':
        title = 'The Art of Doing Science and Engineering'
        amount = 2300
    elif item == '2':
        title = 'The Making of Prince of Persia: Journals 1985-1993'
        amount = 2500
    elif item == '3':
        title = 'Working in Public: The Making and Maintenance of Open Source'
        amount = 2800
    else:
        # Included in layout view, feel free to assign error
        error = 'No item selected'

    intent = stripe.PaymentIntent.create(
        amount=1099,
        currency='usd',
        # Verify your integration in this guide by including this parameter
        metadata={'integration_check': 'accept_a_payment'},
    )

    return render_template('/checkout.html', title=title, amount=amount, error=error)

# Success route


@src_blueprint.route('/success', methods=['GET'])
def success():
    return render_template('success.html')


@src_blueprint.route('/secret', methods=['POST'])
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
