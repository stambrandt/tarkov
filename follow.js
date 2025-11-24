const setNameButton = document.getElementById("setNameButton");
var playerName = "";

setNameButton.onclick = function() {
    playerName = document.getElementById("nameInput").value;
    console.log(playerName);
}

function getHostPlayer() {
    const hostPlayer = new_json_packet.players.find(player => player.attributes.Type === "Host");
    return hostPlayer;
}

function getPlayerByName(name) {
    const player = new_json_packet.players.find(player => player.attributes.Name == name);
    return player;
}

function follow() {
    const followPlayer = document.getElementById("followPlayer").checked;
    const followType = document.getElementById("followTypeSelector").value;
    if(followPlayer && new_json_packet)
    {
        if(followType == "host")
        {

            hostPlayer = getHostPlayer();
            console.log("following host");
            map.setView([hostPlayer.position.y, hostPlayer.position.x]);
        }
        if(followType == "player")
        {
            console.log("following player: ", playerName);
            followedPlayer = getPlayerByName(playerName);
            console.log(followedPlayer);
            map.setView([followedPlayer.position.y, followedPlayer.position.x]);
        }
    }
}