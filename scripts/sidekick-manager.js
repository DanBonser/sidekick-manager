Hooks.once('init', async function() {
  console.log('Sidekick Manager | Initializing Sidekick Manager module');
});

Hooks.once('ready', async function() {
  console.log('Sidekick Manager | Sidekick Manager module is ready');
});

Hooks.on('renderActorSheet5eCharacter', (app, html, data) => {
  let actor = app.object;
  if (actor.type !== 'character') return;

  let levelInput = `
    <div class="form-group">
      <label>Sidekick Level:</label>
      <select id="sidekick-level">
        ${Array.from({length: 20}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}
      </select>
    </div>
  `;

  html.find('.tab.attributes').append(levelInput);

  html.find('#sidekick-level').change(async (event) => {
    let newLevel = parseInt(event.target.value);
    await levelUpSidekick(actor, newLevel);
  });
});

async function levelUpSidekick(actor, newLevel) {
  const sidekickFeatures = {
    1: {
        features: ["Bonus Proficiencies", "Helpful"],
        abilities: {
            str: 10,
            dex: 15,
            con: 12,
            int: 13,
            wis: 10,
            cha: 14
        },
        skills: {
            acrobatics: 4,
            performance: 4,
            persuasion: 4,
            sleightofhand: 4,
            stealth: 4
        },
        savingThrows: ["dex"]
    },
    2: {
        features: ["Cunning Action"],
        abilities: {}
    },
    3: {
        features: ["Expertise"],
        abilities: {}
    },
    4: {
        features: ["Ability Score Improvement"],
        abilities: {}
    },
    6: {
        features: ["Coordinated Strike"],
        abilities: {}
    },
    7: {
        features: ["Evasion"],
        abilities: {}
    },
    8: {
        features: ["Ability Score Improvement"],
        abilities: {}
    },
    10: {
        features: ["Ability Score Improvement"],
        abilities: {}
    },
    11: {
        features: ["Inspiring Help (1d6)"],
        abilities: {}
    },
    12: {
        features: ["Ability Score Improvement"],
        abilities: {}
    },
    14: {
        features: ["Reliable Talent"],
        abilities: {}
    },
    15: {
        features: ["Expertise"],
        abilities: {}
    },
    16: {
        features: ["Ability Score Improvement"],
        abilities: {}
    },
    18: {
        features: ["Sharp Mind"],
        abilities: {},
        choices: [
            {
                type: "proficiency",
                options: ["int", "wis", "cha"],
                description: "Choose a saving throw proficiency to gain: Intelligence, Wisdom, or Charisma."
            }
        ]
    },
    19: {
        features: ["Ability Score Improvement"],
        abilities: {}
    },
    20: {
        features: ["Inspiring Help (2d6)"],
        abilities: {}
    }
  };

  for (let level = 1; level <= newLevel; level++) {
    if (sidekickFeatures[level]) {
      let newFeatures = sidekickFeatures[level].features || [];
      let newAbilities = sidekickFeatures[level].abilities || {};
      let newSkills = sidekickFeatures[level].skills || {};
      let newSavingThrows = sidekickFeatures[level].savingThrows || [];
      
      newFeatures.forEach(async feature => {
        await actor.createEmbeddedDocuments("Item", [{
          name: feature,
          type: "feat",
          data: {
            description: {
              value: `Description of ${feature}`
            }
          }
        }]);
      });

      for (let [key, value] of Object.entries(newAbilities)) {
        await actor.update({[`data.abilities.${key}.value`]: value});
      }

      for (let [skill, value] of Object.entries(newSkills)) {
        await actor.update({[`data.skills.${skill}.value`]: value});
      }

      newSavingThrows.forEach(async save => {
        await actor.update({[`data.abilities.${save}.proficient`]: 1});
      });
    }
  }

  ui.notifications.notify(`${actor.name} has been leveled up to ${newLevel}!`);
}
