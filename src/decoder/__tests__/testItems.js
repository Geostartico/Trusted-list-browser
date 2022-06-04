import { strict as assert } from 'node:assert';
import {Country, Service, Type, Provider, Status} from "../items"

let serviceDict =
[
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
    }
  ]
},
{
    "tspId": 2,
    "name": "Bundesamt für Eich- und Vermessungswesen",
    "countryCode": "AT",
    "trustmark": "VATAT-U38473200",
    "qServiceTypes": [
        "Timestamp",
        "QCertESig"
    ],
    "services": [
        {
            "tspId": 2,
            "serviceId": 1,
            "countryCode": "AT",
            "serviceName": "Sicherer Zeitstempeldienst-01",
            "type": "http://uri.etsi.org/TrstSvc/Svctype/TSA",
            "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/deprecatedatnationallevel",
            "tob": null,
            "qServiceTypes": [
                "Timestamp",
                "QCertESig"
            ]
        },
        {
            "tspId": 2,
            "serviceId": 2,
            "countryCode": "AT",
            "serviceName": "Sicherer Zeitstempeldienst-02",
            "type": "http://uri.etsi.org/TrstSvc/Svctype/TSA",
            "currentStatus": "http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/deprecatedatnationallevel",
            "tob": null,
            "qServiceTypes": [
                "Timestamp"
            ]
        }
    ]
}
];
/**
 * "QCertESig" = 4
 */
let countryDict = [
  {
    "countryCode": "AT",
    "countryName": "Austria"
  },
  {
    "countryCode": "IT",
    "countryName": "Italy"
  }
]

describe('items', function () {
  let coun = undefined;
  let prov = undefined;
  let example = undefined;
  let services = undefined;
  beforeAll(() => {
    coun = new Country(countryDict[0]["countryCode"])
    let serviceTypes = new Array(serviceDict.length);
    for(let i = 0; i < serviceTypes.length; i ++){
      serviceTypes[i] = new Array();
    }
    for(let i = 0; i < serviceTypes.length; i ++){
      serviceDict[i]["qServiceTypes"].forEach((elem) =>{
        serviceTypes[i].push(new Type(elem))
      })
    }
    
    prov = new Array();
    for(let i = 0; i < serviceDict.length; i ++){
      prov[i] = new Provider(serviceDict[i]["name"], serviceDict[i]["tspId"], serviceDict[i]["trustmark"], serviceTypes[i]);
    }

    services = new Array(serviceDict.length);
    for(let i = 0; i < serviceDict.length; i ++){
      services[i] = new Array();
    }

    for(let i = 0; i < serviceDict.length; i ++){
      serviceDict[i]["services"].forEach((service_dict) => {
        let serviceTypeArr  = new Array();
        service_dict["qServiceTypes"].forEach((typestr) =>{
        serviceTypeArr.push(new Type(typestr));
        });
        services[i].push(new Service(service_dict["serviceName"], service_dict["serviceId"], serviceTypeArr, prov, new Status(service_dict["currentStatus"]), service_dict["type"], service_dict["tspId"], service_dict["tob"]));
      });
      services[i].forEach((elem) => prov[i].addService(elem));
      coun.addProvider(prov[i]);
    }
  })
  
  describe('Country constructor', function () {
    it('should construct the object', function () {
      assert.equal(coun.countryCode, "AT");
    });
  });
  describe("initialize a map from code to country", () => {
    it("should associate the string to the right country", () =>{
      let c = Country.initCodeToObjectMap(countryDict);
      assert.equal(c.get("AT").countryCode, "AT");
      assert.equal(c.get("IT").countryCode, "IT");
    })
    it("should associate the string to the right name", () =>{
      Country.initCodeToStringMap(countryDict);
      assert.equal(Country.codeToString.get("AT"), "Austria");
      assert.equal(Country.codeToString.get("IT"), "Italy");
    })
  })
  describe('Provider constructor', function () {
    it('should construct the object', function () {
      assert.equal(prov[0].name, "A-Trust Gesellschaft für Sicherheitssysteme im elektronischen Datenverkehr GmbH");
      assert.equal(prov[0].tspId, 1);
      assert.equal(prov[0].trustMark,"VATAT-U50272100");
      //console.log(prov.getServiceTypes());
      assert.equal(prov[0].getServiceTypes().size, 6);
    });
  }); 
  
  describe('Service constructor', function () {
    it('should construct the object', function () {
      let example = services[0][0];
      assert.equal(example.name, "TrustSign-Sig-01 (key no. 1)");
      assert.equal(example.tspId, 1);
      assert.equal(example.type,"http://uri.etsi.org/TrstSvc/Svctype/CA/QC");
      assert.equal(example.status.isEqual(new Status("http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/withdrawn")), true);
      assert.equal(example.provider, prov);
      assert.equal(example.getServiceTypes().has(new Type("QCertESig")), true);
    });
  });
  describe("testing immutability of items", () => {
    it("should throw exception if the objects are immutable", () => {
      let exampleser = services[0][0];
      let examplecoun = exampleser.getCountry();
      let exampleType = exampleser.getServiceTypes().values()[0];
      let exampleStatus = exampleser.status;
      let exampleProv = prov[0];
      exampleser.makeImmutable();
      examplecoun.makeImmutable();
      exampleType.makeImmutable();
      exampleStatus.makeImmutable();
      expect(() => {exampleser.addCountry(examplecoun)}).toThrow();
      expect(() => {examplecoun.addProvider(exampleProv)}).toThrow();
      expect(() => {exampleType.addService(exampleser)}).toThrow();
      expect(() => {exampleStatus.addService(exampleser)}).toThrow();
      expect(() => {exampleProv.addCountry(examplecoun)}).toThrow();
      expect(() => {exampleProv.addService(exampleser)}).toThrow();
    })
  });
  describe("serviceTypes and status inheritance", () =>{
    it("should have the correct amount of serviceTypes", () => {
      let curProv;
      coun.getProviders().forEach((elem) => {
        if(elem.name === "A-Trust Gesellschaft für Sicherheitssysteme im elektronischen Datenverkehr GmbH"){
          curProv = elem;
        }
      });
      curProv.getServiceTypes().forEach((val, elem) => {
        if(elem.name === "QCertESig"){
          assert.equal(val, 3);
        }
      })
    });
    it("should have constructed the country with the right amount of serviceTypes", () =>{
      coun.getPossibleServiceTypes().forEach((val, elem) => {
        if(elem.name === "QCertESig"){
          assert.equal(val, 4);
        }
      });
    })
  });
});


