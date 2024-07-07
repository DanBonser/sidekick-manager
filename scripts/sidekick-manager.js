Hooks.on('init', () => {
    game.settings.register("sidekick-manager", "sidekickLevels", {
        name: "Sidekick Levels",
        scope: "world",
        config: false,
        type: Object,
        default: {}
    });

    Actors.registerSheet("dnd5e", SidekickActorSheet, {
        types: ["npc"],
        makeDefault: false
    });
});

class SidekickActorSheet extends ActorSheet5eNPC {
    getData() {
        const data = super.getData();
        const sidekickLevels = game.settings.get("sidekick-manager", "sidekickLevels") || {};
        data.sidekickLevels = sidekickLevels[this.actor.id] || 1;
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".sidekick-level").change(this._onSidekickLevelChange.bind(this));
    }

    async _onSidekickLevelChange(event) {
        const newLevel = parseInt(event.target.value);
        const actorId = this.actor.id;
        const sidekickLevels = game.settings.get("sidekick-manager", "sidekickLevels") || {};
        sidekickLevels[actorId] = newLevel;
        await game.settings.set("sidekick-manager", "sidekickLevels", sidekickLevels);

        // Update the actor stats based on the new level
        await this._updateActorStats(newLevel);
    }

    async _updateActorStats(level) {
        const updates = {};  // Object to store updates
        // Example for level 1
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
        }
        // Add more level-based updates here

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
