import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/map';
import {FormArray, FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
/*Interfaces */
import { Payroll } from './interface/payroll';
import {Hotel} from '../hotels/interfaces/hotel';
// Services
import {DataProcessingService} from '../shared/services/data-processing.service';
import {DataStorageService} from '../shared/services/data-storage.service';
import {AuthService} from '../auth/auth.service';
import { PayrollService } from './services/payroll.service';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent implements OnInit {
  closeResult: string;
  form: FormGroup;
  payrollls: any;
  payrol: Array<Payroll>;
  hotel: Observable<Hotel>;

  payrollItems: any;

  name: string;
  regular: any;
  over: any;
  hotelId: any;

  constructor(private router: Router,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private afs: AngularFirestore,
              public dataProcessingService: DataProcessingService,
              public dataStorageService: DataStorageService,
              private authService: AuthService,
              private payrollService: PayrollService) { }

  ngOnInit() {
    /*  this.payrollService.getPayrolls().subscribe(res => {
        // this.payrollls  = this.dataProcessingService.createArrayOfItemsbyHotelId(res);
        console.log(res);
        console.log(this.payrollls);
        // this.payrollls.push(res);
      });*/
    // this.a = this.mas;
    // this.a = this.payrollService.getPayrolls();

    this.payrollService.getPayrolls().subscribe(res => {
      this.payrollls = this.dataProcessingService.createArrayOfItemsbyHotelId2(res);
    });
    // this.payrollService.getPayrolls();

    // this.payrollService.getPayrolls().subscribe(res => {
    //   this.payrollls  = this.dataProcessingService.createArrayOfItemsbyHotelId(res);
    // });

    this.form = this.formBuilder.group({
      date: [''],
      payrolls: this.formBuilder.array([this.createFormInput()])
    });
    /*console.log(this.form);*/
  }

  createFormInput(): FormGroup {
    return this.formBuilder.group({
      name: '',
      regular: '',
      over: ''
    });
  }

  addFormInput() {
    const payroll = this.createFormInput();
    this.payrolls.push(payroll);
  }
  get payrolls(): FormArray {
    return this.form.get('payrolls') as FormArray;
  }

  saveFormInput() {
    /*return this.form.get('payrolls').value;*/
  }

  setPayrolls() {
    const payroll: Payroll = {
      name: this.name,
      regular: this.regular,
      over: this.over,
      hotelId: localStorage.hotelId
    };
  }

  addNewPayroll(form: NgForm) {     /*Save*/
    /*this.hotelId = localStorage.hotelId;
    form.value.htId = this.hotelId;
    console.log(form.value);
    this.payrollService.addPayroll(form.value);*/
    console.log(form.value);
    this.hotelId = localStorage.hotelId;
    form.value.htId = this.hotelId;
    console.log(form.value);
    /*this.hotelId = this.afs.collection('payrolls').doc(localStorage.hotelId).ref.id;*/
    /*this.payrollService.addPayroll(form.value, this.hotelId);*/
    this.payrollService.addPayroll(form.value);
    console.log(form.value, this.hotelId);
  }


// popup
  openNewProperty(contentNewProperty) {
    this.modalService.open(contentNewProperty).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
