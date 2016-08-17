import * as player from "./Player";

export const Player = player.Player;

if (typeof window !== 'undefined') {
    (<any>window).Qoollo = {
        StreamCentre: {
            Player: Player
        }
    };
}