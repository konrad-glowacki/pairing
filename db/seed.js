var models = require("../models");

groups = [
  {
    slug: 'chwsm',
    name: 'Chrystus w Starym Mieście',
    description: ''
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
