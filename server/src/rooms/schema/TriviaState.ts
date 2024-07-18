import { Schema, MapSchema, type } from '@colyseus/schema';

export class Player extends Schema {
    @type('string')
    id: string;

    @type('string')
    joined_at: string;

    @type('boolean')
    answered: boolean;

    @type('string')
    email: string;

    @type('string')
    name: string;

    @type('number')
    score: number;

    @type('boolean')
    isCorrect: boolean;
}

export class PlayerAnswer extends Schema {
    @type('string')
    id: string;

    @type('string')
    answer: string;
}

export class Question extends Schema {
    @type('number')
    id: number;

    @type('string')
    question: string;

    @type('string')
    option_1: string;

    @type('string')
    option_2: string;

    @type('string')
    option_3: string;

    @type('string')
    option_4: string;

    @type('string')
    email: string;

    @type('string')
    answer: string;

    @type('string')
    description: string;

    @type('string')
    image_url: string;
}

export class TriviaState extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    @type({ map: Player })
    wheel = new MapSchema<Player>();

    @type(Player)
    currentPlayer: Player;

    @type(Question)
    bowpourri: Question;

    @type('string')
    answer: string;

    @type({ map: PlayerAnswer })
    answers = new MapSchema<PlayerAnswer>();
}
