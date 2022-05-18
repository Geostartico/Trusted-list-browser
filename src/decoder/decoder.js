import { Country, Provider, Service, Type, Status } from "./items.js";
import { UnorderedSet } from "./UnorderedSet.js";
/**
 * transforms from json dictionary to objects, which the Countries are contained in the @see Country.codeToObject map
 * @param ctodict array with elements in the form {countryCode : "string", countryName : "string"}
 * @param jsondict array of providers in json format
 * @returns object in the form {"codeToObject": dictionary, "servicesArray": array}, with dictionary having the codes
 * as keys and as value the country objects, and array contrining services
 */
export function objectify(ctodict, jsondict) {
    let codeToObject = Country.initCodeToObjectMap(ctodict);
    let servicesArray = new Array();
    let stringToStatus = new Map();
    let statusSet = new UnorderedSet(10);
    let stringToType = new Map();
    let typeSet = new UnorderedSet(10);
    let typearr = new Array();
    jsondict.forEach((provider) => {
        let curCountry = codeToObject.get(provider["countryCode"]);
        let typearr = new Array();
        provider["qServiceTypes"].forEach((typestr) => {
            if (!stringToType.has(typestr)) {
                let t = new Type(typestr);
                stringToType.set(typestr, t);
                typeSet.add(t);
                typearr.push(t);
            }
            else {
                typearr.push(stringToType.get(typestr));
            }
        });
        let curProv = new Provider(provider["name"], provider["tspId"], provider["trustmark"], typearr);
        provider["services"].forEach((service_dict) => {
            let serviceTypeArr = new Array();
            service_dict["qServiceTypes"].forEach((typestr) => {
                if (!stringToType.has(typestr)) {
                    let t = new Type(typestr);
                    stringToType.set(typestr, t);
                    typeSet.add(t);
                    serviceTypeArr.push(t);
                }
                else {
                    serviceTypeArr.push(stringToType.get(typestr));
                }
            });
            let statusStr = service_dict["currentStatus"];
            let stat;
            console.log(statusStr);
            if (!stringToStatus.has(statusStr)) {
                stat = new Status(statusStr);
                stringToStatus.set(statusStr, stat);
                statusSet.add(stat);
            }
            else {
                stat = stringToStatus.get(statusStr);
            }
            let ser = new Service(service_dict["serviceName"], service_dict["serviceId"], serviceTypeArr, curProv, stat, service_dict["type"], service_dict["tspId"], service_dict["tob"]);
            stat.services.add(ser);
            serviceTypeArr.forEach((elem) => elem.services.add(ser));
            curProv.addService(ser);
            servicesArray.push(ser);
        });
        curCountry.addProvider(curProv);
    });
    return { "codeToObject": codeToObject, "servicesArray": servicesArray, "typeSet": typeSet, "statusSet": statusSet };
}
/*
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
  ]
let map = [{countryName: "Italia", countryCode: "IT"},
           {countryName: "Germania", countryCode: "DE" }]
let d = objectify(map, dict);
console.log(d["servicesArray"]);*/
/*let countryDict = [
    {
      "countryCode": "AT",
      "countryName": "Austria"
    },
    {
      "countryCode": "BE",
      "countryName": "Belgium"
    },
    {
      "countryCode": "BG",
      "countryName": "Bulgaria"
    },
    {
      "countryCode": "CY",
      "countryName": "Cyprus"
    },
    {
      "countryCode": "CZ",
      "countryName": "Czech Republic"
    },
    {
      "countryCode": "DE",
      "countryName": "Germany"
    },
    {
      "countryCode": "DK",
      "countryName": "Denmark"
    },
    {
      "countryCode": "EE",
      "countryName": "Estonia"
    },
    {
      "countryCode": "EL",
      "countryName": "Greece"
    },
    {
      "countryCode": "ES",
      "countryName": "Spain"
    },
    {
      "countryCode": "EU",
      "countryName": "European Union"
    },
    {
      "countryCode": "FI",
      "countryName": "Finland"
    },
    {
      "countryCode": "FR",
      "countryName": "France"
    },
    {
      "countryCode": "HR",
      "countryName": "Croatia"
    },
    {
      "countryCode": "HU",
      "countryName": "Hungary"
    },
    {
      "countryCode": "IE",
      "countryName": "Ireland"
    },
    {
      "countryCode": "IS",
      "countryName": "Iceland"
    },
    {
      "countryCode": "IT",
      "countryName": "Italy"
    },
    {
      "countryCode": "LI",
      "countryName": "Liechtenstein"
    },
    {
      "countryCode": "LT",
      "countryName": "Lithuania"
    },
    {
      "countryCode": "LU",
      "countryName": "Luxembourg"
    },
    {
      "countryCode": "LV",
      "countryName": "Latvia"
    },
    {
      "countryCode": "MT",
      "countryName": "Malta"
    },
    {
      "countryCode": "NL",
      "countryName": "Netherlands"
    },
    {
      "countryCode": "NO",
      "countryName": "Norway"
    },
    {
      "countryCode": "PL",
      "countryName": "Poland"
    },
    {
      "countryCode": "PT",
      "countryName": "Portugal"
    },
    {
      "countryCode": "RO",
      "countryName": "Romania"
    },
    {
      "countryCode": "SE",
      "countryName": "Sweden"
    },
    {
      "countryCode": "SI",
      "countryName": "Slovenia"
    },
    {
      "countryCode": "SK",
      "countryName": "Slovakia"
    },
    {
      "countryCode": "UK",
      "countryName": "United Kingdom"
    }
  ];
  
  let serviceDict = [
    {
      "tspId": 1,
      "name": "A-Trust Gesellschaft für Sicherheitssysteme im elektronischen Datenverkehr GmbH",
      "countryCode": "AT",
      "trustmark": "VATAT-U50272100",
      "qServiceTypes": [
        "QCertESeal",
        "CertESeal",
        "QCertESig",
        "WAC",
        "QWAC",
        "CertESig"
      ],
      "services": [
        {
          "tspId": 1,
          "serviceId": 1,
          "countryCode": "AT",
          "serviceName": "TrustSign-Sig-01 (key no. 1)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/withdrawn",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 2,
          "countryCode": "AT",
          "serviceName": "TrustSign-Sig-01 (key no. 2)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/withdrawn",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 3,
          "countryCode": "AT",
          "serviceName": "TrustSign-Sig-01 (key no. 3)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/withdrawn",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 4,
          "countryCode": "AT",
          "serviceName": "a-sign uni",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/withdrawn",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 5,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-01 (key no. 1)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 6,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-01 (key no. 2)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 7,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-01 (key no. 3)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 8,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-02 (key no. 1)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 9,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-02 (key no. 2)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 10,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-03 (key no. 1)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 11,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-03 (key no. 2)",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 12,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-05",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 13,
          "countryCode": "AT",
          "serviceName": "a-sign-premium-mobile-03",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 14,
          "countryCode": "AT",
          "serviceName": "a-sign-premium-mobile-05",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 15,
          "countryCode": "AT",
          "serviceName": "OCSP Responder 03-1",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/Certstatus/OCSP/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 16,
          "countryCode": "AT",
          "serviceName": "EU-Identity-mobile-05",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 17,
          "countryCode": "AT",
          "serviceName": "a-sign-premium-mobile-seal-07",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESeal"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 18,
          "countryCode": "AT",
          "serviceName": "a-sign-SSL-EV-07",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QWAC"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 19,
          "countryCode": "AT",
          "serviceName": "a-sign-SSL-03",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "WAC"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 20,
          "countryCode": "AT",
          "serviceName": "a-sign-SSL-05",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "WAC"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 21,
          "countryCode": "AT",
          "serviceName": "a-sign-SSL-07",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "WAC"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 22,
          "countryCode": "AT",
          "serviceName": "a-sign-SSL-EV-05",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "WAC"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 23,
          "countryCode": "AT",
          "serviceName": "a-sign-SSL-EV-07a",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QWAC"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 24,
          "countryCode": "AT",
          "serviceName": "a-sign-corporate-light-02",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "CertESeal",
            "CertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 25,
          "countryCode": "AT",
          "serviceName": "a-sign-corporate-light-03",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "CertESeal",
            "CertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 26,
          "countryCode": "AT",
          "serviceName": "a-sign-corporate-05",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "CertESeal",
            "CertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 27,
          "countryCode": "AT",
          "serviceName": "a-sign-corporate-07",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/PKC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/recognisedatnationallevel",
          "tob": null,
          "qServiceTypes": [
            "CertESeal",
            "CertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 28,
          "countryCode": "AT",
          "serviceName": "a-sign-premium-mobile-07",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        },
        {
          "tspId": 1,
          "serviceId": 29,
          "countryCode": "AT",
          "serviceName": "a-sign-Premium-Sig-07",
          "type": "http://uri.etsi.org/TrstSvc/Svctype/CA/QC",
          "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/granted",
          "tob": null,
          "qServiceTypes": [
            "QCertESig"
          ]
        }
      ]
    }
  ];
  
  let retDict = objectify(countryDict, serviceDict);
  
  console.log(retDict["codeToObject"]);
  console.log(retDict["servicesArray"]);
  console.log(retDict["statusSet"].values());
  console.log(retDict["typeSet"].values());*/ 
