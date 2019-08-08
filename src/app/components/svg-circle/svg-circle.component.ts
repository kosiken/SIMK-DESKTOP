import { Component, OnInit, Input } from '@angular/core';
import SvgCircle from '../../helpers/svg-circle';

@Component({
  selector: 'app-svg-circle',
  templateUrl: './svg-circle.component.html',
  styleUrls: ['./svg-circle.component.scss']
})
export class SvgCircleComponent implements OnInit {
@Input() radius: number;
arc: string;
  constructor() { }

  ngOnInit() {
    this.arc = SvgCircle(25, 25, 22.5, 0, this.radius);
  }

}
