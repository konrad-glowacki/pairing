var models = require("../models");

groups = [
  {
    slug: 'chwsm',
    name: 'Chrystus w Starym Mieście',
    description: '<p>Wpisz swój adres e-mail, na który będą przychodzić powiadomienia o wylosowanej parze. Co <b>2 tygodnie</b> będą losowane pary, które będą się za siebie modlić.</p><p><b>Potraktuj to zadanie poważnie!</b> Sprawdzaj skrzynkę w poniedziałki rano. Pod uwagę będą brane tylko poważne zgłoszenia.</p>'
  },

  {
    slug: 'sng',
    name: 'Sala na Górze',
    description: ''
  },

  {
    slug: 'schola',
    name: 'Schola Mariacka',
    description: ''
  }
]

groups.forEach(function(group) {
  models.Group.findOrCreate({
    where: { slug: group.slug },
    defaults: { name: group.name, description: group.description },
  }).spread(function(group, created) {
    if (created) {
      console.log("Group " + group.name + " created!");
    } else {
      console.log("Group " + group.name + " exsist!");
    }
  });
});
