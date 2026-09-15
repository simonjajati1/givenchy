// Seed data — this is your ledger exactly as it stood when the app was built.
// people[0]=Simon, people[1]=Joe, people[2]=Isaac

const SEED = {
  people: ["Simon", "Joe", "Isaac"],
  txns: [
    { id: 2001, type: "shared", date: "2026-09-03", desc: "wallpaper labor deposit", amount: 1800, payer: "sharedAcct", splitAmong: [0,1,2] },
    { id: 2002, type: "shared", date: "2026-09-03", desc: "wallpaper", amount: 3906, payer: "sharedAcct", splitAmong: [0,1,2] },
    { id: 2003, type: "shared", date: "2026-09-03", desc: "AHMAD BALANCE CASH", amount: 3200, payer: 0, splitAmong: [0,1,2] },
    { id: 2004, type: "shared", date: "2026-09-03", desc: "GK FURNITURE", amount: 150, payer: 0, splitAmong: [0,1,2] },
    { id: 2005, type: "shared", date: "2026-09-03", desc: "paint", amount: 175, payer: 0, splitAmong: [0,1,2] },
    { id: 2006, type: "shared", date: "2026-09-03", desc: "STAIRS RAILING", amount: 1500, payer: 0, splitAmong: [0,1,2] },
    { id: 2007, type: "shared", date: "2026-09-03", desc: "STAIRS CARPET DEPOSIT", amount: 850, payer: "sharedAcct", splitAmong: [0,1,2] },
    { id: 2008, type: "shared", date: "2026-09-03", desc: "WAYFAIR LIGHTS", amount: 213, payer: "sharedAcct", splitAmong: [0,1,2] },
    { id: 2009, type: "shared", date: "2026-09-03", desc: "CASH", amount: 1000, payer: 1, splitAmong: [0] },
    { id: 2010, type: "shared", date: "2026-09-01", desc: "front door lock", amount: 285, payer: 0, splitAmong: [0,1,2] },
    { id: 2011, type: "shared", date: "2026-09-01", desc: "kitchen handles", amount: 850, payer: "sharedAcct", splitAmong: [0,1,2] },
    { id: 2012, type: "shared", date: "2026-09-01", desc: "shower door", amount: 1760, payer: "sharedAcct", splitAmong: [0,1,2] },
    { id: 2013, type: "shared", date: "2026-08-31", desc: "WINDOW BALANCE", amount: 724, payer: "sharedAcct", splitAmong: [0,1,2] },
    { id: 2014, type: "shared", date: "2026-08-31", desc: "appliances", amount: 9000, payer: "sharedAcct", splitAmong: [0,1,2] },
    { id: 2015, type: "shared", date: "2026-08-25", desc: "balance for kitchens", amount: 9340, payer: "sharedAcct", splitAmong: [0,1,2] },
    { id: 2016, type: "shared", date: "2026-08-24", desc: "dad syria", amount: 3000, payer: 0, splitAmong: [0,1,2] },
    { id: 2017, type: "shared", date: "2026-08-24", desc: "fixes up the 55k sent to dad from bofa so isaac isnt liable", amount: 18470, payer: 0, splitAmong: [1,2] },
    { id: 2018, type: "shared", date: "2026-08-17", desc: "APPLIANCE DEPOSIT", amount: 800, payer: "sharedAcct", splitAmong: [0,1,2] },
    { id: 2019, type: "shared", date: "2026-08-13", desc: "FRONT DOOR", amount: 2300, payer: 0, splitAmong: [0,1,2] },
    { id: 2020, type: "shared", date: "2026-08-11", desc: "VW CHARGE OFF DEBT", amount: 1897, payer: "sharedAcct", splitAmong: [1] },
    { id: 2021, type: "shared", date: "2026-08-11", desc: "construction and material", amount: 27730, payer: 0, splitAmong: [0,1,2] },
    { id: 2022, type: "shared", date: "2026-08-11", desc: "construction and material", amount: 5669, payer: "sharedAcct", splitAmong: [0,1,2] },
    { id: 2023, type: "shared", date: "2026-08-11", desc: "dad flight plus cash spending", amount: 4842, payer: 0, splitAmong: [0,1,2] },
    { id: 2024, type: "shared", date: "2026-08-11", desc: "dad payments plus tickets", amount: 6930, payer: "sharedAcct", splitAmong: [0,1,2] },
    { id: 2025, type: "shared", date: "2026-08-11", desc: "august rent", amount: 1000, payer: 1, splitAmong: [2] },
    { id: 2026, type: "shared", date: "2026-08-11", desc: "july rent", amount: 1000, payer: 1, splitAmong: [2] },
    { id: 2027, type: "shared", date: "2026-08-11", desc: "august rent", amount: 3500, payer: 1, splitAmong: [0] },
    { id: 2028, type: "shared", date: "2026-08-11", desc: "july rent + expense", amount: 3500, payer: 1, splitAmong: [0] },
    { id: 2029, type: "shared", date: "2026-06-05", desc: "i owe isaac", amount: 4260, payer: 2, splitAmong: [0] },
    { id: 2030, type: "shared", date: "2026-06-05", desc: "deal house plus payments to mom and dad plus tickets", amount: 7237, payer: 0, splitAmong: [1] },
    { id: 2031, type: "shared", date: "2026-06-05", desc: "deal house plus payments to mom and dad plus tickets", amount: 7237, payer: 2, splitAmong: [1] },
    { id: 2032, type: "shared", date: "2026-06-05", desc: "starting balance isaac owes joe", amount: 25000, payer: 1, splitAmong: [2] },
    { id: 2033, type: "shared", date: "2026-06-05", desc: "15k cash gave to joe", amount: 15000, payer: 0, splitAmong: [1] },
    { id: 2034, type: "shared", date: "2026-06-05", desc: "mom mother day gift", amount: 500, payer: 0, splitAmong: [1] },
    { id: 2035, type: "shared", date: "2026-06-05", desc: "rent plus expense for may and june", amount: 7000, payer: 1, splitAmong: [0] },
    { id: 2036, type: "shared", date: "2026-06-05", desc: "starting balance simon owes joe", amount: 4614, payer: 1, splitAmong: [0] },

    // deleted entries (kept for the audit trail, excluded from balance math)
    { id: 2101, type: "shared", date: "2026-09-03", desc: "wallpaper labor deposit", amount: 1800, payer: 0, splitAmong: [0,1,2], deleted: true, deletedBy: 0 },
    { id: 2102, type: "shared", date: "2026-09-03", desc: "wallpaper labor deposit", amount: 1800, payer: "sharedAcct", splitAmong: [0,1,2], deleted: true, deletedBy: 0 },
    { id: 2103, type: "shared", date: "2026-09-03", desc: "CASH", amount: 1000, payer: 0, splitAmong: [0], deleted: true, deletedBy: 0 },
    { id: 2104, type: "shared", date: "2026-08-11", desc: "dad payments", amount: 150000, payer: 2, splitAmong: [0,1,2], deleted: true, deletedBy: 0 },
    { id: 2105, type: "shared", date: "2026-08-11", desc: "dad payments last 2 years", amount: 100000, payer: 2, splitAmong: [0,1,2], deleted: true, deletedBy: 0 }
  ]
};

module.exports = { SEED };
