import mapImage from "../assets/hco/ronograd-city.webp";

export const RONOGRAD_MAP_DATA = {
  mapImage,
  pageCategories: [],
  defaultSort: "",
  description: "Gravity_Defier's 16k orthographic map.",
  coordinateOrder: "xy",
  mapBounds: [
    [0, 0],
    [7187, 7382],
  ],
  origin: "bottom-left",
  useMarkerClustering: true,
  categories: [
    {
      id: "2",
      listId: 1,
      name: "Hostile Locations",
      color: "#ff005e",
      symbol: "H",
      symbolColor: "#fff",
      iconKey: "hostile-location",
    },
    {
      id: "3",
      listId: 2,
      name: "Hostile Outposts",
      color: "#9b0039",
      symbol: "P",
      symbolColor: "#fff",
      iconKey: "hostile-outpost",
    },
    {
      id: "4",
      listId: 3,
      name: "Objective",
      color: "#fa8800",
      symbol: "O",
      symbolColor: "#000",
      iconKey: "objective",
    },
    {
      id: "5",
      listId: 4,
      name: "Anti-Air / Mortar",
      color: "#9c00fa",
      symbol: "A",
      symbolColor: "#fff",
      icon: "File:Warning-icon.png",
      iconKey: "anti-air",
    },
    {
      id: "6",
      listId: 5,
      name: "Resources",
      color: "#079704",
      symbol: "R",
      symbolColor: "#fff",
      iconKey: "resources",
    },
    {
      id: "7",
      listId: 6,
      name: "Friendly Positions",
      color: "#00fa29",
      symbol: "F",
      symbolColor: "#000",
      iconKey: "friendly",
    },
    {
      id: "8",
      listId: 7,
      name: "Bunker",
      color: "#0001fa",
      symbol: "B",
      symbolColor: "#fff",
      iconKey: "bunker",
    },
  ],
  markers: [
    {
      id: "1",
      categoryId: "2",
      position: [3167.107487002409, 1781.8932497832432],
      popup: {
        title: "Sochraina City",
        description: "Hostile city",
        link: {
          url: "Sochraina City",
          label: "Sochrania City",
        },
        image: "File:RobloxScreenShot20240607 203351985.png",
      },
    },
    {
      id: "2",
      categoryId: "2",
      position: [3389.928557527516, 2743.9463347770766],
      popup: {
        title: "Quarry",
        description: "Hostile quarry",
        link: {
          url: "Quarry",
          label: "Quarry",
        },
        image: "File:RobloxScreenShot20240607 203632601.png",
      },
    },
    {
      id: "3",
      categoryId: "2",
      position: [6633.787932497691, 4708.957651342561],
      popup: {
        title: "Fort Ronograd",
        description: "",
        link: {
          url: "Fort Ronograd",
          label: "Fort Ronograd",
        },
        image: "File:Fort Ronograd.png",
      },
    },
    {
      id: "4",
      categoryId: "5",
      position: [6813.240888171495, 4977.73233250812],
      popup: {
        title: "Anti-Air",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "5",
      categoryId: "5",
      position: [6736.48568422967, 4718.47894441653],
      popup: {
        title: "Mortar",
        description: "Can be disabled manually",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "6",
      categoryId: "5",
      position: [6301.585474137823, 2798.934669642356],
      popup: {
        title: "Anti-Air",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "7",
      categoryId: "4",
      position: [6557.480737464673, 2767.9828234280244],
      popup: {
        title: "Objective",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "8",
      categoryId: "6",
      position: [5839.272224081837, 3227.2243232058336],
      popup: {
        title: "Resources",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "9",
      categoryId: "6",
      position: [5936.147170124111, 3183.3784129412707],
      popup: {
        title: "Resources",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "10",
      categoryId: "6",
      position: [3194.9797961774075, 2664.976965329033],
      popup: {
        title: "Resources",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "11",
      categoryId: "6",
      position: [4905.893510432961, 3369.3518066259967],
      popup: {
        title: "Resources",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "12",
      categoryId: "6",
      position: [5107.7805826795475, 3465.5135148412746],
      popup: {
        title: "Resources",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "13",
      categoryId: "6",
      position: [690.4778222165857, 1316.6194214152595],
      popup: {
        title: "Resources",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "14",
      categoryId: "6",
      position: [421.2424688917014, 533.6926879710829],
      popup: {
        title: "Resources",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "15",
      categoryId: "7",
      position: [1463.811933266242, 3367.822689020255],
      popup: {
        title: "Forward Operating Base",
        description: "",
        link: {
          url: "Forward Operating Base",
          label: "Forward Operating Base",
        },
        image: "File:Forward Operating Base.png",
      },
    },
    {
      id: "16",
      categoryId: "8",
      position: [3855.479535821355, 6449.98591080452],
      popup: {
        title: "Bunker",
        description: "",
        link: {
          url: "Bunker",
          label: "Bunker",
        },
        image: "File:Bunker.png",
      },
    },
    {
      id: "17",
      categoryId: "3",
      position: [4294.237253979021, 4026.2492776365834],
      popup: {
        title: "Hostile Outpost",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "18",
      categoryId: "2",
      position: [3583.9638782159855, 5715.976413092034],
      popup: {
        title: "Department of Utilities",
        description: "Unlocks a spawn when captured",
        link: {
          url: "Locations",
          label: "Department of Utilities",
        },
        image: "File:DoU.png",
      },
    },
    {
      id: "19",
      categoryId: "3",
      position: [1276.687794129517, 2236.1074198376123],
      popup: {
        title: "Hostile Outpost",
        description: "",
        link: {
          url: "",
          label: "",
        },
        image: "File:Hostile Outpost between Kozlovka and highway.png",
      },
    },
    {
      id: "20",
      categoryId: "3",
      position: [2891.0095049604033, 3460.17886142026],
      popup: {
        title: "Hostile Outpost",
        description: "",
        link: {
          url: "",
          label: "",
        },
        image: "File:Enemy Outpost Road Quarry.png",
      },
    },
    {
      id: "21",
      categoryId: "2",
      position: [3560.938212970528, 3913.070716352083],
      popup: {
        title: "Lesdolina",
        description: "",
        link: {
          url: "Locations",
          label: "Lesdolina",
        },
        image: "File:Villagemap.png",
      },
    },
    {
      id: "22",
      categoryId: "2",
      position: [5076.921462201208, 3676.8426471407415],
      popup: {
        title: "Ronograd City",
        description: "Friendly once captured",
        link: {
          url: "Ronograd City",
          label: "Ronograd City",
        },
        image: "File:Ronograd City Compound 2.png",
      },
    },
    {
      id: "23",
      categoryId: "7",
      position: [5058.735996472876, 3929.108533282545],
      popup: {
        title: "Friendly spawn once captured",
        description: "",
        link: {
          url: "",
          label: "",
        },
        image: "File:Ronograd-City Friendly.png",
      },
    },
    {
      id: "24",
      categoryId: "2",
      position: [6222.959111697487, 3382.9785505065306],
      popup: {
        title: "Naval Base",
        description: "",
        link: {
          url: "Naval Base",
          label: "Locations",
        },
        image: "File:Naval Base Resources.png",
      },
    },
    {
      id: "25",
      categoryId: "2",
      position: [2064.584398595373, 1108.462225794303],
      popup: {
        title: "Pushkino",
        description: "",
        link: {
          url: "Pushkino",
          label: "Locations",
        },
        image: "File:Pushkino top-down view.png",
      },
    },
    {
      id: "26",
      categoryId: "2",
      position: [848.5053711198868, 1518.14337201047],
      popup: {
        title: "Kozlovka",
        description: "",
        link: {
          url: "Kozlovka",
          label: "Locations",
        },
        image: "File:Kozlovka.png",
      },
    },
    {
      id: "27",
      categoryId: "2",
      position: [376.20929458959506, 559.9647704419799],
      popup: {
        title: "Depot",
        description: "",
        link: {
          url: "Depot",
          label: "Locations",
        },
        image: "File:Depot.png",
      },
    },
    {
      id: "28",
      categoryId: "3",
      position: [6237.367595015802, 3777.3417011148267],
      popup: {
        title: "Hostile Outpost",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "29",
      categoryId: "4",
      position: [3197.490739239027, 1499.7392742995153],
      popup: {
        title: "Objective",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "30",
      categoryId: "4",
      position: [3275.3669723584917, 2820.237952529041],
      popup: {
        title: "Objective",
        description: "Plant 4 Explosives",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "31",
      categoryId: "7",
      position: [3728.486144859609, 5949.491452249512],
      popup: {
        title: "Friendly position when captured",
        description: "",
        link: {
          url: "",
          label: "",
        },
        image: "File:DoU Friendly.png",
      },
    },
    {
      id: "32",
      categoryId: "2",
      position: [2499, 6204.346352941176],
      popup: {
        title: "Mountain Radar Station",
        description: "",
        link: {
          url: "",
          label: "",
        },
        image: "File:Mountain Outpost.png",
      },
    },
    {
      id: "33",
      categoryId: "2",
      position: [4826.75072546641, 4395.091071502068],
      popup: {
        title: "Bunker 4",
        description: "",
        link: {
          url: "Bunker 4",
          label: "Bunker 4",
        },
        image: "File:Bunker4 operation cryo.png",
      },
    },
    {
      id: "34",
      categoryId: "3",
      position: [2421.375, 4495.3749046720595],
      popup: {
        title: "Ronograd Creature",
        description: "",
        link: {
          url: "",
          label: "",
        },
        image: "File:Ronocreature.png",
      },
    },
    {
      id: "35",
      categoryId: "3",
      position: [2984.408010661672, 5003.9921875],
      popup: {
        title: "DOU Backup Post",
        description: "",
        link: {
          url: "",
          label: "",
        },
        image: "File:DoU Backup Post top-down view.png",
      },
    },
    {
      id: "36",
      categoryId: "4",
      position: [6305.814780533589, 4650.130995263047],
      popup: {
        title: "Destroy Objective",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "37",
      categoryId: "6",
      position: [3591.6067680005763, 5639.998046875],
      popup: {
        title: "Resources",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "38",
      categoryId: "4",
      position: [2445.9477436990737, 6136.978372850113],
      popup: {
        title: "Destroy Objective",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "39",
      categoryId: "4",
      position: [2407.437541388029, 6080.40983035519],
      popup: {
        title: "Destroy Objective",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "40",
      categoryId: "4",
      position: [6719.838387422109, 4833.998046875],
      popup: {
        title: "Eliminate VIP",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "41",
      categoryId: "6",
      position: [6787.578402910348, 4735.498046875],
      popup: {
        title: "Resources",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "42",
      categoryId: "6",
      position: [6859.368321971522, 4767.245970717666],
      popup: {
        title: "Resources",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "43",
      categoryId: "6",
      position: [6389.559150555596, 4498.588195800781],
      popup: {
        title: "Resources",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "44",
      categoryId: "5",
      position: [6574.507851235745, 4593.406748148383],
      popup: {
        title: "Mortar",
        description: "Can be disabled manually",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "45",
      categoryId: "5",
      position: [4002.450671757375, 7039.9921875],
      popup: {
        title: "Nuclear Warhead",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "46",
      categoryId: "4",
      position: [2696.2437750629438, 6394.148804470083],
      popup: {
        title: "Eliminate VIP",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "47",
      categoryId: "6",
      position: [3322.6947647955867, 2882.874346897554],
      popup: {
        title: "Resources",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "48",
      categoryId: "4",
      position: [4831.660635847679, 4398.204178980325],
      popup: {
        title: "Objective",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "49",
      categoryId: "4",
      position: [2047, 1147.5],
      popup: {
        title: "Objective",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "50",
      categoryId: "7",
      position: [3158, 1579],
      popup: {
        title: "Friendly spawn once captured",
        description: "",
        link: {
          url: "",
          label: "",
        },
        image: "File:Sochraina Freindly.png",
      },
    },
    {
      id: "51",
      categoryId: "4",
      position: [3254.5343392086256, 1699.363886692289],
      popup: {
        title: "Eliminate VIP",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "52",
      categoryId: "4",
      position: [4992.945321786431, 3417.182986178058],
      popup: {
        title: "Eliminate VIP",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "53",
      categoryId: "4",
      position: [5065.609427029833, 3413.9041802557704],
      popup: {
        title: "Eliminate VIP",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "54",
      categoryId: "4",
      position: [4997.512709941857, 3529.677304214939],
      popup: {
        title: "Eliminate VIP",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "55",
      categoryId: "4",
      position: [5071.366155013478, 3500.688974513496],
      popup: {
        title: "Eliminate VIP",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "56",
      categoryId: "4",
      position: [650.3478211169846, 1391.2273881644892],
      popup: {
        title: "Eliminate VIP",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "57",
      categoryId: "4",
      position: [3245.1248246817127, 2731.75],
      popup: {
        title: "Eliminate VIP",
        description: "Underground, needs breaching charge",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "58",
      categoryId: "4",
      position: [6672.966694057449, 4459.015362162369],
      popup: {
        title: "Destroy Objective",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "59",
      categoryId: "4",
      position: [6813.75, 4989],
      popup: {
        title: "Destroy Objective",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "60",
      categoryId: "4",
      position: [7112, 2992],
      popup: {
        title: "Destroy Objective",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "61",
      categoryId: "4",
      position: [6050.5, 2561.25],
      popup: {
        title: "Destroy Objective",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "62",
      categoryId: "4",
      position: [6315.170662777055, 2813.5778823412725],
      popup: {
        title: "Destroy Objective",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "63",
      categoryId: "4",
      position: [6193.375, 3339.625],
      popup: {
        title: "Eliminate VIP",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "64",
      categoryId: "4",
      position: [6218.875, 3274.75],
      popup: {
        title: "Eliminate VIP",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "65",
      categoryId: "4",
      position: [2551.2412665210627, 6214.407946457973],
      popup: {
        title: "Eliminate VIP",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "66",
      categoryId: "5",
      position: [377.9448035022408, 545.4453187411776],
      popup: {
        title: "Mortar",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "67",
      categoryId: "5",
      position: [3269.29477750191, 1919.2189898856004],
      popup: {
        title: "Mortar",
        description: "Can be disabled manually",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "68",
      categoryId: "5",
      position: [5002.1522463461415, 3422.079088902655],
      popup: {
        title: "Mortar",
        description: "Can be disabled manually",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "69",
      categoryId: "5",
      position: [4999.803786771754, 3507.517449224716],
      popup: {
        title: "Mortar",
        description: "Can be disabled manually",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "70",
      categoryId: "5",
      position: [5071.63092966995, 3506.930230982023],
      popup: {
        title: "Mortar",
        description: "Can be disabled manually",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "71",
      categoryId: "5",
      position: [5012.94995638547, 3323.617910517611],
      popup: {
        title: "Mortar",
        description: "Can be disabled manually",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "72",
      categoryId: "5",
      position: [3494.7049023133277, 3829.738242389079],
      popup: {
        title: "Mortar",
        description: "Can be disabled manually",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "73",
      categoryId: "4",
      position: [3514.86028928548, 3814.1723463666203],
      popup: {
        title: "Eliminate VIP",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "74",
      categoryId: "3",
      position: [5775.57538745614, 3833.1679628598486],
      popup: {
        title: "Hostile Outpost",
        description: "",
        link: {
          url: "Ronograd Bridge",
          label: "Ronograd Bridge",
        },
        image: "File:Bridge Outpost between Ronograd and Naval.png",
      },
    },
    {
      id: "75",
      categoryId: "5",
      position: [3309.570081546536, 2745.5],
      popup: {
        title: "Mortar",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "76",
      categoryId: "6",
      position: [3254.070081546536, 2566.5],
      popup: {
        title: "Resources",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "77",
      categoryId: "5",
      position: [6325.833513944132, 2840.094386635768],
      popup: {
        title: "Mortar",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "78",
      categoryId: "5",
      position: [6762.030196636199, 4485],
      popup: {
        title: "Mortar",
        description: "",
        link: {
          url: "",
          label: "",
        },
      },
    },
    {
      id: "79",
      categoryId: "4",
      position: [1090.041154029149, 1355.5],
      popup: {
        title: "Objective",
        description: "Plant Explosive",
        link: {
          url: "",
          label: "",
        },
      },
    },
  ],
  markerProgress: true,
};
