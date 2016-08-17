import * as player from "./Player";

export const Player = player.Player;

(<any>window).Qoollo = {
    StreamCentre: {
        Player: Player
    }
};