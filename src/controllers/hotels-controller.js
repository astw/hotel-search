import {
  HotelSearch
} from '../services';

export class HotelsController {

  constructor() {}

  async get(req, res) {
    const query = {};
    if (req.query.checkInDate || req.query.checkindate) {
      query.checkInDate = req.query.checkInDate || req.query.checkindate;
    }

    if (req.query.checkOutDate || req.query.checkoutdate) {
      query.checkOutDate = req.query.checkOutDate || req.query.checkoutdate;
    }

    if (req.query.cityCode || req.query.citycode) {
      query.cityCode = req.query.cityCode || req.query.citycode;
    }


    if (query.checkInDate) {
      if (new Date(query.checkInDate) == 'Invalid Date') {
        return res.sendStatus(400);
      }
    }

    if (query.checkOutDate) {
      if (new Date(query.checkOutDate) == 'Invalid Date') {
        return res.sendStatus(400);
      }
    }

    if (!query.cityCode) {
      return res.sendStatus(400);
    }

    query.adults = 1;
    query.roomQuantity = 1;
    query.radius = 5;
    query.bestRateOnly = true;
    query.pageLimit = 1;
    query.pageOffset = 0;
 
    const hotelSearch = new HotelSearch();
    try {
      const hotels = await hotelSearch.getCheapest3Hotels(query);
      return res.json(hotels);
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    } 
  }
}
