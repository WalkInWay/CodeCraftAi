import { DebugInterface } from "./DebugInterface";
import Action from "./model/Action";
import AttackAction from "./model/AttackAction";
import AutoAttack from "./model/AutoAttack";
import BuildAction from "./model/BuildAction";
import DebugCommand from "./model/DebugCommand";
import EntityAction from "./model/EntityAction";
import EntityType from "./model/EntityType";
import MoveAction from "./model/MoveAction";
import PlayerView from "./model/PlayerView";
import Vec2Int from "./model/Vec2Int";

function isUnit(type: EntityType): boolean {
    return [EntityType.BuilderUnit, EntityType.MeleeUnit, EntityType.RangedUnit].includes(type);
}

export class MyStrategy {
    async getAction(playerView: PlayerView, _debugInterface: DebugInterface) {
        // return new Action(new Map());

        const result = new Action(new Map());
        const myId = playerView.myId;

        playerView.entities
            .filter(entity => entity.playerId === myId)
            .forEach(entity => {
                const properties = playerView.entityProperties.get(entity.entityType);
                let moveAction: MoveAction | null = null;
                let buildAction: BuildAction | null = null;

                if (isUnit(entity.entityType)) {
                    moveAction = new MoveAction(
                        new Vec2Int(playerView.mapSize - 1, playerView.mapSize - 1),
                        true,
                        true,
                    );
                } else if (properties?.build) {
                    const entityType = properties.build.options[0];
                    const currentUnits = playerView.entities
                        .filter(entity => entity.playerId == myId && entity.entityType === entityType)
                        .length;
                    const predictedPopulation = (currentUnits + 1) * (playerView.entityProperties.get(entityType)?.populationUse ?? 0);

                    if (predictedPopulation <= properties.populationProvide) {
                        buildAction = new BuildAction(
                            entityType,
                            new Vec2Int(entity.position.x + properties.size, entity.position.y + properties.size - 1),
                        );
                    }
                }

                result.entityActions.set(
                    entity.id,
                    new EntityAction(
                        moveAction,
                        buildAction,
                        new AttackAction(
                            null,
                            new AutoAttack(
                                properties?.sightRange ?? 0,
                                entity.entityType == EntityType.BuilderUnit ? [EntityType.Resource] : [],
                            ),
                        ),
                        null,
                    ),
                );
            });

        return result;
    }
    async debugUpdate(_playerView: PlayerView, debugInterface: DebugInterface) {
        await debugInterface.send(new DebugCommand.Clear());
        await debugInterface.getState();
    }
}

module.exports.MyStrategy = MyStrategy;
