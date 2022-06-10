import { LightningElement,track,api,wire } from "lwc";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import pubsub from 'c/prPubsub';
import { updateRecord } from 'lightning/uiRecordApi';
/*import setGeolocation from '@salesforce/apex/ImageController.setGeolocation'
import LATITUDE_FIELD from '@salesforce/schema/Company_Information__c.Latitude__c'
import LONGITUDE_FIELD from '@salesforce/schema/Company_Information__c.Longitude__c'*/

/*import {refreshApex} from '@salesforce/apex'
import { createRecord } from "lightning/uiRecordApi";
import { getRecord } from "lightning/uiRecordApi";
import ownerId from '@salesforce/schema/Account.OwnerId'
import CONTENTvERSION from '@salesforce/schema/ContentVersion'
import PATHONCLIENT_FIELD from '@salesforce/schema/ContentVersion.PathOnClient'
import Origin from '@salesforce/schema/ContentVersion.Origin'
import Title from '@salesforce/schema/ContentVersion.Title'
import VersionData from '@salesforce/schema/ContentVersion.VersionData'*/
import saveImageFile from '@salesforce/apex/ImageController.saveImageFile'

export default class App extends LightningElement {
 
  @api recordId
  showText = false;
  handleClick(){
    this.showText = !this.showText;    
  }
  
  async frontCamera(){
    alert('front start') 
    
    //if (navigator.getUserMedia){
      const video = this.template.querySelector('video');
      var constraints = { video: { facingMode: "user" }, audio: false }
    const stream = await navigator.mediaDevices.getUserMedia(constraints)    
    video.srcObject = stream;
    alert('front Cam2')  
    
    
  /*}else{
    alert('media not supported')
  }*/
}
 
  async backCamera() {
   // if (navigator.getUserMedia){
    alert('back Cam1 start')
    const video = this.template.querySelector('video');
    var constraints = { video: { facingMode: "environment" }, audio: false }
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    video.srcObject = stream;
    alert('back cam end')
   /* }else{
      alert('media not supported')
    }*/
    
    //this.stream = !this.stream
  }
 /*rec = [{
  lstMarkers : [],
  zoomlevel :''
 }]*/
 lstMarkers = []
// zoomlevel
  image_data_url

  @track latitude
  @track longitude
  // capture image
  
  clickPhoto() {   
    
    if (navigator.geolocation) {
      
      navigator.geolocation.getCurrentPosition(position => {

          // Get the Latitude and Longitude from Geolocation API
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          
          // Add Latitude and Longitude to the markers list.
          this.lstMarkers = [{
              location : {  
                  Latitude: this.latitude,
                  Longitude : this.longitude
              },
              title : 'You are here'
          }];
          
          //this.zoomlevel = "15";
          this.eventPublisher(this.lstMarkers)
         
      });
      //this.eventPublisher(this.lstMarkers)
      
    }
    var video = this.template.querySelector('video');
    var canvas = this.template.querySelector('canvas');
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
     this.image_data_url  = canvas.toDataURL('image/jpeg');  
     
   
 
    }
    eventPublisher(data){
      //alert('go ahead');
      console.log('eventPublisher==>',JSON.stringify(data))
      pubsub.publish("accordionTriggered", data)
      //alert('Passing data');
    }
    // publisher(data){
    //   pubsub.publish("urlPassing", data)
    // }
   
            saveImage(){
              saveImageFile({imageUrl:this.image_data_url, recordId:this.recordId})
                .then(result=>{

                  const evt = new ShowToastEvent({
                      title: 'Photo Updated ',
                      message: `Photo Updated Succesfully `,
                      variant: 'success', 
                  });
                  this.dispatchEvent(evt);
            
              })
              .catch(error=>{
                  const evt1 = new ShowToastEvent({
                      title: 'Photo Update Fail',
                      message: `Photo Update Fail `,
                      variant: 'error',
                  });
                  this.dispatchEvent(evt1);                  
          
              })
             
            }

           
            
              
}
           



