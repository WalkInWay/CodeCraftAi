const model = require('./model/index');

function is_unit(entity_type: &EntityType) -> bool {
    use EntityType::*;
    matches!(entity_type, BuilderUnit | MeleeUnit | RangedUnit)
}

class MyStrategy {
    async getAction(playerView, debugInterface) {
        return new model.Action(new Map());
    }
    async debugUpdate(playerView, debugInterface) {
        await debugInterface.send(new model.DebugCommand.Clear());
        await debugInterface.getState();
    }
}

module.exports.MyStrategy = MyStrategy;
