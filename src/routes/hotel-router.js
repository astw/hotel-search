import express from 'express'; 
import { HotelsController }  from '../controllers';

class HotelRoute {
   constructor(){ 
       this.controller = new HotelsController();
       this.hotelRouter = express.Router(); 
       
       this.hotelRouter.route('/hotels')
          .get(this.controller.get); 
   }

   router(){
       return this.hotelRouter;
   }
}

export const HotelRouter = new HotelRoute().router(); 