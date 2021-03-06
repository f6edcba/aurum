import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {DataStorageService} from "../shared/services/data-storage.service";
import {Router, NavigationEnd} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAdmin: boolean;
  noSuperAdmin: boolean;
  stateTitle: any;

  constructor(private authService: AuthService, private dataStorageService: DataStorageService, private router: Router) {
    this.stateTitle = "";
    let stateDependence = {
      "/room": "Inventory - Housekeeping",
      "/maintenance": "Inventory - Maintenance",
      "/fb": "Inventory - F & B",
      "/fd-misc": "Inventory - FD/Misc",
      "/houskeeping-data": "HK Goal",
      "/transactions-date": "Transaction",
      "/home": "Home",
      "/activity-chat": "Activity Log",
      "/payroll": "Payroll",
      "/vendors": "Information - Vendor",
      "/credentials": "Information - Credential",
      "/employee": "Information - Employee",
      "/bills-misc": "Upload - Bills",
      "/forms": "Upload - Forms",
      "/hotels": ""
    }
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.stateTitle = stateDependence[event.url];
      }
    })
  }

  ngOnInit() {
    this.noSuperAdmin = true;
    this.isAdmin = DataStorageService.isAdmin;
    if(this.dataStorageService.getUser().role == "superadmin"){
      this.noSuperAdmin = false;
    }

  }

  onLogout() {
    this.authService.logout();
    this.dataStorageService.removeDataFromLocalStorage();
  }
}
