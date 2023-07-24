from flask import Blueprint, render_template

from Stats.complex.forms import NormalForm, BinomialForm, ChiSquaredForm, FForm, TForm
from Stats.complex.utils import Distributions

complex_stats = Blueprint("complex", __name__)

functions = ["normal", "binomial", "f-distribution", "t-distribution", "chi-squared-distribution", "More To Come!"]
accuracy = 4


@complex_stats.route("/complex", methods=["GET", "POST"])
def home():
    return render_template("complex_home.html", functions=functions)


@complex_stats.route("/complex/normal", methods=["GET", "POST"])
def normal():
    form = NormalForm()
    mean, standard_deviation, x = 0, 0, 0
    calculator = Distributions(accuracy)
    if form.validate_on_submit():
        mean = form.mean.data
        standard_deviation = form.standard_deviation.data
        x = form.x.data

    distribution_name = "Normal Distribution"
    probability = calculator.normal(mean, standard_deviation, x)
    return render_template("normal.html", functions=functions, form=form, probability=probability, distribution_name=distribution_name)


@complex_stats.route("/complex/binomial", methods=["GET", "POST"])
def binomial():
    x, n, p = 0, 0, 0
    form = BinomialForm()
    calculator = Distributions(accuracy)
    if form.validate_on_submit():
        n = form.n.data
        p = form.p.data
        x = form.x.data

    distribution_name = "Binomial Distribution"
    probability, mean, variance, standard_deviation = calculator.binomial(n=n, p=p, x=x)
    return render_template("binomial.html", functions=functions, form=form, probability=probability, mean=mean,
                           variance=variance, standard_deviation=standard_deviation, distribution_name=distribution_name)


@complex_stats.route("/complex/t-distribution", methods=["GET", "POST"])
def t_distribution():
    form = TForm()
    freedom, x = 0, 0
    calculator = Distributions(accuracy)
    if form.validate_on_submit():
        freedom = form.freedom.data
        x = form.x.data

    distribution_name = "T Distribution"
    probability = calculator.t_distribution(x=x, freedom=freedom)
    return render_template("t_distribution.html", functions=functions, form=form, probability=probability, distribution_name=distribution_name)


@complex_stats.route("/complex/f-distribution", methods=["GET", "POST"])
def f_distribution():
    form = FForm()
    freedom_n, freedom_d, x = 0, 0, 0
    calculator = Distributions(accuracy)
    if form.validate_on_submit():
        freedom_n = form.freedom_n.data
        freedom_d = form.freedom_d.data
        x = form.x.data

    distribution_name = "F Distribution"
    probability = calculator.f_distribution(x=x, freedom_n=freedom_n, freedom_d=freedom_d)
    return render_template("f_distribution.html", functions=functions, form=form, probability=probability, distribution_name=distribution_name)


@complex_stats.route("/complex/chi-squared-distribution", methods=["GET", "POST"])
def chi_squared():
    form = ChiSquaredForm()
    freedom, chi_square = 0, 0
    calculator = Distributions(accuracy)
    if form.validate_on_submit():
        freedom = form.freedom.data
        chi_square = form.chi_square.data

    distribution_name = "Chi Squared Distribution"
    probability = calculator.chi_squared_distribution(chi_square=chi_square, freedom=freedom)
    return render_template("chi_squared_distribution.html", functions=functions, form=form, probability=probability, distribution_name=distribution_name)
