import { Component, OnInit } from '@angular/core';

declare var $: any;
interface order{
  meal:string
  qty:string,
  price:number,
  total:number,
};               // 发送的消息内容

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  myCart: order[]=[];
  sub_total:number=0;
  tax:number=0;
  other_charge:number=0;
  amount_to_Pay:number=0;

  constructor() { 
  }
  
  ngOnInit(): void {
    let item = sessionStorage.getItem('myCart');
    if(item == ''||item=='undefined') return;
    this.myCart = JSON.parse(item);
    this.processTotal();
  }
  ngAfterViewInit() {
    console.log("ngOnViewInit");
    // this.wow.init()
    // setTimeout(() => new WOW().init(), 1000);

    // $('.owl-carousel').owlCarousel({
    //   loop: false,
    //   margin: 20,
    //   nav: false,
    //   dot: false,
    //   responsive: {
    //     0: {
    //       items: 2
    //     },
    //     600: {
    //       items: 4
    //     },
    //     1200: {
    //       items: 8
    //     }
    //   }
    // });
    $("#cancel_order").on("click", function () {
      $("#no-order").toggleClass("active");
      $("#item_list").removeClass("active");
    });
    $("#add_order").on("click", function () {
      $("#item_list").toggleClass("active");
      $("#no-order").removeClass("active");
    });
    $("#place-order").on("click", function () {
      $("#amount_to_Pay").toggleClass("active");
      $("#item_list").removeClass("active");
    });
    $("#edit_order").on("click", function () {
      $("#item_list").toggleClass("active");
      $("#amount_to_Pay").removeClass("active");
    });
    $("#submit").on("click", function () {
      $("#no-order").toggleClass("active");
      $("#amount_to_Pay").removeClass("active");
    });
    $("#menu").on("click", function () {
      $("#header").toggleClass("active");
    });
  }

  processTotal(){
    this.myCart.forEach((cart)=>{
      cart.total = cart.price * parseInt(cart.qty);
      this.sub_total += cart.total; 
    })
    this.tax = this.sub_total*0.1;
    this.amount_to_Pay = this.sub_total + this.tax;
  }
}
