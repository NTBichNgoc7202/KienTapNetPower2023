import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { Component, OnInit } from '@angular/core';
import provinceData from '../../assets/data/provinces.json';
import districtData from '../../assets/data/districts.json';
import wardData from '../../assets/data/wards.json';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { UserserviceService } from '../service/userservice.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

interface Province {
  code: string;
  name: string;
  unit: string;
}
interface District {
  code: string;
  name: string;
  unit: string;
  province_code: string;
  province_name: string;
  full_name: string;
}

interface Ward {
  code: string;
  name: string;
  unit: string;
  district_code: string;
  district_name: string;
  province_code: string;
  province_name: string;
  full_name: string;
}

@Component({
  standalone: true,
  selector: 'app-location',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent implements OnInit {
  public phone: string | null = '';
  provinceSelect:any;
  districtSelect:any;
  wardSelect:any;
  form: FormGroup;
  matcher = new MyErrorStateMatcher();
  provinces: Array<Province>;
  districts: Array<District>;
  wards: Array<Ward>;

  province = new FormControl(null, [Validators.required]);
  district = new FormControl({ value: null, disabled: true }, [
    Validators.required,
  ]);
  ward = new FormControl({ value: null, disabled: true }, [
    Validators.required,
  ]);
  constructor(
    private _toast: ToastrService,
    private _userService: UserserviceService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.provinces = provinceData;
    this.districts = districtData;
    this.wards = wardData;
    this.form = this._formBuilder.group({
      province: this.province,
      district: this.district,
      ward: this.ward,
    });
  }
  ngOnInit(): void {
    this._activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      this.phone = params.get('phone');
    });
    if (this.phone == null) {
      this._router.navigate(['/login']);
    }
    // Event change province
    this.province.valueChanges.subscribe((province: any) => {
      this.district.reset();
      this.district.disable();
      if (province) {
        this.districts = districtData.filter(
          (x) => x.province_code == province.code
        );
        this.district.enable();
      }
    });
    // Event change district
    this.district.valueChanges.subscribe({
      next: (district: any) => {
        this.ward.reset();
        this.ward.disable();
        if (district) {
          this.wards = wardData.filter((x) => x.district_code == district.code);
          this.ward.enable();
        }
      },
    });
    // Get location
    this._userService.getLocation(this.phone).subscribe({
      next: (res: any) => {
        // this.form.patchValue({
        //   province: res.province,
        //   district: res.district,
        //   ward: res.ward,
        // });
        this.form.get('province')?.setValue(res.province);
        // this.form.controls['province'].patchValue(res.province);
        this.provinceSelect = res.province;
        this.districtSelect = res.district;
        this.wardSelect = res.ward;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  changeLocation(form: NgForm) {
    this._userService.updateLocation(this.phone, form).subscribe({
      next: (res: any) => {
        if (res.message == 'success') {
          this._toast.success('Đổi địa chỉ thành công');
        } else {
          this._toast.error('Đổi địa chỉ thất bại');
        }
      },
      error: (err: any) => {
        this._toast.error('Đổi địa chỉ thất bại');
      },
    });
  }
}
