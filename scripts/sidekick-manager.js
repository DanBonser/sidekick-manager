Hooks.on('init', () => {
    // Define the new actor type
    CONFIG.Actor.documentClass = SidekickActor;

    // Add "Sidekick" to the actor type dropdown
    CONFIG.Actor.typeLabels = {
        ...CONFIG.Actor.typeLabels,
        "sidekick": "Sidekick"
    };

    // Register the new actor type
    Actors.registerSheet("dnd5e", SidekickActorSheet, {
        types: ["sidekick"],
        makeDefault: false
    });
});

class SidekickActor extends Actor {
    // Override any necessary methods here
}

class SidekickActorSheet extends ActorSheet5eCharacter {
    getData() {
        const data = super.getData();
        const sidekickLevels = game.settings.get("sidekick-manager", "sidekickLevels");
        data.sidekickLevels = sidekickLevels[data.actor._id] || 1;
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".sidekick-level").change(this._onSidekickLevelChange.bind(this));
    }

    async _onSidekickLevelChange(event) {
        const newLevel = parseInt(event.target.value);
        const actorId = this.actor._id;
        const sidekickLevels = game.settings.get("sidekick-manager", "sidekickLevels");
        sidekickLevels[actorId] = newLevel;
        await game.settings.set("sidekick-manager", "sidekickLevels", sidekickLevels);

        // Update the actor stats based on the new level
        await this._updateActorStats(newLevel);
    }

    async _updateActorStats(level) {
        const updates = {};  // Object to store updates
        
        // Define the changes based on the level and class
        // Note: This example only covers level 1 for the Expert sidekick
        if (level === 1) {
            updates['data.abilities.str.value'] = 10;
            updates['data.abilities.dex.value'] = 15;
            updates['data.abilities.con.value'] = 12;
            updates['data.abilities.int.value'] = 13;
            updates['data.abilities.wis.value'] = 10;
            updates['data.abilities.cha.value'] = 14;
            updates['data.skills.acr.value'] = 4;
            updates['data.skills.prf.value'] = 4;
            updates['data.skills.per.value'] = 4;
            updates['data.skills.slt.value'] = 4;
            updates['data.skills.ste.value'] = 4;
            updates['data.attributes.hp.value'] = 11;
            updates['data.attributes.hp.max'] = 11;
            updates['data.attributes.ac.value'] = 14;
            // Add more updates as needed
        }

        await this.actor.update(updates);
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.classes = [...options.classes, "sidekick-manager"];
        return options;
    }

    get template() {
        return `modules/sidekick-manager/templates/sidekick-sheet.html`;
    }
}
