var models = require("../models");

models.Group.create({
  id: 1,
  name: 'Chrystus w Starym Mieście',
  slug: 'chwsm'
}).complete(function(err, user) {
  console.log('Group ChwSM created!');
});
