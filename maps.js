var mapInfo = {
    factory: {
        levels: {
            Satellite: 'https://assets.tarkov.dev/maps/factory_v2/main/{z}/{x}/{y}.png',
            Basement: 'https://assets.tarkov.dev/maps/factory_v2/tunnels_notint/{z}/{x}/{y}.png',
            Level2: 'https://assets.tarkov.dev/maps/factory_v2/2nd_notint/{z}/{x}/{y}.png',
            Level3: 'https://assets.tarkov.dev/maps/factory_v2/3rd_notint/{z}/{x}/{y}.png',
            Image: 'https://assets.tarkov.dev/maps/svg/Factory-Ground_Floor.svg'
        },
        bounds: [[79, -64.5], [-66.5, 67.4]],
        transform: [1.629, 119.9, 1.629, 139.3],
        rotation: 90
    },
    shoreline: {
        levels: {
            Satellite: 'https://assets.tarkov.dev/maps/shoreline/main/{z}/{x}/{y}.png',
            Basement: 'https://assets.tarkov.dev/maps/svg/Shoreline-Underground_Level.svg',
            Level2: 'https://assets.tarkov.dev/maps/svg/Shoreline-Second_Floor.svg',
            Level3: 'https://assets.tarkov.dev/maps/svg/Shoreline-Third_Floor.svg',
            Image: 'https://assets.tarkov.dev/maps/svg/Shoreline-Ground_Level.svg'
        },
        bounds: [[508, -415], [-1060, 618]],
        transform: [0.16, 83.2, 0.16, 111.1],
        rotation: 180
    },
    woods: {
        levels: {
            Satellite: 'https://assets.tarkov.dev/maps/woods/main/{z}/{x}/{y}.png',
            Image: 'https://assets.tarkov.dev/maps/svg/Woods.svg'
        },
        bounds: [[650, -945], [-695, 470]],
        transform: [0.1855,113.1,0.1855,167.8],
        rotation: 180
    },
    customs: {
        levels: {
            Satellite: 'https://assets.tarkov.dev/maps/customs_v4/main/{z}/{x}/{y}.png',
            Level2: 'https://assets.tarkov.dev/maps/customs_v4/2nd/{z}/{x}/{y}.png',
            Level3: 'https://assets.tarkov.dev/maps/customs_v4/3rd/{z}/{x}/{y}.png',
            Image: 'https://assets.tarkov.dev/maps/svg/Customs-Ground_Level.svg'
        },
        bounds: [[698,-307],[-372,237]],
        transform: [0.239,168.65,0.239,136.35],
        rotation: 180
    },
    interchange: {
        levels: {
            Satellite: 'https://assets.tarkov.dev/maps/interchange/main/{z}/{x}/{y}.png',
            Level2: 'https://assets.tarkov.dev/maps/svg/Interchange-First_Floor.svg',
            Level3: 'https://assets.tarkov.dev/maps/svg/Interchange-Second_Floor.svg',
            Image: 'https://assets.tarkov.dev/maps/svg/Interchange-Ground_Level.svg'
        },
        bounds: [[530,-439],[-364,452]],
        transform: [0.265,150.6,0.265,134.6],
        rotation: 180
    },
    labs: {
        levels: {
            Satellite: 'https://assets.tarkov.dev/maps/labs_v3/1st/{z}/{x}/{y}.png',
            Basement: 'https://assets.tarkov.dev/maps/labs_v3/technical/{z}/{x}/{y}.png',
            Level2: 'https://assets.tarkov.dev/maps/labs_v3/2nd/{z}/{x}/{y}.png',
        },
        bounds: [[-91,-477],[-287,-193]],
        transform: [0.575,281.2,0.575,196.7],
        rotation: 270
    },
    lighthouse: {
        levels: {
            Image: 'https://assets.tarkov.dev/maps/svg/Lighthouse.svg'
        },
        bounds: [[515,-998],[-545,725]],
        transform: [0.2,0,0.2,0],
        rotation: 180
    },
    reserve: {
        levels: {
            Image: 'https://assets.tarkov.dev/maps/svg/Reserve-Ground_Level.svg',
            Basement: 'https://assets.tarkov.dev/maps/svg/Reserve-Bunkers.svg'
        },
        bounds: [[289,-338],[-303,336]],
        transform: [0.268,0,0.268,0],
        rotation: 180
    },
    streets: {
        levels: {
            Image: 'https://assets.tarkov.dev/maps/svg/StreetsOfTarkov-Ground_Level.svg'
        },
        bounds: [[323,-317],[-280,549]],
        transform: [0.38,0,0.38,0],
        rotation: 180
    },
    groundZero: {
        levels: {
            Satellite: 'https://assets.tarkov.dev/maps/groundzero/main/{z}/{x}/{y}.png',
            Basement: 'https://assets.tarkov.dev/maps/groundzero/garage/{z}/{x}/{y}.png',
            level2: 'https://assets.tarkov.dev/maps/groundzero/2nd/{z}/{x}/{y}.png',
            level3: 'https://assets.tarkov.dev/maps/groundzero/3rd/{z}/{x}/{y}.png',
            Image: 'https://assets.tarkov.dev/maps/svg/GroundZero-Ground_Level.svg'
        },
        bounds: [[249,-124],[-99,364]],
        transform: [0.524,167.3,0.524,65.1],
        rotation: 180
    }
};