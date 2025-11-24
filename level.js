function autoUpdateMap() {
    const detectMap = document.getElementById('detectMap').checked;
    if(detectMap)
    {
        const mapSelector = document.getElementById('mapSelector');
        var id = new_json_packet.map;
        var newMap;
        switch (id)
        {
            case 0:
                newMap = "factory";
                break;
            case 1:
                newMap = "reserve";
                break;
            case 2:
                newMap = "shoreline";
                break;
            case 3:
                newMap = "interchange";
                break;
            case 4:
                newMap = "customs";
                break;
            case 5:
                newMap = "woods";
                break;
            case 6:
                newMap = "groundZero";
                break;
            case 7:
                newMap = "lighthouse";
                break;
            case 8:
                newMap = "streets";
                break;
        }
        if(mapSelector.value != newMap)
        {
            mapSelector.value = newMap;
            changeMap();
        }
    }
}

function autoUpdateLayer() {
    const detectLevel = document.getElementById('detectLevel').checked;
    if(detectLevel)
    {
        const followPlayer = document.getElementById("followPlayer").checked;
        const followType = document.getElementById("followTypeSelector").value;
        const levelSelector = document.getElementById('levelSelector');
        var player;
        if(followPlayer && followType == "player")
        {
            player = getPlayerByName(playerName);
        }
        else
        {
            player = getHostPlayer();
        }
            
        var currentLevel;
        switch(levelSelector.value)
        {
            case "Basement":
                currentLevel = 0;
                break;
            case "Main":
                currentLevel = 1;
                break;
            case "Level2":
                currentLevel = 2;
                break;
            case "Level3":
                currentLevel = 3;
                break;
            case "Level4":
                currentLevel = 4;
                break;
        }

        if(new_json_packet && player)
        {
            if (player.attributes.Floor != currentLevel)
            {
                var levelName;
                switch(player.attributes.Floor) {
                    case 0:
                        levelName = "Basement";
                        break;
                    case 1:
                        levelName = "Main";
                        break;
                    case 2:
                        levelName = "Level2";
                        break;
                    case 3:
                        levelName = "Level3";
                        break;
                    case 4:
                        levelName = "Level4";
                        break;
                }
                levelSelector.value = levelName;
                changeLayer();
            }
        }
    }
}