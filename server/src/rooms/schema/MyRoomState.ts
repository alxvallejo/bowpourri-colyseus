import { Schema, MapSchema, type } from '@colyseus/schema';

export class Player extends Schema {
    @type('string') id: string;
    @type('string') created_at: string;
    @type('boolean') answered: boolean;
    @type('string') email: string;
    @type('string') name: string;
    @type('number') score: number;
    @type('boolean') isCorrect: boolean;
}

export class MyRoomState extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
    @type(Player) currentPlayer: Player;
}
