import { Component, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { EndpointsService } from "../services/endpoints.service";

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css'],
  providers: [EndpointsService]
})
export class StripeComponent implements OnInit, AfterViewInit {
  private stripe: Stripe;
  private amount = '100.00'; // Monto de PayPal

  constructor(
    private _endpointsService: EndpointsService,
    private elRef: ElementRef
  ) { }

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51QEvYxHvRGf2ixKsvxbp4SIQym1nWVYe5JzuWuck0Sp0LtkYd7Ntt6qcnCwaCr6GIlq2dM1VAg0G512QEh1u8azJ00Y8eML9zz');

    const elements = this.stripe.elements();
    
    // Crear campos individuales para número de tarjeta, expiración y CVC
    const cardNumber = elements.create('cardNumber');
    cardNumber.mount('#card-number');
    
    const cardExpiry = elements.create('cardExpiry');
    cardExpiry.mount('#card-expiry');
    
    const cardCvc = elements.create('cardCvc');
    cardCvc.mount('#card-cvc');
    
    // Manejar errores
    cardNumber.on('change', this.handleCardError);
    cardExpiry.on('change', this.handleCardError);
    cardCvc.on('change', this.handleCardError);

    const button = document.getElementById('button');
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const ownerInfo = {
        owner: { name: 'John Doe' },
        amount: 2500,
        currency: 'usd',
      };

      try {
        const result = await this.stripe.createSource(cardNumber, ownerInfo);
        const obj = {
          resources: result.source,
          email: 'k@g.com'
        };

        const r = this._endpointsService.makeStripePayment(obj);
        console.log(r);
      } catch (e) {
        console.warn(e.message);
      }
    });
  }

  private handleCardError(event) {
    const displayError = document.getElementById('card-errors');
    displayError.textContent = event.error ? event.error.message : '';
  }

  ngAfterViewInit(): void {
    this.loadPayPalButton();
  }

  private loadPayPalButton() {
    if ((window as any).paypal) {
      (window as any).paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: this.amount
              }
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            alert('Compra completada por ' + details.payer.name.given_name);
          });
        },
        onError: (err: any) => {
          console.error('Error en el pago: ', err);
          alert('Hubo un error en el pago.');
        }
      }).render(this.elRef.nativeElement.querySelector('#paypal-button-container'));
    }
  }
}
