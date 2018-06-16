import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import 'rxjs/add/operator/map';
import {FormArray, FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {AngularFirestore} from "angularfire2/firestore";
import {DataProcessingService} from "../../shared/services/data-processing.service";
import {DataStorageService} from "../../shared/services/data-storage.service";
import {InventoryService} from "../services/inventory.service";
import {DatePipe} from "@angular/common";
import {InventoryManeger} from "../../shared/classes/InventoryMenager"
import {HelperService} from "../../shared/services/helper.service";

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent extends InventoryManeger implements OnInit {
     public archiveToggle = true;
   @ViewChild('checkMe') checkMe: ElementRef;
     @ViewChild('fname') fname: ElementRef;
  constructor(public modalService: NgbModal,
              public formBuilder: FormBuilder,
              public dataProcessingService: DataProcessingService,
              public dataStorageService: DataStorageService,
              public inventoryService: InventoryService,
              public datePipe: DatePipe) {
    super(modalService, formBuilder, dataProcessingService, dataStorageService, datePipe);
  }


  ngOnInit() {
    this.inventoryService.getInventories().subscribe(res => {
      this.inventoryItems = HelperService.getItemsByHotelId(res);
      if (!this.inventoryItems) {
        return;
      }
     
     
      this.inventoryItems = this.inventoryItems.data;
      this.inventoryLabels = [];
      this.getDates(this.inventoryItems.maintenance[Object.keys(this.inventoryItems.maintenance)[0]]);
      this.getLabels(this.inventoryItems.maintenance);
    });

    this.form = this.formBuilder.group({
      date: [''],
      inventories: this.formBuilder.array([this.createFormInput()])
    });
    console.log(this.form);
  }

  addItem(item, hotelId) {
    this.inventoryService.addMaintenance(item, hotelId);
  }

  saveFormInput() {
    if(!this.inventoryItems) {
      this.inventoryItems = {
        maintenance: {}
      };
      this.inventoryDates = [];
      this.inventoryService.addNewField();
    }

    if(!this.inventoryItems.maintenance[Object.keys(this.inventoryItems.maintenance)[0]]) {
      this.inventoryDates = [];
    }
    this.form.value.inventories.forEach(item => {
      if (!this.inventoryItems.maintenance[item.item]) this.addNewItem(item.item);
    });


    let date = this.form.value.date ? this.datePipe.transform(this.form.value.date, 'yyyy-MM-dd') : this.datePipe.transform(new Date(), 'MM-dd-YYYY');
    let indexOfItem = this.checkIfDateExist(date);



    if (indexOfItem == -1) {
      this.addNewDate(date);
      indexOfItem = this.inventoryDates.length - 1;
    }

    this.form.value.inventories.forEach(item => {
      this.inventoryItems.maintenance[item.item][indexOfItem].need = item.need;
      this.inventoryItems.maintenance[item.item][indexOfItem].have = item.have;
    });

    this.inventoryDates.sort((a, b) => +new Date(b) - +new Date(a));

    this.sortByDate();

      //to reset all add this code  
  // this.addItem({
  //        'hammer': [{'date': '2018-06-01', have: '1', need: '8'}, {
  //          'date': '2018-03-01', have: '1', need: '8'
  //        }]}, localStorage.hotelId);
    this.addItem(this.inventoryItems.maintenance, localStorage.hotelId);
  }
  addNewItem(name) {
    this.inventoryItems.maintenance[name] = [];
    this.inventoryDates.forEach(date => {
      this.inventoryItems.maintenance[name].push({
        date: date,
        have: "",
        need: ""
      })
    })
  }

updateItem() {
   this.sortByDate();
    this.addItem(this.inventoryItems.maintenance, localStorage.hotelId);
  
}
  addNewDate(date) {
    this.inventoryDates.push(date)
    for (let key in this.inventoryItems.maintenance) {
      this.inventoryItems.maintenance[key].push({
        date: date,
        have: "",
        need: ""
      })
    }
  }
  updateRooms() {
    this.addItem(this.inventoryItems.maintenance, localStorage.hotelId);
  }

  sortByDate() {
    for (let key in this.inventoryItems.maintenance) {
      this.inventoryItems.maintenance[key].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    }
    this.getDates(this.inventoryItems.maintenance[Object.keys(this.inventoryItems.maintenance)[0]]);
  }

  updateItemsByType() {
    this.currentItem = this.inventoryItems.maintenance[this.nameOfItem];
  }
  archiveRow() {
    if(localStorage.getItem('table')!= null){
       document.getElementsByTagName('input').checked = localStorage.getItem('table');

    }  
    let checkboxes =  document.getElementsByTagName('input');

    let arr = [];

console.log('reloaded checkboxes',checkboxes);
//  let checkboxes = document.getElementsByTagName('input');
    for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked === true) {
     let table = <HTMLElement>document.getElementById('table');
      checkboxes[i].closest('tr').classList.add('archive');
      table.appendChild(checkboxes[i].closest('tr'));
arr.push(checkboxes[i].checked=true);
    } else {
arr.push(checkboxes[i].checked=false);
}
    }localStorage.setItem('table', JSON.stringify(arr));
    console.log('saved states of check boxes',arr);
}
}



