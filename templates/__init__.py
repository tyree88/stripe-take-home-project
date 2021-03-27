"""
Loading Static files: If there exists a folder named static at the application’s root level, that is, at the same level as run.py,
then Flask will automatically read the contents of the folder without any extra configuration. 
Alternatively, we can provide a parameter named static_folder to the application object while defining the application in hello_template/templates/__init__.py file
"""

from flask import Flask
app = Flask(__name__,
 	static_folder = './public',
 	template_folder="./static")

from templates.src.views import src_blueprint
"""
Making our web app modular with blueprints: A blueprint is a concept in Flask that helps make larger applications really modular. 
It is actually a set of operations that can be registered on an application and represents how to construct or build an application.
We will modify our views to work using blueprints.
"""
# register the blueprints
app.register_blueprint(src_blueprint)
