import axios from 'axios';
import qs from 'qs';
import { inspect } from 'util';
import settings from '../settings';

export class HotelSearch {

  async getAccessToken() {

    const now = new Date();
    if (this.token && now < this.expireTime) {
      return this.token;
    }

    const requestBody = qs.stringify({
      grant_type: 'client_credentials',
      client_id: settings.apiKey,
      client_secret: settings.apiSecret
    });

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const authUri = `${settings.baseUri}/security/oauth2/token`;
    const response = await axios.post(authUri, requestBody, config);
    const {
      data
    } = response;
    this.token = data.access_token;
    this.tokenType = data.token_type;

    let expireTime = new Date();
    const diff = 1;
    expireTime.setSeconds(expireTime.getSeconds() + Number(data.expires_in));
    this.expireTime = expireTime

    return this.token;
  } catch (err) {
    throw Error(err);
  }

  async getCheapest3Hotels(options) { 
    try {
      const token = await this.getAccessToken();

      const params = qs.stringify({
        cityCode: options.cityCode,
        checkInDate: options.checkInDate,
        checkOutDate: options.checkOutDate,
        sort: 'PRICE'
      }); 

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        }
      }

      const queryUri = `${settings.baseUri}/shopping/hotel-offers?${params}`;
      const response = await axios.get(queryUri, config).then(r => r.data);
      const {
        data
      } = response;

      const hotels = data.map(i => {

        const offers = i.offers.sort((i, j) => Number(i.price.total) > Number(j.price.total));
        const cheapestPrice = offers.length > 0 ? offers[0].price.total : '';
        const currency = offers.length > 0 ? offers[0].price.currency : '';

        const address = `${i.hotel.address.lines.join(',')}, ${i.hotel.address.cityName}, ${i.hotel.address.countryCode}`;
        return {
          name: i.hotel.name,
          address,
          phone: i.hotel.contact.phone,
          price: cheapestPrice,
          currency
        }
      });

      return hotels;
    } catch (err) { 
      throw Error(err);
    }
  }
}