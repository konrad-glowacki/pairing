exports.index = function(req, res) {
  res.render('index');
};

exports.saveUser = function(req, res) {
  if (req.form.isValid) {
    res.render('thanks', { email: req.form.email });
  } else {
    res.render('index', {
      name: req.form.name,
      surname: req.form.surname,
      email: req.form.email,
      errors: req.form.errors
    });
  }
};
