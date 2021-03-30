import { Component, OnInit } from '@angular/core';
import { interval, fromEvent, Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent implements OnInit {

  subscriptionsAreActive:boolean = false 
  subscriptions:Subscription[] = []
  unsubscribeAll:Subject<any> = new Subject()

  constructor() { }

  ngOnInit(): void {
    this.checkSubscriptions()
  }

  checkSubscriptions() { 
    interval(100).subscribe(()=>{
      let active = false
      this.subscriptions.forEach((s)=>{
        if(!s.closed)
        active = true
      })
      this.subscriptionsAreActive = active
    })
    
  }

  subscribe(){ 
    const subscription1 = interval(100)
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe((i)=>{console.log(i)})

    const subscription2 = fromEvent(document,'mousemove')
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe((i)=>{console.log(i)})

    this.subscriptions.push(subscription1)
    this.subscriptions.push(subscription2)
  }

  unsubscribe(){ 
    this.unsubscribeAll.next()
  }

}
