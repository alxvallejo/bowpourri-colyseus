import { Room, Client } from '@colyseus/core';
import { Player, TriviaState } from './schema/TriviaState';
import { Schema, MapSchema, type } from '@colyseus/schema';
import { getRandomTriviaQuestion } from '../services/trivia';

export class Trivia extends Room<TriviaState> {
    onCreate(options: any) {
        this.setState(new TriviaState());

        this.onMessage('spin', async (client, message) => {
            console.log('spin', client.sessionId);
            // Remove current player from wheel
            this.state.wheel.delete(this.state.currentPlayer.id);
            // Broadcast wheel
            this.broadcast('wheel', this.state.wheel);
            // Select random player from wheel
            const players = Array.from(this.state.wheel.values());
            if (players.length === 0) {
                // Kick off bowpourri
                const { randomQuestion, answer } =
                    await getRandomTriviaQuestion();
                console.log('randomQuestion: ', randomQuestion);
                // Set bowpourri
                this.state.bowpourri = randomQuestion;
                // Set answer
                this.state.answer = answer;
                // Broadcast bowpourri
                this.broadcast('bowpourri', randomQuestion);
                this.broadcast('currentPlayer', null);
            } else {
                const randomPlayer =
                    players[Math.floor(Math.random() * players.length)];
                // Set current player
                this.state.currentPlayer = randomPlayer;
                // Broadcast current player
                this.broadcast('currentPlayer', this.state.currentPlayer);
            }
        });

        this.onMessage('answer', async (client, message) => {
            console.log('answer', client.sessionId, message);
            // Set answer
            this.state.answers.set(client.sessionId, message);
            console.log('this.state.answers: ', this.state.answers);

            // Check if all players have answered
            if (this.state.answers.size === this.state.players.size) {
                const congratsTo = [];
                // Get correct answer
                const correctAnswer = this.state.answer;
                // Calculate scores
                this.state.answers.forEach((answer, playerId) => {
                    const player = this.state.players.get(playerId);
                    if (answer.answer === correctAnswer) {
                        player.score += 1;
                        player.isCorrect = true;
                        congratsTo.push(player.name);
                    }
                });

                let counter = 5;
                const WinnerCountdown = setInterval(() => {
                    console.log('counter', counter);
                    this.broadcast('counter', counter);
                    counter--;
                    if (counter === 0) {
                        console.log('braodcasting answer: ', correctAnswer);
                        this.broadcast('bowpourri', null);
                        this.broadcast('counter', null);
                        this.broadcast('playerScores', {
                            answer: correctAnswer,
                            players: this.state.players,
                            congratsTo,
                        });
                        clearInterval(WinnerCountdown);
                        this.state.answers.clear();
                    }
                }, 1000);

                // Broadcast scores
                this.broadcast('players', this.state.players);
                // Reset answers
                this.state.answers.clear();
            }
        });
    }

    onJoin(client: Client, options: any) {
        const { profile } = options;
        // Check if player already exists by email
        const existingPlayer = Array.from(this.state.players.values()).find(
            (player) => player.email === profile.email
        );
        if (existingPlayer) {
            // Update player's score
            this.state.players.delete(existingPlayer.id);
        }
        const player = new Player();
        player.id = client.sessionId;
        player.name = profile.name;
        player.email = profile.email;
        player.joined_at = new Date().toISOString();
        player.score = profile.score;
        this.state.players.set(client.sessionId, player);

        if (this.state.players.size === 1) {
            this.state.currentPlayer = player;
        }

        console.log(client.sessionId, 'joined!');

        // Copy players to wheel
        this.state.wheel = new MapSchema<Player>(this.state.players);

        this.broadcast('players', this.state.players);
        this.broadcast('wheel', this.state.wheel);
        this.broadcast('currentPlayer', this.state.currentPlayer);
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, 'left!');
    }

    onDispose() {
        console.log('room', this.roomId, 'disposing...');
        // Reset state
        this.setState(new TriviaState());
    }
}
