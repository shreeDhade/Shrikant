import { LightningElement,api, track } from 'lwc';
import pubsub from 'c/prPubsub';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import setGeolocation from '@salesforce/apex/ImageController.setGeolocation'

export default class AppChild extends LightningElement {
   @api recordId
   @track rec = [];
    //entries = Object.values(this.rec)
    @track zoom = '10'
    @track lat
    @track long
   connectedCallback(){
      // alert('connectedCallback')
    this.callsubscriber()
}
callsubscriber(){
    //alert('callsubscriber')
    pubsub.subscribe('accordionTriggered', this.subscriberCallback)
}
subscriberCallback=(event)=>{
    //alert('subscriberCallback')
    //console.log('subscriberCallback==>',event)
    //console.log('subscriberCallback==>',JSON.stringify(event));
   /* var objectVAR = JSON.stringify(event);
    console.log('objectVAR11==>',JSON.stringify(event[0].location.Latitude));
    
    console.log('objectVAR12==>',(event[0]['location']['Longitude']));*/
    this.rec = event;       
    this.lat = event[0]['location']['Latitude']
    this.long = event[0]['location']['Longitude']
    

/* var new34=[];
 new34.push(event[0].Latitude);
 console.log("eeffef",new34);*/

// var new34= this.event.location.Latitude;
// console.log("new34 value 0" ,new34);


//    var obj = JSON.parse(event)
//    console.log('obj==>',obj)
//    for(var i in obj)
//    this.rec.push(obj[i]);
//    console.log('this.rec==>',this.rec)
}
//entries = Object.keys(this.rec)
handleClick(){
    console.log('this.lat==>', this.lat)
    console.log('this.long===>', this.long)
    setGeolocation({latitude:this.lat, longitude:this.long, recId:this.recordId}).then(result=>{
        const evt = new ShowToastEvent({
            title: 'Location Updated ',
            message: `Location Updated Succesfully `,
            variant: 'success', 
        });
        this.dispatchEvent(evt);
  
    })
    .catch(error=>{
        const evt1 = new ShowToastEvent({
            title: 'Location Update Fail',
            message: `Location Update Fail `,
            variant: 'error',
        });
        this.dispatchEvent(evt1);                  

    })
  
}

}