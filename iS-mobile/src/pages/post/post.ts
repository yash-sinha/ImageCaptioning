import { Component } from '@angular/core';



import {NativeStorage } from 'ionic-native';


import { Http, Headers, RequestOptions } from '@angular/http';



import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading, NavParams  } from 'ionic-angular';
import { Camera, File, Transfer, FilePath } from 'ionic-native';


import 'rxjs/add/operator/map';


declare var Clarifai : any;

var useremail;

var env;

// var folderOptions = {
  //   sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
  //   quality : 100,
  //   encodingType : Camera.EncodingType.JPEG,
  //   correctOrientation : true
  // };

  // var cameraOptions= {
    //   quality : 100,
    //   sourceType : Camera.PictureSourceType.CAMERA,
    //   encodingType : Camera.EncodingType.JPEG,
    //   saveToPhotoAlbum : false
    // };
    var folderOptions = {
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      // destinationType: Camera.DestinationType.DATA_URL,      
      quality: 100,
      targetWidth: 300,
      targetHeight: 300,
      encodingType: Camera.EncodingType.JPEG,      
      correctOrientation: true
    };

    var cameraOptions = {
      quality : 75,
      // destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      saveToPhotoAlbum: false
    };

    declare var cordova: any;
    @Component({
      selector: 'page-post',
      templateUrl: 'post.html'
    })



    export class IssuePostPage {

      imageReady: boolean = false;
      imageReady2: boolean = true;
      captionReady: boolean = false;
      user: any;
      userReady: boolean = false;
      lastImage: string = null;
      loading: Loading;
      public imgData: string;
      public base64Image: string;
      public imageTags: string;
      public app: any;
      public tags: string = "";
      public lat : any;
      public lon : any;
      public title = 'test';
      public desc = 'test';
      public category = 'other';
      public email = 'purnendurocks@gmail.com';
      public typepic = "";
      public caption ="";

      constructor(public navCtrl: NavController, public http : Http, 
        public params:NavParams, public platform: Platform, public loadingCtrl: LoadingController, 
        public toastCtrl: ToastController) {

        //alert(this.lat);
        //alert(this.lon);

        this.http = http;

        this.base64Image = "https://placehold.it/150x150";
        this.imageTags = "";
        console.log("haha");
        this.app = new Clarifai.App(
          'OTGj6hMz_MJdIFld4q91EmNMuxqR_ttUq7FF83YI',
          '_yIdO28TNqonDVoz6jDJFcbrTQA9bSm-hSDbJNR_'
          );
        console.log(this.app);
      }


      public takePicture(typ: string) {
        var category = [];
        var categoryNames = ['Trash', 'Street Light', 'Broken Road', 'Traffic Problems', 'Homeless'];
        category.push(["garbage", "trash", "waste", "litter", "recycle", "disposal"]);
        category.push(["streetlight", "lamp", "lantern", "post", "dark"]);
        category.push(["road", "street", "pavement", "asphalt", "pothole"]);
        category.push(["traffic", "road", "car", "highway", "vehicle", "light"]);
        category.push(["people", "adult", "animal", "mammal", "fatigue", "poor"]);
        var finalCategoryCount = [0,0,0,0,0];

        var self = this;
        this.typepic = typ;
        var options = typ === "camera" ? cameraOptions : folderOptions;






        Camera.getPicture(options).then(imageData => {
          console.log("imgPath: "+imageData);
          this.imgData = imageData;
          //enable caption generate button
          env.imageReady = true;
          env.imageReady2 = false;
          this.caption="";
          this.captionReady = false;
          this.base64Image = "data:image/jpeg;base64," + imageData;
          //alert(imageData);
          this.app.models.predict(Clarifai.GENERAL_MODEL, imageData).then(
            function(response) {
              //alert(response);
              console.log(response);
              if(response.data.status.code == 10000){
                self.tags = "";
                response.data.outputs[0].data.concepts.forEach(function(concept) {
                  self.imageTags += concept.name + " : " + concept.value + "\n";
                  self.tags += concept.name + "    ";

                  category.forEach(function(valu, index) {
                    valu.forEach(function(val) {
                      if(concept.name.toLowerCase() == val){
                        finalCategoryCount[index] += concept.value;
                      }
                    });
                  });
                });
                var maxValue = 0;
                var maxIndex = 0;
                finalCategoryCount.forEach((val, index) => {
                  if(val > maxValue){
                    maxValue = val;
                    maxIndex = index;
                  }
                });
                //self.category = categoryNames[maxIndex];
                console.log(self.imageTags);
                //alert(self.imageTags)
              }
            },
            function(err) {
              // alert(err);
              console.error(err);
            }
            );
        }, error => {
          console.log("ERROR -> " + JSON.stringify(error));
        });
      }

      // Create a new name for the image
      private createFileName() {
        var d = new Date(),
        n = d.getTime(),
        newFileName =  n + ".jpg";
        return newFileName;
      }

      // Copy the image to a local folder
      private copyFileToLocalDir(namePath, currentName, newFileName) {
        File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
          this.lastImage = newFileName;
          this.startUploading();
        }, error => {
          this.presentToast('Error while storing file.');
        });
      }

      private startUploading(){
        var url = "http://24.170.202.5:8000/upload/";
        console.log('WOrking 2x8');
        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);
        console.log('WOrking 2x9');
        // File name only
        var filename = this.lastImage;

        // let options = {
          //   fileKey:'uploadedfile',
          //   chunkedMode:false,
          //   mimeType:'multipart/form-data',
          //   params: {'post_id':data.id}
          // };
          var options3 = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
          };
          console.log('WOrking 2x10');
          const fileTransfer = new Transfer();
          console.log('WOrking 1');

          this.loading = this.loadingCtrl.create({
            content: 'Uploading...',
          });

          this.loading.present();
          console.log('WOrking 2');
          // Use the FileTransfer to upload the image
          fileTransfer.upload(targetPath, url, options3).then(data => {
            this.loading.dismissAll()
            this.presentToast('Image succesfully uploaded.');
            console.log('WOrking 3');
               this.loading = this.loadingCtrl.create({
            content: 'Generating Caption...',
          });
          this.loading.present();
            this.getResult();
          }, err => {
            this.loading.dismissAll()
            this.presentToast('Error while uploading file.');
            console.log('WOrking 4'+err);
          });
          console.log('WOrking 5');
        }

        private getResult(){
          var url = 'http://24.170.202.5:8000/result/';
          console.log('WOrking 6');
       
          this.http.get(url).map(res => res.json()).subscribe(data => {
            // console.log('Status='+data.status);
            //console.log(JSON.stringify(data));
            console.log('WOrking 7');


            console.log("data: " +data[0].caption);
            //var obj = JSON.parse(data);
            //console.log(JSON.stringify(data));
            //console.log("obj: "+);
            //console.log("obj caption: "+obj.caption);

            this.presentToast(data[0].caption);
            this.caption="\""+data[0].caption+"\"";
            this.captionReady = true;
            env.imageReady = false;
            this.loading.dismissAll()
            console.log('WOrking 8');

          }, err => {
            this.loading.dismissAll()
            this.presentToast('Error in Get Request');
            console.log('Error Get'+err);
          });


           //this.loading.dismissAll()

          // this.http.get(url).subscribe(result =>{
          //   console.log('Status='+result.status);
          //   console.log(JSON.stringify(result.json()));
          //   this.presentToast(JSON.stringify(result.json()));
          // }, error=>{
          //   console.log(error.toString());
          // });
        }

        private presentToast(text) {
          let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }

        // Always get the accurate path to your apps folder
        public pathForImage(img) {
          if (img === null) {
            return '';
          } else {
            return cordova.file.dataDirectory + img;
          }
        }



        ionViewCanEnter(){
          env = this;
          NativeStorage.getItem('user')
          .then(function (data){
            env.user = {
              name: data.name,
              gender: data.gender,
              picture: data.picture,
              email: data.email
            };
            env.userReady = true;
            console.log('Works'+env.user.name+' Email= '+env.user.email);
            useremail = env.user.email;
          }, function(error){
            console.log('Error '+error);
          });
        }

        onPostSubmit(){
          //alert('Works '+useremail);
          let nav = this.navCtrl;

          var options2 = this.typepic === "camera" ? cameraOptions : folderOptions;
          var imagePath = this.base64Image.split(',')[1];

          console.log("option type: "+this.typepic);

          // Get the data of an image
          //  Camera.getPicture(options2).then((imagePath) => {
            File.resolveLocalFilesystemUrl(imagePath).then((entry)=>{
              console.log("got file: " + entry.fullPath);

              //console.log("imgPath: "+imagePath);
              // Special handling for Android library
              console.log('WOrking 2x1');
              if (this.platform.is('android')) {
                console.log('WOrking 2x2');
                FilePath.resolveNativePath(imagePath)
                .then(filePath => {
                  let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                  let currentName = filePath.substr(imagePath.lastIndexOf('/') + 1);//imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                  this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                });
                console.log('WOrking 2x3');
              } else {
                console.log('WOrking 2x4');
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                console.log('WOrking 2x5');
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                console.log('WOrking 2x6');
              }
              // Destination URL


            }, (err) => {
              console.log('WOrking 2x7');
              this.presentToast('Error while selecting image here.');
            });
            // },err=>{
              //   console.log('Error while selecting image');
              // });














              //let url = 'http://citysavior.pythonanywhere.com/posts/api/post/';
              //   let lat = Number(this.lat);
              //   let lon = Number(this.lon);
              //     //let body = JSON.stringify({ title: 'tes1', desc: 'test', lat: '2322', lon: '2322', email: 'purnendurocks@gmail.com', category :'other'});
              //     //alert(body);
              //     var email = useremail.replace('@','%40');
              //     let testbody = 'lat='+lat+'&title='+this.title+'&email='+email+'&category='+this.category+'&desc='+this.desc+'&lon='+lon;
              //     //alert(testbody);
              //     //let body = encodeURIComponent(testbody);
              //     //alert(body);
              //     //body = 'lat=233&title=test&email=purnendurocks%40gmail.com&category=other&desc=test&lon=2322';
              //     //var encodedBody = encodeURIComponent(body);
              //     //alert(encodedBody);
              //     //alert(body);
              //  let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
              //  let options = new RequestOptions({ headers:headers});
              //  this.http.post(url,testbody,options).subscribe( res => {
                //  console.log(res.status);
                //   if(res.status == 201)
                //   {
                  //       alert('Post submitted successfully');
                  //       // nav.setRoot(TabsPage);

                  //   }
                  //   }, err => {
                    //    console.log('Submission error occured');
                    //     alert('error '+err);
                    //     alert(JSON.stringify(err.json()));
                    // console.log(JSON.stringify(err.json()));
                    //   });

/*

  var req = {
      method: 'POST',
      url: 'http://lexico.pythonanywhere.com/vocabsession/api/userprog/',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {"user":"riddhima", "word":$scope.word, "level":$scope.newLevel}
    }

    $http(req).then(function (response) {
      ////////alert("blah");
    }, function (response) {
      ////////alert("nah");
      // Failure Function
      });




    let url1 = 'http://citysavior.pythonanywhere.com/posts/api/member/';
      let body1= JSON.stringify({'email': 'test101@swamphacks.com','name':'test1'});
    let headers1 = new Headers({'Content-Type': 'application/json'});
    let options1 = new RequestOptions({ headers:headers});
    this.http.post(url1,body1,options1).subscribe( res => {
    console.log(res.status);
     if(res.status == 201)
     {
        alert('member url post works!');
     }
     }, err => {
      console.log('Sign up Error occured');
      alert('error '+err);
    console.log(JSON.stringify(err.json()));
     });




    let url = 'http://citysavior.pythonanywhere.com/posts/api/post_search_nearby/';
  let body = JSON.stringify({'min_lat': lat_min, 'min_lon': lng_min, 'max_lat': lat_max, 'max_lon': lng_max});
  
  let headers = new Headers({'Content-Type': 'application/json'});
  let options = new RequestOptions({ headers:headers});
  this.http.post(url,body,options).subscribe( result => {
  console.log('Result:'+result.status);
  console.log('Data ='+this.data.length);
  console.log('Markers ='+this.markers.length);
  if(this.data.length > 0){
   this.data.length =0;
   this.markers.length =0;
   this.map.clear();
   }
  this.data = result.json();
     //console.log(JSON.stringify(this.data));
  
  this.loading.dismiss();
  console.log('Data ='+this.data.length);
  console.log('Markers ='+this.markers.length);
  this.map.setClickable(true);
  });
  }

  */


}

}
