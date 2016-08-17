import * as player from "./Player";

export module Qoollo.StreamCentre { 
    export const Player = player.Player;
}
(<any>window).Qoollo = {
    StreamCentre: {
        Player: Qoollo.StreamCentre.Player
    }
};