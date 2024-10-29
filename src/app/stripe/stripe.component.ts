import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

//services
import { EndpointsService } from "../services/endpoints.service";



@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrl: './stripe.component.css',

  providers: [EndpointsService]

})
export class StripeComponent implements OnInit{
  private stripe: Stripe; 
  constructor(
    private _endpointsService: EndpointsService
  ) { }



 async ngOnInit() {
  this.stripe= await loadStripe('pk_test_51QEvYxHvRGf2ixKsvxbp4SIQym1nWVYe5JzuWuck0Sp0LtkYd7Ntt6qcnCwaCr6GIlq2dM1VAg0G512QEh1u8azJ00Y8eML9zz');
  console.log(this.stripe);

  const elements = this.stripe.elements();
  const card = elements.create('card');
  card.mount('#card');


  card.on('change', (event) => {
   const displayError = document.getElementById('card-errors');
   if (event.error) {
     displayError.textContent = event.error.message;
   } else {
     displayError.textContent = '';
   }
  });

  const button = document.getElementById('button');
  button.addEventListener('click', async (event) => {
    event.preventDefault();
    const ownerInfo = {
      owner:{ name: 'John Doe' },
      amount: 2500,
      currency: 'usd',
      
    };

    try {
      const result= await this.stripe.createSource(card, ownerInfo);
      console.log(result);
      const obj ={
        resources: result.source,
        email: 'k@g.com'
      }

     const r= this._endpointsService.makeStripePayment(obj)
     console.log(r);

      
    } catch (e) {
      console.warn(e.message);
    }
    
   
  });
   
  }
  
}
