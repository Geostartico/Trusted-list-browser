import {Fetcher} from '../Fetcher';
import { strict as assert } from 'node:assert';

describe('fetcher', function() {

    let wrongUrl = "https://esignature.ec.europa.eu/efda/tl-browser/api/v1/search/countries_listt";
    let rightUrl = "https://esignature.ec.europa.eu/efda/tl-browser/api/v1/search/countries_list";
    let fetcher;

    beforeAll(() => {
        fetcher = new Fetcher();
    })

    describe('wrong url', function() {

        it('Should return Error', async function() {
            await expect(
                fetcher.getJSON().catch(err => {throw err})
            ).rejects.toThrow();
        })

    })

    describe('right url', function() {

        it('Should return a json' , function() {
            assert(fetcher.getJSON(rightUrl) !== null);
        })

    })
})
