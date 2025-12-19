import { describe, expect, test, beforeAll, mock } from 'bun:test'
import express from 'express'
import request from 'supertest'
import emissionsRouter from './index'
import MeasureAPI from '../../services/measure/api'

mock.module('../../services/measure/api', () => ({
  default: {
    measure: mock(),
  },
}))

describe('Emissions Router', () => {
  let app: express.Express

  beforeAll(() => {
    // Setup Express Server
    app = express()
    app.use(express.json())
    app.use('/emissions', emissionsRouter)
  })

  // Testing Domain Validation through the /day endpoint as a proxy for shared validation
  describe('Domain Validation Logic (via /day)', () => {
    test('should return 400 for invalid domains', async () => {
      const invalidDomains = [
        'https://google.com',
        'www.google.com',
        'google .com',
        'google!.com',
        'google',
        '',
      ]

      for (const domain of invalidDomains) {
        const response = await request(app)
          .get('/emissions/day')
          .query({ domain, date: '2023-01-01' })

        expect(response.status).toBe(400)
      }
    })
  })

  describe('GET /day', () => {
    test('should return 200 and data for valid request', async () => {
      ;(MeasureAPI.measure as any).mockResolvedValue({ totalEmissions: 123.45 })

      const response = await request(app)
        .get('/emissions/day')
        .query({ domain: 'scope3.com', date: '2023-01-01' })

      expect(response.body).toEqual({
        totalEmissions: 123.45,
        domain: 'scope3.com',
        date: '2023-01-01',
      })
    })

    test('should return 422 for future date', async () => {
      const futureDate = '2050-01-01'
      const response = await request(app)
        .get('/emissions/day')
        .query({ domain: 'scope3.com', date: futureDate })

      expect(response.status).toBe(422)
    })

    test('should return 400 for malformed date', async () => {
      const response = await request(app)
        .get('/emissions/day')
        .query({ domain: 'scope3.com', date: 'not-a-date' })

      expect(response.status).toBe(400)
    })
  })

  describe('GET /week', () => {
    test('should return 200 and aggregated data for valid request', async () => {
      ;(MeasureAPI.measure as any).mockResolvedValue({ totalEmissions: 100 })

      const response = await request(app)
        .get('/emissions/week')
        .query({ domain: 'scope3.com', date: '2023-01-01' })

      expect(response.status).toBe(200)
    })
  })
})
