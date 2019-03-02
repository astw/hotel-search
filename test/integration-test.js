import {
  expect
} from "chai"
import request from 'supertest';

import {
  HotelSearch
} from '../src/services';

const baseUrl = process.env.API_URL || 'http://localhost:3000/api/v1';

describe('Get Hotels test', async function () {
  it('Call  getAccessToken should return token', async function () {

    const hotelSearch = new HotelSearch();
    const token = await hotelSearch.getAccessToken();
    expect(token).not.null;
  })

  it('Call hotels endpoint should 400 status if there is no cityCode', async () => {
    request(baseUrl)
      .get('/hotels?cityCode=')
      .expect(400);
  })

  it('Call hotels endpoint should return hotels data  there is valid cityCode', async () => {
    request(baseUrl)
      .get('/hotels?cityCode=PAR')
      .expect(200)
      .end(function (err, res) {
        let hotel = res.body[0];
        hotel.should.have.property('name');
        hotel.should.have.property('phone');
        hotel.should.have.property('address');
      })
  })
})