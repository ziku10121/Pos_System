import { webSocket } from 'rxjs/webSocket';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;
declare var bootstrap: any;
interface message{
  status:string,    //訊息狀態(msg, end, ad, menu)
  from:string,      //來源(user, ai)
  msg:string,       //訊息
  food_img:string,
  meal:string,      //食物名稱
  qty:string,       //數量
  price:number,     //價格
  sub_total:number, //小計
};               // 发送的消息内容
interface info{
  age:string,
  gender:string
};               // 发送的消息内容
interface order{
  meal:string,
  qty:string,
  price:number,
  food_img:string,
};               // 发送的消息内容

@Component({
  selector: 'app-ai-order',
  templateUrl: './ai-order.component.html',
  styleUrls: ['./ai-order.component.css']
})
export class AiOrderComponent implements OnInit {
  subject = webSocket('ws://192.168.1.219:8767/'); //websocket連結
  data: message[] = [
    {
      status:'msg',
      from:'ai',
      msg:'歡迎光臨,我是本次服務的AI Waiter',
      food_img:'',
      meal:'',
      qty:'',
      price:0,
      sub_total:0,
    },{
      status:'msg',
      from:'ai',
      msg:'請問你要點什麼？',
      food_img:'',
      meal:'',
      qty:'',
      price:0,
      sub_total:0,
    },{
      status:'msg',
      from:'user',
      msg:'我要一份蔥爆牛肉，不要辣',
      food_img:'',
      meal:'',
      qty:'',
      price:0,
      sub_total:0,
    },{
      status:'msg',
      from:'ai',
      msg:' 好的，一份蔥爆牛肉不要辣',
      food_img:'',
      meal:'蔥爆牛肉',
      qty:'1',
      price:200,
      sub_total:0,
    },{
      status:'msg',
      from:'user',
      msg:'再一份招牌豆腐',
      food_img:'',
      meal:'',
      qty:'',
      price:0,
      sub_total:0,
    },{
      status:'msg',
      from:'ai',
      msg:'好的，一份招牌豆腐',
      food_img:'',
      meal:'招牌豆腐',
      qty:'1',
      price:100,
      sub_total:0,
    },{
      status:'msg',
      from:'user',
      msg:'然後，一份鳳梨蝦球',
      food_img:'',
      meal:'',
      qty:'',
      price:0,
      sub_total:0,
    },{
      status:'msg',
      from:'ai',
      msg:'好的，一份鳳梨蝦球',
      food_img:'',
      meal:'鳳梨蝦球',
      qty:'1',
      price:200,
      sub_total:0,
    },{
      status:'msg',
      from:'user',
      msg:'最後，5碗白飯',
      food_img:'',
      meal:'',
      qty:'',
      price:0,
      sub_total:0,
    },{
      status:'msg',
      from:'ai',
      msg:'好的，5碗白飯',
      food_img:'',
      meal:'白飯',
      qty:'5',
      price:10,
      sub_total:0,
    },{
      status:'msg',
      from:'user',
      msg:'這樣就好了',
      food_img:'',
      meal:'',
      qty:'',
      price:0,
      sub_total:0,
    },{
      status:'msg',
      from:'ai',
      msg:'我能向您推薦餐點嘛？',
      food_img:'',
      meal:'',
      qty:'',
      price:0,
      sub_total:0,
    },{
      status:'msg',
      from:'user',
      msg:'好',
      food_img:'',
      meal:'',
      qty:'',
      price:0,
      sub_total:0,
    },{
      status:'ad',
      from:'',
      msg:'[{xxx},{xxx},{xxx}]',
      food_img:'',
      meal:'',
      qty:'',
      price:0,
      sub_total:0,
    },
  ];                                //消息列表
  ad_data: order[] = [
    {
      meal:'咕咾肉',
      qty:'1',
      price:180,
      food_img:'',
    },{
      meal:'紫蘇鴨',
      qty:'1',
      price:200,
      food_img:'',
    },{
      meal:'骨肉炒韭菜',
      qty:'1',
      price:160,
      food_img:'',
    }
  ];                                //消息列表
  num :number = 0;                  //暫存data順序
  food:Object={
    '咕咾肉':'01',
    '紫蘇鴨':'02',
    '客家小炒':'03',
    '招牌豆腐':'04',
    '蔥爆牛肉':'05',
    '薑絲大腸':'06',
    '鳳梨蝦球':'07',
    '客家鹹豬肉':'08',
    '骨肉炒韭菜':'09',
    '白飯':'10',
  };                                //菜名對應圖片
  
  sendmsg = 'hello x2';             //寄送消息
  msg: message;                     //接收temp消息
  messages: message[]=[];           //全部消息
  error: any;                       //異常信息
  userInfo: info;                   //user資訊
  prev_from : Array<string>=[];

