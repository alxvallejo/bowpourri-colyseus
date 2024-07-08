import { Room, Client } from '@colyseus/core';
import { Player, TriviaState } from './schema/TriviaState';
import { Schema, MapSchema, type } from '@colyseus/schema';

export class Trivia extends Room<TriviaState> {
    onCreate(options: any) {
        this.setState(new TriviaState());

        this.onMessage('type', (client, message) => {
            //
            // handle "type" message
            //
        });
    }

    onJoin(client: Client, options: any) {
        const { profile } = options;
        const player = new Player();
        player.id = client.sessionId;
        player.name = profile.name;
        player.email = profile.email;
        player.created_at = new Date().toISOString();
        player.score = profile.score;
        this.state.players.set(client.sessionId, player);

        if (this.state.players.size === 1) {
            this.state.currentPlayer = player;
        }

        console.log(client.sessionId, 'joined!');

        this.broadcast('players', this.state.players);
        this.broadcast('currentPlayer', this.state.currentPlayer);
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, 'left!');
    }

    onDispose() {
        console.log('room', this.roomId, 'disposing...');
    }
}
