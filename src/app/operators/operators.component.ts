import { Component, OnInit, ViewChild } from '@angular/core';
import { from, fromEvent, interval, Observable, Observer, Subscription, Subject, timer } from 'rxjs';
import { map, delay, filter, tap, take, first, last, debounceTime, takeWhile, takeUntil } from 'rxjs/operators';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.css']
})
export class OperatorsComponent implements OnInit {

  @ViewChild(MatRipple) ripple: MatRipple;

   searchInput:string = ''

  constructor() { }

  ngOnInit(): void {
  }

  mapClick() {
    from([1,2,3,4,5,6,7])
    .pipe ( 
      map(i=>i*2),
      map(i=>i*10),
      delay(1000)
    )
      .subscribe((i)=>console.log(i))

      fromEvent(document,'click')
      .pipe(
        map((e:MouseEvent )=> ({x:e.screenX,y:e.screenY}))
      )
      .subscribe(e=>console.log(e))
  }

  filterClick() { 

    from([1,2,3,4,5,6,7])
    .pipe ( 
      filter(i=>i%2==1)
     
    )
      .subscribe((i)=>console.log(i))

      interval(1000)
      .pipe ( 
        filter(i=> i%2==0),
        map(i=>'Value: '+i)
      )
      .subscribe(i=>console.log(i))

  }

  tapClick() { 
    interval(1000)
    .pipe ( 
      tap(i=>console.log('before everything')),
      tap(i=>console.log('before filtering',i)),
      filter(i=> i%2==0),
      tap(i=>console.log('after filtering')),
      map(i=>'Value: '+i),
      tap(i=>console.log('after map')),
    )
    .subscribe(i=>console.log(i))
  }

  takeClick() { 
    const observable = new Observable((observer)=>{ 
      let i:number;
      for(i=0;i<20;i++)
        setTimeout(()=>observer.next(Math.floor(Math.random()*100)),i*100)
        setTimeout(()=>observer.complete(),i*100)
       
    })
    const s:Subscription = observable
    .pipe( 
      tap(i=>console.log(i)),
      //take(10)
      //first()
      last()
    )
    .subscribe(v=>console.log('Output: ',v), 
     (error)=>console.log(error),
     ()=>console.log('Completed!'))

     const interv = setInterval(()=>{ 
       console.log("Checking...")
       if(s.closed) { 
         console.warn("SUBSCRIPTION CLOSED");
         clearInterval(interv)
       }
     },200)

  }

  launchRipple() { 
    const rippleRef = this.ripple.launch({
      persistent:true,
      centered:true });
      rippleRef.fadeOut()
  }

  debounceTimeClick() { 
    fromEvent(document,'click')
    .pipe( 
      tap((e)=>console.log('click')),
      debounceTime(1000)
    )
    .subscribe(
      (e:MouseEvent)=>{
      console.log('Click with debounceTime:',e)
      this.launchRipple()
    })
  }

  searchEntry$:Subject<string> = new Subject();
  searchBy_UsingDebounce(event) { 
    this.searchEntry$.next(this.searchInput)
  }

  debounceTimeSearch(){ 
    this.searchEntry$
    .pipe(debounceTime(1000))
    .subscribe(s=>console.log(s))
  }

  takeWhileClick() { 
    interval(500)
    .pipe(takeWhile((value,index)=>(value<5)))
    .subscribe(
      (i)=>console.log('take While: ',i) , 
      (error)=>console.error(error),
      ()=>console.log('Completed!'))
      
  }

  takeUntilSearch() { 

    let dueTimer$ = timer(5000)

    interval(500)
    .pipe(takeUntil(dueTimer$))
    .subscribe(
      (i)=>console.log('take While: ',i) , 
      (error)=>console.error(error),
      ()=>console.log('Completed!'))
      

  }

  testFromEvent(){
    let i = fromEvent(document,'click')
    i
    .pipe(
      map((i:MouseEvent)=>i),
      take(10)
    )
    .subscribe(i=>console.log(i),
    (error)=>(console.log(error)),
    ()=>console.log("COMPLETED"))
  }


}
