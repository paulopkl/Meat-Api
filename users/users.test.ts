import "jest";
import * as request from "supertest";
import { Server } from '../server/server';
import { environment } from '../common/environment';
import { usersRouter } from './users.router';
import { User } from './users.model';

const address: string = (<any>global).address;
const auth: string = (<any>global).auth;

// test('POST /users', () => {
//     return request(address)
//         .post('/users')
//         .set({ accept: 'application/json' })
//         .send({
//             name: "Usuario3",
//             email: "userTREE@hotmail.com",
//             password: "123456",
//             gender: "Male",
//             cpf: '489.662.998-14'
//         })
//         .then(res => {
//             console.log(res);
//             expect(res.status).toBe(200);
//             expect(res.body._id).toBeDefined();
//             expect(res.body.name).toBe('Usuario3');
//             expect(res.body.email).toBe('userTREE@hotmail.com');
//             expect(res.body.cpf).toBe('489.662.998-14');
//             expect(res.body.password).toBeUndefined()
//         })
//         .catch(fail);
// });

test('GET /users', () => {
    return request(address)
        .get('/users')
        .set({ accept: 'application/json', Authorization: auth })
        .then(response => {
            console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.items).toBeInstanceOf(Array);
        })
        .catch(fail);
});

// test('GET /users/aaaa - Not Found', () => {
//     return request(address)
//         .get('/users/aaaa')
//         .then(res => {
//             expect(res.status).toBe(404);
//         })
//         .catch(fail);
// });

// test('PATCH /users/:_id', () => {
//     return request(address)
//         .get('/users')
//         .send({
//             name: "Usuario3",
//             email: "userFORU@hotmail.com",
//             password: "123456",
//             gender: "Male",
//             cpf: '489.662.998-14'
//         })
//         .then(res => {
//             request(address)
//                 .patch(`/users/${res.body._id}`)
//                 .send({
//                     name: 'usuario2 - patch'
//                 })
//         })
//         .then((res: any) => {
//             expect(res.status).toBe(200);
//             expect(res.body._id).toBeDefined();
//             expect(res.body.name).toBe('usuario2 - patch');
//             expect(res.body.email).toBe('userFORU@hotmail.com');
//             expect(res.body.password).toBeUndefined()
//         })
//         .catch(fail);
// });