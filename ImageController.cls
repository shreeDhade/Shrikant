public class ImageController {
    
   /* @AuraEnabled
    public static String saveImageAttachment(String imageUrl, String recordId) {
         try {
			// Save in Attachment            
            Attachment attchment = new Attachment();
            attchment.ParentID = recordId;
            attchment.Body = EncodingUtil.base64Decode(imageUrl.substring(imageUrl.indexOf(',') + 1));
            attchment.contentType = 'image/jpeg';
            attchment.Name=recordId+'.jpeg';
            attchment.OwnerId = UserInfo.getUserId();
            insert attchment;
            return 'success';
            
        }catch(Exception e){
            system.debug('---------- ' + e.getMessage());
            return JSON.serialize(e.getMessage());
        }
    }*/
    @AuraEnabled
    public static String saveImageFile(String imageUrl, String recordId) {
        try {
          
            ContentVersion conVer = new ContentVersion();
            conVer.ContentLocation = 'S'; // to use S specify this document is in Salesforce, to use E for external files
            conVer.PathOnClient = recordId+'.jpeg'; // The files name, extension is very important here which will help the file in preview.
            conVer.Title = 'ABC'+recordId+'.jpeg'; // Display name of the files
            conVer.OwnerId = UserInfo.getUserId();
            conVer.Origin = 'H';
            conVer.VersionData = EncodingUtil.base64Decode(imageUrl.split('base64,')[1]); // converting your binary string to Blog
            
            insert conVer;
            
            Id conDoc = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:conVer.Id].ContentDocumentId;
            //create ContentDocumentLink  record 
            ContentDocumentLink conDocLink = New ContentDocumentLink();
            conDocLink.LinkedEntityId = recordId; // Specify RECORD ID here i.e Any Object ID (Standard Object/Custom Object)
            conDocLink.ContentDocumentId = conDoc;  //ContentDocumentId Id from ContentVersion
            conDocLink.shareType = 'I';
            conDocLink.Visibility = 'AllUsers';
            insert conDocLink;
            return 'success';
            
        }catch(Exception e){
            system.debug('---------- ' + e.getMessage());
            return JSON.serialize(e.getMessage());
        }
    }
    @AuraEnabled
    public static Company_Information__c setGeolocation(Double latitude, Double longitude, String recId){
        //Company_Information__c compInfo = new Company_Information__c();
       
        Company_Information__c compInf =[SELECT Id, Location__c  FROM Company_Information__c WHERE Id = :recId];
       
        
        compInf.Location__Latitude__s = latitude;
        compInf.Location__Longitude__s = longitude;
        UPDATE compInf;
        return compInf;

    }
  
}//Double latitude1, Double longitude1
//Company_Information__c