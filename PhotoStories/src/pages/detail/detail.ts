import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  //Initialize item Arra & eroe msg string
  items = [];
  errorMessage: string;

  constructor(public navCtrl: NavController,
              public api: ApiProvider,  public navParams: NavParams, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController, public alertCtrl: AlertController) {
  }

  //Default method to load items along with Ionic contructor
  ionViewDidEnter() {
    this.loadItems();
  }
  
  //Method to load items in Async
  loadItems(){
    this.api.getItems()
      .subscribe(
        items => this.items = items,
        error => this.errorMessage = <any>error
        );
  }

  //Method to remove item
  removeItem(item, index){
    const toast = this.toastCtrl.create({
      message: 'Removing Item number '+ index,
      duration: 3000 }
    );
    toast.present();
    //Remove item by api provider function
    this.api.removeItem(item);
  }

}
