//var assert = require('assert');
import { strict as assert } from 'node:assert';
//var Service = require('./items').Service;
import {Country, Service, Type, Provider} from "../items.js"

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
      assert.equal(prov.getServiceTypes().size, 6);
    });
  });
});
