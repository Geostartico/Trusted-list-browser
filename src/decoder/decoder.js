import { Country, Provider, Service } from "./items.js";
function objectify(ctodict, jsondict) {
    Country.initCodeToObjectMap(ctodict);
    console.log(Country.getCountry("IT"));
    let iterProv = (elem) => {
        let curCountry = Country.getCountry(elem["countryCode"]);
        console.log(elem["name"]);
        console.log(elem["tspId"]);
        console.log(elem["trustmark"]);
        console.log(elem["qServiceTypes"]);
        let curProv = new Provider(elem["name"], elem["tspId"], elem["trustmark"], elem["qServiceTypes"]);
        elem["services"].forEach((serdict) => {
            let ser = new Service(serdict["serviceName"], serdict["serviceId"], serdict["qServiceTypes"], curProv, serdict["currentStatus"], serdict["type"], serdict["tspId"], serdict["tob"]);
            ser.addCountry(curCountry);
            curProv.addService(ser);
        });
        curCountry.addProvider(curProv);
    };
    jsondict.forEach(iterProv);
}
let dict = [
    {
        "countryCode": "IT",
        "name": "tortellini",
        "qServiceTypes": [
            "tante", "cose"
        ],
        "trustmark": "fidati",
        "tspId": 0,
        "services": [
            {
                "countryCode": "IT",
                "currentStatus": "cista",
                "qServiceTypes": [
                    "tante"
                ],
                "serviceId": 0,
                "serviceName": "lro",
                "tob": "pob",
                "tspId": 173,
                "type": "qualcuno.com"
            },
            {
                "countryCode": "IT",
                "currentStatus": "noncista",
                "qServiceTypes": [
                    "cose"
                ],
                "serviceId": 1,
                "serviceName": "lor",
                "tob": "cob",
                "tspId": 174,
                "type": "questo.com"
            }
        ],
    },
    {
        "countryCode": "DE",
        "name": "crauti",
        "qServiceTypes": [
            "poche", "robe"
        ],
        "trustmark": "nonfidarti",
        "tspId": 1,
        "services": [
            {
                "countryCode": "DE",
                "currentStatus": "cista",
                "qServiceTypes": [
                    "poche"
                ],
                "serviceId": 0,
                "serviceName": "no",
                "tob": "jo",
                "tspId": 176,
                "type": "nesuno.de"
            }
        ],
    }
];
let map = [{ countryName: "Italia", countryCode: "IT" },
    { countryName: "Germania", countryCode: "DE" }];
objectify(map, dict);
console.log(Country.codeToObject);
