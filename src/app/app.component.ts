import { Component, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { Geolocation, Geoposition, GeolocationOptions } from '@ionic-native/geolocation/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { delay } from 'q';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public watch: any;
  public lat: any;
  public lng: any;
  notId: number = 0;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private backggroundMode: BackgroundMode,
    // private locationTracker: LocationTrackerService,
    public zone: NgZone,
    private backgroundGeolocation: BackgroundGeolocation,
    private geolocation: Geolocation,
    private localNotification: LocalNotifications
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backggroundMode.enable();
      this.startTracking();
      // this.backgroundGeolocation.start();
      this.backggroundMode.on("active").subscribe(() => {
        this.myFunc();
      });
    });
  }
  startTracking() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 1,
      stationaryRadius: 10,
      distanceFilter: 10,
      debug: true,
      stopOnTerminate: true,
      interval: 1000
    };
    this.backgroundGeolocation.configure(config).then((location) => {
      this.backgroundGeolocation.start();
      this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe(
        (location: BackgroundGeolocationResponse) => {
          console.log("location ", location);
          this.lat = location.latitude;
          this.lng = location.longitude;
          console.log(this.lat + " <- this.lat");
          console.log(this.lng + " <- this.lng");
          this.sendNotification(this.lat + "<-latitude longitude->" + this.lng);
          // this.stopTracking();
          // this.startTracking();
        });
    });
  }
  sendNotification(data: any) {
    var tod = new Date(new Date().getTime());
    this.localNotification.schedule({
      id: this.notId,
      text: data,
      sound: 'file://sound.mp3',
      data: { secret: "key" },
      trigger: { at: tod }
    });
    this.notId++;
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async myFunc() {
    this.startTracking();
    await delay(3000);
    this.myFunc();
  }
}
// var lat=this.locationTracker.lat;
    // var lng=this.locationTracker.lng;
    // console.log(lat+" < ");
    // this.locationTracker.sendNotification(lat + "<-latitude longitude->"+lng);