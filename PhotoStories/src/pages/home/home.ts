import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { ApiProvider } from '../../providers/api/api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  title: "Photo stories";
  //Set Document format constraint
  photoStory = { avatar: '', header: '', story: '' };
  imgPreview = 'assets/imgs/gallery.png';
  loading: any;
  constructor(public navCtrl: NavController, private imagePicker: ImagePicker, private base64: Base64,
    public api: ApiProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
  }
  //Method to Pick Picture for the Story calling imagePicker Native API accessing device library
  getPhoto() {
    //Limit to select only 1 picture
    let options = {
      maximumImagesCount: 1
    };
    console.log(this.imagePicker);
    //Trigger Native API to select picture
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.imgPreview = results[i];
        this.base64.encodeFile(results[i]).then((base64File: string) => {
          this.photoStory.avatar = base64File;
        }, (err) => {
          console.log(err);
        });
      }
    }).catch((error) => {
      console.error("Error while picking picture: ", error);
    });
  }
  // Method to Create a Story 
  createStory() {
    this.api.showLoader();
    console.log('Creating Story');
    //Get the document from Create Screen
    this.api.createStory(this.photoStory).subscribe((result) => {
      this.api.loading.dismiss();
      //Alert Success one the story is saved
      let alert = this.alertCtrl.create({
        title: 'Story Created Successfully',
        subTitle: 'Great! You created new story',
        buttons: ['OK']
      });
      alert.present();
      //Set the screen options to blank
      this.photoStory.header = '';
      this.photoStory.story = '';
      this.photoStory.avatar = '';
      }, (err) => {
      console.log(err);
      this.loading.dismiss();
      let alert = this.alertCtrl.create({
        //Alert Error if any issues with to save the doc
        title: 'Story Creation Failed',
        subTitle: 'Error in the process',
        buttons: ['OK']
      });
      alert.present();
    });
  }
}
