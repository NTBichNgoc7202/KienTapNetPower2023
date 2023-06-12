import { Component, OnInit } from '@angular/core';
import { User } from '../models/users';
import { UserserviceService } from '../service/userservice.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-change-profile',
  templateUrl: './change-profile.component.html',
  styleUrls: ['./change-profile.component.css'],
})
export class ChangeProfileComponent implements OnInit {
  userInfo: User = new User();
  public phone: string | null = '';
  constructor(
    private _userService: UserserviceService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this._activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      this.phone = params.get('phone');
    });
    if (this.phone == null) {
      this._router.navigate(['/login']);
    }
  }
  ngOnInit(): void {
    if(this.phone != null) {
      this.loadPersonalData(this.phone);
    }
  }
  loadPersonalData(phone: string) {
    this._userService.getUserByPhone(phone).subscribe({
      next: (data) => {
        this.userInfo = data;
      },
      error: (err) => console.log(err),
    });
  }
}
