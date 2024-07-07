Hooks.on('init', () => {
    // Register the new actor type by extending the Actor class
    CONFIG.Actor.documentClass = SidekickActor;

    // Add "Sidekick" to the actor type dropdown
    CONFIG.Actor.typeLabels = {
        ...CONFIG.Actor.typeLabels,
        "sidekick": "Sidekick"
    };
});

// Define the new SidekickActor class
class SidekickActor extends Actor {
    // You can override necessary methods here, for now, we'll keep it simple
}

// Register the new sheet for the "sidekick" type
Actors.registerSheet("dnd5e", SidekickActorSheet, {
    types: ["sidekick"],
    makeDefault: false
});

// Define a simple SidekickActorSheet class
class SidekickActorSheet extends ActorSheet5eCharacter {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.classes = [...options.classes, "sidekick-manager"];
        return options;
    }

    get template() {
        return `modules/sidekick-manager/templates/sidekick-sheet.html`;
    }
}
