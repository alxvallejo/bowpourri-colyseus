import { Room, Client } from '@colyseus/core';
import { Player, PlayerAnswer, TriviaState } from './schema/TriviaState';
import { Schema, MapSchema, type } from '@colyseus/schema';
import { getRandomTriviaQuestion, getTriviaStats } from '../services/trivia';

export class Trivia extends Room<TriviaState> {
    onCreate(options: any) {
        this.setState(new TriviaState());

        this.onMessage('spin', async (client, message) => {
            const { email } = client.userData;
            console.log('spin', email);
            // Remove current player from wheel
            this.state.wheel.delete(email);
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
            const { email } = client.userData;
            // Get player
            const player = this.state.players.get(email);

            if (!player) {
                console.log('Player not found', email);
                return;
            }

            // Prepare Answer
            const playerAnswer = new PlayerAnswer({
                email: email,
                answer: message,
            });
            // Set answer
            this.state.answers.set(email, playerAnswer);

            // Check if all players have answered
            if (this.state.answers.size === this.state.players.size) {
                const congratsTo = [];
                // Get correct answer
                const correctAnswer = this.state.answer;
                // Calculate scores
                this.state.answers.forEach((answer, playerEmail) => {
                    const player = this.state.players.get(playerEmail);
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
                        // this.broadcast('bowpourri', null);
                        this.broadcast('counter', null);
                        this.broadcast('playerScores', {
                            answer: correctAnswer,
                            answerDescription: this.state.bowpourri.description,
                            answerImageUrl: this.state.bowpourri.image_url,
                            players: this.state.players,
                            congratsTo,
                        });
                        clearInterval(WinnerCountdown);
                        this.state.answers.clear();
                    }
                }, 1000);

                // Broadcast scores
                console.log('broadcasting players');
                this.broadcast('players', this.state.players);
                // Reset answers
                this.state.answers.clear();
            }
        });

        this.onMessage('refreshTriviaStats', async (client, message) => {
            console.log('refreshTriviaStats', client.sessionId);
            const { total_count, popular_topics } = await getTriviaStats();
            this.broadcast('triviaStats', { total_count, popular_topics });
        });
    }

    onJoin(client: Client, options: any) {
        const { profile } = options;
        // Set userData on client
        client.userData = profile;
        // Check if player already exists by email
        const existingPlayer = this.state.players.get(profile.email);
        if (!existingPlayer) {
            const player = new Player();
            player.id = client.sessionId;
            player.name = profile.name;
            player.email = profile.email;
            player.joined_at = new Date().toISOString();
            player.score = profile.score;
            this.state.players.set(profile.email, player);
            this.state.wheel.set(profile.email, player);
            if (this.state.players.size === 1) {
                this.state.currentPlayer = player;
            }
            this.broadcast('success', `${profile.name} joined!`);
            this.broadcast('players', this.state.players);
            this.broadcast('wheel', this.state.wheel);
        } else {
            console.log('existing player!');
            if (this.state.players.size === 1) {
                this.state.currentPlayer = existingPlayer;
            }
        }

        console.log(client.sessionId, 'joined!');

        this.broadcast('currentPlayer', this.state.currentPlayer);
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, 'left!');
        console.log('client.userData.email: ', client.userData.email);
        if (client.userData.email) {
            // Remove player from players
            this.state.players.delete(client.userData.email);
            // Remove player from wheel
            this.state.wheel.delete(client.userData.email);
            // Broadcast wheel
            this.broadcast('wheel', this.state.wheel);
            // Broadcast players
            this.broadcast('players', this.state.players);
        }
    }

    onDispose() {
        console.log('room', this.roomId, 'disposing...');
        // Reset state
        this.setState(new TriviaState());
    }
}
