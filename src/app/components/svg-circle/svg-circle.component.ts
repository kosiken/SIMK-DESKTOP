import { Component, OnInit, Input } from '@angular/core';
import { Subscription, interval, from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import SvgCircle from '../../helpers/svg-circle';

@Component({
  selector: 'app-svg-circle',
  templateUrl: './svg-circle.component.html',
  styleUrls: ['./svg-circle.component.scss']
})
export class SvgCircleComponent implements OnInit {
  @Input() radius: number;
  @Input() des: string;
  arc: string;
  inc: Subscription;
  constructor() {}

  ngOnInit() {
    // let mild = this.radius / 5;
    // let obs = interval(100).pipe(
    //   take(mild),
    //   map(_ => 5)
    // );
    // let n = 0;
    // const self = this;

    // this.inc = obs.subscribe(next => {
    //   n += next;
    //   self.drawArc(n);
    // });
    this.arc = SvgCircle(25, 25, 22.5, 0, this.radius);
  }


  private drawArc(raduis: number) {
    this.arc = SvgCircle(25, 25, 22.5, 0, raduis);
  }
}
