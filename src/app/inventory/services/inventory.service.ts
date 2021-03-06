import {Injectable} from "@angular/core";
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "angularfire2/firestore";
import {AngularFireDatabase} from "angularfire2/database";
import * as firebase from "firebase";
import {FormBuilder} from "@angular/forms";
// Interfaces
import { Inventory } from "../interface/inventory";
import {Manager} from "../../home/interfaces/manager";
import {Hotel} from "../../hotels/interfaces/hotel";
// Services
import { DataStorageService } from "../../shared/services/data-storage.service";
import {DataProcessingService} from "../../shared/services/data-processing.service";
import {AuthService} from "../../auth/auth.service";
import {HotelService} from "../../hotels/services/hotel.service";
import {HelperService} from "../../shared/services/helper.service";

@Injectable()
export class InventoryService {

  inventoriesCol: AngularFirestoreCollection<Inventory>;
  inventories: Array<Inventory>;
  hotelId: string;

  constructor(private afs: AngularFirestore,
              private dataStorageService: DataStorageService,
              private db: AngularFireDatabase,
              public dataProcessingService: DataProcessingService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private hotelSevice: HotelService) {}


  getInventories() {
    this.inventoriesCol = this.afs.collection('inventories');
    return this.inventoriesCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Inventory;
          const id = a.payload.doc.id;
          return {id, data};
        })
      })
  }

  addRoom(room, hotelId) {
    this.afs.collection('inventories').doc(hotelId).update({
      "room" : room
    });
  }
  addMaintenance(item, hotelId) {
    this.afs.collection('inventories').doc(hotelId).update({
      "maintenance" : item
    });
  }
  addFb(item, hotelId) {
    this.afs.collection('inventories').doc(hotelId).update({
      "fb" : item
    });
  }

  addMisc(item, hotelId) {
    this.afs.collection('inventories').doc(hotelId).update({
      "misc" : item
    });
  }

  addNewField(){
    this.afs.collection('inventories').doc(localStorage.hotelId).set({
      "room" : {} ,
      "maintenance" : {},
      "fb" : {},
      "misc" : {},
    });
  }
}