  chat :any;            
  tempCart: order = {
    meal: '',
    qty: '',
    price:0,
    food_img:'',
  };
  myCart: order[]=[];               //目前user加入購物車食物

  sub_total:number = 0;             //food小計
  ad:boolean = false;               //顯示廣告
  ads_food:order[]=[];
  

  constructor(private router: Router) { }
  
  ngOnInit(): void {
    this.myCart = [];
    this.messages =[];
    this.subject.next(this.sendmsg);
    this.chat = document.querySelector('.chatContent .chat');
    this.subject.subscribe({
      next: msg => {
        
        // console.log('message received: ' + JSON.stringify(msg));
        this.msg = JSON.parse(JSON.stringify(msg));
        this.prev_from.push(this.msg.from);
        if(this.msg.status === 'end')
        {
          sessionStorage.setItem('myCart',JSON.stringify(this.myCart));
          this.router.navigateByUrl('/home');
        }
        if(this.msg.status === 'ad'){
          this.ads_food = JSON.parse(JSON.stringify(this.msg));
          this.processAds(this.ads_food);
        }
        if(this.msg.status === 'msg') {
          this.orderApi(this.msg);
        }

        // if(this.msg.status  === 'success'){
        //   if(this.msg.from!=''){}
        // }else if(msg === 'error'){

        // }
      }, // Called whenever there is a message from the server.
      error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
    });

    this.getInfo();
  }

  getInfo(){
    let info = sessionStorage.getItem('info');
    this.userInfo = JSON.parse(info);
    if(this.userInfo === null || this.userInfo === undefined)
      this.router.navigateByUrl('/ai_home');
  }

  menu() {
  }
  order(){
    if(this.data.length<this.num)return;
    if(this.num == this.data.length){
      sessionStorage.setItem('myCart',JSON.stringify(this.myCart));
      this.router.navigateByUrl('/home');
      return;
    }
    //Test
    // this.messages.push(this.data[this.num]);
    console.log(this.data[this.num].status)
    if(this.data[this.num].status === 'ad') {
      this.processAds(this.ad_data);
      //Add
      this.num++;
      return;
    }
    this.prev_from.push(this.data[this.num].from.toString());
    console.log(this.prev_from);
    if(this.data[this.num].status === 'msg')this.messages.push(this.data[this.num]);
    if(this.messages[this.num].meal!='' && this.messages[this.num].meal!=undefined){
      this.tempCart.meal = this.messages[this.num].meal.toString();
      this.tempCart.qty = this.messages[this.num].qty.toString();
      this.tempCart.price = this.messages[this.num].price;
      
      this.sub_total = this.sub_total+this.tempCart.price * parseInt(this.tempCart.qty);
      this.messages[this.num].sub_total = this.sub_total;
      this.messages[this.num].food_img =  'food_'+this.food[this.messages[this.num].meal];
      console.log(this.messages);

      this.myCart.push(JSON.parse(JSON.stringify(this.tempCart)));
    }
    
    //Add
    this.num++;

    //Bottom Scroll
    setTimeout(() => {
      this.chat.scrollTo({
        top:this.chat.scrollHeight,
        behavior:'smooth'
      });
    }, 100);
    console.log(this.myCart.length);
  }
  orderApi(_msg:message){
    
    console.log('messages',this.messages);
    if(_msg.status === 'ad') this.processAds(this.ad_data);
    if(_msg.status === 'msg')this.messages.push(_msg);
    if(_msg.meal!='' && _msg.meal!='undefined'){
      this.tempCart.meal = _msg.meal.toString();
      this.tempCart.qty = _msg.qty.toString();
      this.tempCart.price = this.messages[this.num].price;

      this.sub_total = this.sub_total+this.tempCart.price * parseInt(this.tempCart.qty);
      this.messages[this.num].sub_total = this.sub_total;
      this.messages[this.num].food_img =  'food_'+this.food[this.messages[this.num].meal];

      this.myCart.push(JSON.parse(JSON.stringify(this.tempCart)));
    }

    this.scrollDown();
  }

  processAds(_ads:order[]){
    //get image
    _ads.forEach(ad => {
      ad.food_img = 'food_'+ this.food[ad.meal];
    });
    this.ads_food = _ads;
    this.ad= !this.ad;
    this.scrollDown();
  }

  scrollDown(){
    //Bottom Scroll
    setTimeout(() => {
      this.chat.scrollTo({
        top:this.chat.scrollHeight,
        behavior:'smooth'
      });
    }, 100);
  }

  home() {
    this.processAds(this.ad_data);
    console.log(this.ad_data)
    // this.ad= !this.ad;
    // this.router.navigateByUrl('/home');
  }

  aiHome(){
    this.router.navigateByUrl('/ai_home');
  }
}
