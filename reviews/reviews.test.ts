import "jest";
import * as request from 'supertest';
import { environment } from "../common/environment";

let address: string = (<any>global).address;

test('GET /reviews', () => {
    return request(address)
        .get('/reviews')
        .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.items).toBeInstanceOf(Array);
        })
        .catch(fail);
});