const request = require('supertest')
const app = require('../../app')

describe("Test GET /launches", () => {
    test('Deberia responder con codigo 200 success', async() => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)//regular expression
            .expect(200)
    })
})

describe("Test POST /launch", () => {
    const completeLaunchData = {
        mission: 'Some mission',
        rocket: 'some rocket',
        target: 'some target',
        launchDate: 'January 4, 2028'
    }

    const launchDataWithoutDate = {
        mission: 'Some mission',
        rocket: 'some rocket',
        target: 'some target',
    }

    const launchDataWithInvalidDate = {
        mission: 'Some mission',
        rocket: 'some rocket',
        target: 'some target',
        launchDate: 'bad'
    }

    test('Deberia responder con codigo 201 created', async() => {
        const response = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201)
        
        const requestDate = new Date(completeLaunchData.launchDate).valueOf()
        const responseDate = new Date(response.body.launchDate).valueOf()
        expect(responseDate).toBe(requestDate)

        expect(response.body).toMatchObject(launchDataWithoutDate)
    })

    test('Deberia verificar propiedades faltantes', async() => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400)

        expect(response.body).toStrictEqual({
            error: 'Faltan propiedades requeridas del lanzamiento'
        })
    })

    test('Deberia verificar fechas invalidas', async() => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400)

        expect(response.body).toStrictEqual({
            error: 'Fecha invalida'
        })
    })
})