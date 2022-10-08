const request = require('supertest')
const app = require('../../app');
const { loadPlanetData } = require('../../models/planets.model');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo')

describe('Launches API', () => {
    beforeAll(async () => {
        //se conecta a mongo porque se conecta al servidor de mongo directamente
        // a diferencia de server.js que crea por medio de https
        await mongoConnect();
        //se carga los planetas pára que en CI no de error porque no existen registros
        //en bd
        await loadPlanetData();
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    describe("Test GET /launches", () => {
        test('Deberia responder con codigo 200 success', async() => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)//regular expression
                .expect(200)
        })
    })
    
    describe("Test POST /launch", () => {
        const completeLaunchData = {
            mission: 'Some mission',
            rocket: 'some rocket',
            target: 'Kepler-62 f',
            launchDate: 'January 4, 2028'
        }
    
        const launchDataWithoutDate = {
            mission: 'Some mission',
            rocket: 'some rocket',
            target: 'Kepler-62 f',
        }
    
        const launchDataWithInvalidDate = {
            mission: 'Some mission',
            rocket: 'some rocket',
            target: 'Kepler-62 f',
            launchDate: 'bad'
        }
    
        test('Deberia responder con codigo 201 created', async() => {
            const response = await request(app)
                .post('/v1/launches')
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
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Faltan propiedades requeridas del lanzamiento'
            })
        })
    
        test('Deberia verificar fechas invalidas', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Fecha invalida'
            })
        })
    })
})

