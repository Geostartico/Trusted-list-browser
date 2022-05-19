//var assert = require('assert');
import { strict as assert } from 'node:assert';
//var Service = require('./items').Service;
import {Country, Service, Type, Provider, Status} from "../items.js"

let serviceDict =
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
};

let countryDict = [
  {
    "countryCode": "AT",
    "countryName": "Austria"
  }
]

describe('items', function () {
  let coun = new Country(serviceDict["countryCode"])
  describe('Country constructor', function () {
    it('should construct the object', function () {
      assert.equal(coun.countryCode, "AT");
    });
  });
  let serviceTypes = new Array();
  serviceDict["qServiceTypes"].forEach((elem) => {
    serviceTypes.push(new Type(elem));
  })
  let prov = new Provider(serviceDict["name"], serviceDict["tspId"], serviceDict["trustmark"], serviceTypes);
  describe('Provider constructor', function () {
    it('should construct the object', function () {
      assert.equal(prov.name, "A-Trust Gesellschaft für Sicherheitssysteme im elektronischen Datenverkehr GmbH");
      assert.equal(prov.tspId, 1);
      assert.equal(prov.trustMark,"VATAT-U50272100");
      //console.log(prov.getServiceTypes());
      assert.equal(prov.getServiceTypes().size, 6);
    });
  });
  let services = new Array()
  serviceDict["services"].forEach((service_dict) => {
    let serviceTypeArr  = new Array();
    service_dict["qServiceTypes"].forEach((typestr) =>{
    serviceTypeArr.push(new Type(typestr));
    });
    let ser = new Service(service_dict["serviceName"], service_dict["serviceId"], serviceTypeArr, prov, new Status(service_dict["currentStatus"]), service_dict["type"], service_dict["tspId"], service_dict["tob"]);
    prov.addService(ser);
    services.push(ser);
  })
  let example = services[0];
  describe('Service constructor', function () {
    it('should construct the object', function () {
      assert.equal(example.name, "TrustSign-Sig-01 (key no. 1)");
      assert.equal(example.tspId, 1);
      assert.equal(example.type,"http://uri.etsi.org/TrstSvc/Svctype/CA/QC");
      assert.equal(example.status.isEqual(new Status("http://uri.etsi.org/TrstSvc/TrustedList/Svcstatus/withdrawn")), true);
      assert.equal(example.provider, prov);
      assert.equal(example.getServiceTypes().has(new Type("QCertESig")), true);
    });
  });
});
