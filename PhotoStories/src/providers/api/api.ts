import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AlertController, LoadingController } from 'ionic-angular';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
//let apiUrl = 'mongodb://127.0.0.1:27017';
let apiUrl = 'https://photostories-pardhug.herokuapp.com/api/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class ApiProvider {

  // Item global memory for Service provider
  items: any = [];

  loading: any;
  dataChanged$ : Observable<boolean>;  
  private dataChangeSubject: Subject<boolean>;

  constructor(public http: HttpClient, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    console.log('Hello ApiProvider Provider');
    // Initialize
    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
  }

// getItem method to get data in async by CRUD Get endpoint
getItems(): Observable<object[]> {
  return this.http.get(apiUrl + 'photostories').pipe(
    map(this.extractData),
    catchError(this.handleError)
  );
}

//Loading message
showLoader(){
  this.loading = this.loadingCtrl.create({
      content: 'Submitting...'
  });

  this.loading.present();
}

//Method to remove item
removeItem(item){
  console.log(item);
  this.http.delete(apiUrl+'photostories/'+item._id).subscribe(res => {
    this.items = res;
    this.dataChangeSubject.next(true);
  });
  }

// JSON data extractor
  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

// Error handler for getting data from End point in Async
private handleError(error: Response | any){
  let errMsg : string;
  if(error instanceof Response){
    const err = error || '';
    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  }else{
    errMsg = error.message ? error.message : error.toString();
  }
  console.error(errMsg);
  return Observable.throw(errMsg);
}

  createStory(data): Observable<any> {
    return this.http.post(apiUrl+'photostories', JSON.stringify(data), httpOptions);
  }

}

